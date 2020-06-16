import { SecretConfig } from "../types";
import { getValue } from "./get";
import { fromPairs } from "lodash";

export const readKey = (force: boolean) => async ([key, value]: [
  string,
  string
]): Promise<[string, string]> => {
  try {
    const raw = await getValue(value);
    const encoded = Buffer.from(raw).toString("base64");

    return [key, encoded];
  } catch (error) {
    if (!force) {
      return Promise.reject(error);
    }

    const encoded = Buffer.from(value).toString("base64");

    return [key, encoded];
  }
};

export const parseConfig = async (
  config: SecretConfig,
  force: boolean
): Promise<SecretConfig> => {
  try {
    const handleKey = readKey(force);

    const dataPairs = await Promise.all(
      Object.entries(config.data).map(handleKey)
    );

    const data: SecretConfig["data"] = fromPairs(dataPairs);

    return {
      ...config,
      data,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};
