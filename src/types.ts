export interface SecretConfig {
  apiVersion: "v1";
  kind: "Secret";
  metadata: { name: string; namespace: string };
  type: "Opaque";
  data: { [key: string]: string };
}
