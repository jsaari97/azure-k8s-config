import { loadConfigurations } from "./fs/load";
import { parseConfig } from "./app-config";
import { saveConfigurations } from "./fs/save";
import { SecretConfig, GenerateOptions } from "./types";

export default async (options: GenerateOptions) => {
  try {
    const configs = await loadConfigurations(
      options.input,
      Boolean(options.recursive)
    );

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
