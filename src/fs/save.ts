import { promises as fs } from "fs";
import path from "path";

const makeDir = async (pathName: string): Promise<void> => {
  try {
    const dir = pathName.substring(0, pathName.lastIndexOf("/"));
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    Promise.reject(error);
  }
};

const save = async (pathName: string, config: string): Promise<void> => {
  try {
    await makeDir(pathName);
    await fs.writeFile(pathName, config, "utf8");
  } catch (error) {
    Promise.reject(error);
  }
};

export const saveConfigurations = async (
  outputPath: string,
  configs: [string, string][]
): Promise<void> => {
  await Promise.all(
    configs.map(async ([pathName, config]) => {
      const fullPath = path.join(process.cwd(), outputPath, pathName);

      await save(fullPath, config);
    })
  );
};
