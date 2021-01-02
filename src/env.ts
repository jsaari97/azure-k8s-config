import dotenv from "dotenv";

if (process.env.NODE_ENV !== "test") {
  dotenv.config();
}

const {
  AZURE_APP_CONFIG_NAME = "",
  AZURE_TENANT_ID = "",
  AZURE_CLIENT_ID = "",
  AZURE_CLIENT_SECRET = "",
  AZURE_KEYVAULT_NAME = "",
} = process.env;

export {
  AZURE_APP_CONFIG_NAME,
  AZURE_TENANT_ID,
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET,
  AZURE_KEYVAULT_NAME,
};
