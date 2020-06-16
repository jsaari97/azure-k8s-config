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
      return Promise.reject(
        new Error("Failed to retrieve App Configuration value")
      );
    }

    // Check if key value is an Key Vault reference
    if (!value.match(/^\{"uri":/)) {
      return Promise.resolve(value);
    }

    if (!vaultClient) {
      return Promise.reject(new Error("Key Vault is not set up"));
    }

    const ref: KeyVaultRef = JSON.parse(value);

    // Fetch secret value from Key Vault
    const secret = await vaultClient.getSecret(
      // Extract key from url
      ref.uri.substr(ref.uri.lastIndexOf("/") + 1)
    );

    if (!secret.value) {
      return Promise.reject(new Error("Failed to retrieve Key Vault value"));
    }

    return Promise.resolve(secret.value);
  } catch (error) {
    if (typeof error === "object" && error.statusCode) {
      switch (error.statusCode) {
        case 404:
          return Promise.reject(new Error(`The key "${key}" was not found`));
        case 503:
          return Promise.reject(new Error(`Unauthorized access to App Config`));
      }
    }

    return Promise.reject(error);
  }
};
