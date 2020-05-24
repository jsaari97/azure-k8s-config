import { SecretConfig } from "../types";
import { getValue } from "./get";

export const parseConfig = async (config: SecretConfig) => {
  try {
  const clone: SecretConfig = JSON.parse(JSON.stringify(config));

  const data = await Promise.all(
    Object.entries(clone.data).map(([key, value]) => getValue(value))
  );

  console.log(data)
  } catch (e) {
    return Promise.reject()
  }
};
