import { promises as fs } from "fs";
import path from "path";
import Yaml from "js-yaml";
import { SecretConfig } from "../types";

const concatPath = (p: string) => (dir: string) => path.join(p, dir);

const sortDirFiles = async (
  prom: Promise<[string[], string[]]>,
  cur: string
): Promise<[string[], string[]]> => {
  const acc = await prom;

  const stat = await fs.lstat(cur);
  if (stat.isDirectory()) {
    return [[...acc[0], cur], acc[1]];
  } else if (cur.match(/\.ya?ml$/)) {
    return [acc[0], [...acc[1], cur]];
  }

  return acc;
};

const walker = async (dir: string): Promise<string[]> => {
  const currentDir = await fs.readdir(dir);
  const [dirs, files] = await currentDir
    .map(concatPath(dir))
    .reduce(sortDirFiles, Promise.resolve([[], []]));
  const children = (await Promise.all(dirs.map(walker))).flat().filter(Boolean);

  return files.concat(children);
};

const readFile = (p: string) => fs.readFile(p, "utf8");

const parseYaml = (data: string) => Yaml.safeLoad(data) as SecretConfig;

export const loadConfigurations = async (inputPath: string): Promise<SecretConfig[]> => {
  const paths = await walker(path.resolve(process.cwd(), inputPath));
  const data = await Promise.all(paths.map(readFile));
  const configs = data.map(parseYaml);

  return configs;
};
