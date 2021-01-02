const variables = [
  "AZURE_APP_CONFIG_NAME",
  "AZURE_TENANT_ID",
  "AZURE_CLIENT_ID",
  "AZURE_CLIENT_SECRET",
];

export function validateEnvVariables(): void {
  for (const key of variables) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable '${key}'`);
    }
  }
}
