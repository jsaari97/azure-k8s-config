import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { AppConfigurationClient } from "@azure/app-configuration";
import { AZURE_KEYVAULT_NAME, AZURE_APP_CONFIG_NAME } from "../env";

// Setup Azure Credentials
const credential = new DefaultAzureCredential();
const url = AZURE_KEYVAULT_NAME
  ? `https://${AZURE_KEYVAULT_NAME}.vault.azure.net`
  : null;
const endpoint = `https://${AZURE_APP_CONFIG_NAME}.azconfig.io`;

// Export authenticated clients
export const vaultClient = url ? new SecretClient(url, credential) : null;
export const appClient = new AppConfigurationClient(endpoint, credential);
