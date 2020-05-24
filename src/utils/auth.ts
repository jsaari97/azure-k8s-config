import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { AppConfigurationClient } from "@azure/app-configuration";

require("dotenv").config();

// Validate environment variables
if (!process.env.AZURE_KEYVAULT_NAME) {
  throw new Error('AZURE_KEYVAULT_NAME env variable missing!')
}

if (!process.env.AZURE_APP_CONFIG_NAME) {
  throw new Error('AZURE_APP_CONFIG_NAME env variable missing!')
}

// Setup Azure Credentials
const credential = new DefaultAzureCredential();
const url = `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`;
const endpoint = `https://${process.env.AZURE_APP_CONFIG_NAME}.azconfig.io`;

// Export authenticated clients
export const vaultClient = new SecretClient(url, credential);
export const appClient = new AppConfigurationClient(endpoint, credential);
