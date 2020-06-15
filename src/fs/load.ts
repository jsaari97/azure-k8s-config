import { promises as fs } from "fs";
import path from "path";
import { SecretConfig } from "../types";
import { fromYaml } from "../utils/yaml";

const readFile = (p: string) => fs.readFile(p, "utf8");

async function* readFiles(
  dir: string,
  recursive: boolean
): AsyncIterable<string> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory() && recursive) {
      yield* readFiles(res, true);
    } else if (res.match(/\.ya?ml$/)) {
      yield res;
    }
  }
}

export const loadConfigurations = async (
  inputPath: string,
  recursive: boolean
): Promise<[string, SecretConfig][]> => {
  const rootPath = path.resolve(process.cwd(), inputPath);
  const files: [string, SecretConfig][] = [];

  for await (const file of readFiles(rootPath, recursive)) {
    const data = await readFile(file);
    files.push([file.substr(rootPath.length), fromYaml(data)]);
  }

  return files;
};
