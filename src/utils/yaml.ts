import yaml from "js-yaml";
import { SecretConfig } from "../types";

export const parseYaml = (data: string): SecretConfig =>
  yaml.load(data) as SecretConfig;

export const formatYaml = (data: SecretConfig): string => yaml.dump(data);
