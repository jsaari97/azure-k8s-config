import { SecretConfig } from "../types";
import { getValue } from "./get";
import { fromPairs } from "lodash";

export const parseConfig = async (
  config: SecretConfig
): Promise<SecretConfig> => {
  try {
    const dataTuples = await Promise.all(
      Object.entries(config.data).map(async ([key, value]) => {
        const raw = await getValue(value);
        const encoded = Buffer.from(raw).toString("base64");
        return [key, encoded];
      })
    );

    const data: SecretConfig["data"] = fromPairs(dataTuples);

    return {
      ...config,
      data,
    };
  } catch (e) {
    return Promise.reject(e);
  }
};
