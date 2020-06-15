export interface SecretConfig {
  apiVersion: "v1";
  kind: "Secret";
  metadata: {
    name: string;
    namespace: string;
    [key: string]: string | number;
  };
  type: "Opaque";
  data: { [key: string]: string };
}

export interface GenerateOptions {
  input: string;
  output: string;
  recursive?: boolean;
}
