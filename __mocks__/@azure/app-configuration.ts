import { RestError } from "@azure/core-http";

export class AppConfigurationClient {
  async getConfigurationSetting({ key }: { key: string }) {
    if (key === "my-secret-key") {
      return Promise.resolve({
        value: JSON.stringify({ uri: "secret" }),
      });
    }

    if (key === "not-found") {
      return Promise.reject(new RestError("", "", 404));
    }

    return Promise.resolve({
      value: "my-value",
    });
  }
}
