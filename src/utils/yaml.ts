import Yaml from "js-yaml";
import { SecretConfig } from "../types";

export const fromYaml = (data: string) => Yaml.safeLoad(data) as SecretConfig;

export const toYaml = (data: SecretConfig) => Yaml.safeDump(data);
