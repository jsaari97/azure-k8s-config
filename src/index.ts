import { loadConfigurations } from "./fs/load";
import { parseConfig } from "./app-config";
import { saveConfigurations } from "./fs/save";
import { SecretConfig, GenerateOptions } from "./types";
import { formatYaml } from "./utils/yaml";

export default async (options: GenerateOptions): Promise<string[]> => {
  try {
    const configs = await loadConfigurations(
      options.input,
      Boolean(options.recursive)
    );

    const parsed = await Promise.all(
      configs.map(
        async ([pathName, config]): Promise<[string, SecretConfig]> => {
          try {
            const parsedConfig = await parseConfig(
              config,
              Boolean(options.force)
            );

            return [pathName, parsedConfig];
          } catch (error) {
            return Promise.reject(error);
          }
        }
      )
    );

    const result = parsed.map(([pathName, config]): [string, string] => [
      pathName,
      formatYaml(config),
    ]);

    if (options.output) {
      await saveConfigurations(options.output, result);
    }

    return Promise.resolve(result.map(([, config]) => config));
  } catch (error) {
    return Promise.reject(error);
  }
};
