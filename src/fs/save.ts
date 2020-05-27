import { promises as fs } from "fs";
import path from "path";
import { SecretConfig } from "../types";
import { toYaml } from "../utils/yaml";

const makeDir = async (pathName: string): Promise<void> => {
  try {
    const dir = pathName.substring(0, pathName.lastIndexOf("/"));
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    Promise.reject(error);
  }
};

const save = async (pathName: string, config: SecretConfig): Promise<void> => {
  try {
    await makeDir(pathName);
    const data = toYaml(config);
    await fs.writeFile(pathName, data, "utf8");
  } catch (error) {
    Promise.reject(error);
  }
};

export const saveConfigurations = async (
  outputPath: string,
  configs: [string, SecretConfig][]
): Promise<void> => {
  await Promise.all(
    configs.map(async ([pathName, config]) => {
      const fullPath = path.join(process.cwd(), outputPath, pathName);

      await save(fullPath, config);
    })
  );
};
