import { appClient, vaultClient } from "./auth";

interface KeyVaultRef {
  uri: string;
}

export const fetchValue = async (key: string): Promise<string> => {
  try {
    const { value } = await appClient.getConfigurationSetting({
      key,
    });

    if (!value) {
      return Promise.reject();
    }

    if (!value.match(/^\{\"uri\":/)) {
      return Promise.resolve(value);
    }

    const ref: KeyVaultRef = JSON.parse(value);

    // Extract key from url
    const secret = await vaultClient.getSecret(
      ref.uri.substr(ref.uri.lastIndexOf("/") + 1)
    );

    if (!secret.value) {
      return Promise.reject();
    }

    return Promise.resolve(secret.value);
  } catch (e) {
    return Promise.reject(e);
  }
};
