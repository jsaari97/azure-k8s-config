import Yaml from "js-yaml";
import { SecretConfig } from "../types";

export const parseYaml = (data: string): SecretConfig =>
  Yaml.safeLoad(data) as SecretConfig;

export const formatYaml = (data: SecretConfig): string => Yaml.safeDump(data);
