import { promises as fs } from "fs";
import path from "path";
import { SecretConfig } from "../types";
import { parseYaml } from "../utils/yaml";

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
  try {
    const rootPath = path.resolve(process.cwd(), inputPath);
    const files: [string, SecretConfig][] = [];

    // check if single file
    if (path.extname(rootPath) && rootPath.match(/\.ya?ml$/)) {
      const data = await readFile(rootPath);
      files.push([
        inputPath.substr(inputPath.lastIndexOf("/")),
        parseYaml(data),
      ]);

      return files;
    }

    for await (const filePath of readFiles(rootPath, recursive)) {
      const data = await readFile(filePath);
      files.push([filePath.substr(rootPath.length), parseYaml(data)]);
    }

    return files;
  } catch (error) {
    return Promise.reject(error);
  }
};
