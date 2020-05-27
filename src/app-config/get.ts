import { appClient, vaultClient } from "./auth";

interface KeyVaultRef {
  uri: string;
}

export const getValue = async (
  key: string,
  label?: string
): Promise<string> => {
  try {
    // Fetch App Config key value and pass key and label args
    const { value } = await appClient.getConfigurationSetting({
      key,
      label,
    });

    if (!value) {
      return Promise.reject();
    }

    // Check if key value is an Key Vault reference
    if (!value.match(/^\{"uri":/)) {
      return Promise.resolve(value);
    }

    const ref: KeyVaultRef = JSON.parse(value);

    // Fetch secret value from Key Vault
    const secret = await vaultClient.getSecret(
      // Extract key from url
      ref.uri.substr(ref.uri.lastIndexOf("/") + 1)
    );

    if (!secret.value) {
      return Promise.reject();
    }

    return Promise.resolve(secret.value);
  } catch (error) {
    return Promise.reject(error);
  }
};
