import { loadConfigurations } from "./fs/load";
import { parseConfig } from "./app-config";
import { saveConfigurations } from "./fs/save";
import { SecretConfig } from "./types";

export interface GenerateOptions {
  input: string;
  output: string;
}

export default async (options: GenerateOptions) => {
  try {
    const configs = await loadConfigurations(options.input);
    const parsed = await Promise.all(
      configs.map(
        async ([pathName, config]): Promise<[string, SecretConfig]> => {
          const parsedConfig = await parseConfig(config);
          return [pathName, parsedConfig];
        }
      )
    );
    await saveConfigurations(options.output, parsed);
  } catch (error) {
    return Promise.reject(error);
  }
};
