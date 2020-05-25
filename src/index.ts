import { loadConfigurations } from "./fs/load";
import { parseConfig } from "./app-config";
import { saveConfigurations } from "./fs/save";
import { SecretConfig } from "./types";

export interface GenerateOptions {
  input: string;
  output: string;
}

const main = async (opts: GenerateOptions) => {
  try {
    const configs = await loadConfigurations(opts.input);
    const parsed = await Promise.all(
      configs.map(
        async ([pathName, config]): Promise<[string, SecretConfig]> => {
          const parsedConfig = await parseConfig(config);
          return [pathName, parsedConfig];
        }
      )
    );
    await saveConfigurations(opts.output, parsed);
  } catch (e) {
    console.log(e);
  }
};

main({ input: "./configs", output: "./outputs" });
