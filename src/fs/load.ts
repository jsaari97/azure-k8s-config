import { promises as fs } from "fs";
import path from "path";
import { SecretConfig } from "../types";
import { fromYaml } from "../utils/yaml";

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

export const loadConfigurations = async (
  inputPath: string
): Promise<[string, SecretConfig][]> => {
  const fullInputPath = path.resolve(process.cwd(), inputPath);
  const paths = await walker(fullInputPath);
  const configs = await Promise.all(
    paths.map(
      async (pathName): Promise<[string, SecretConfig]> => {
        const data = await readFile(pathName);

        return [pathName.substr(fullInputPath.length), fromYaml(data)];
      }
    )
  );

  return configs;
};
