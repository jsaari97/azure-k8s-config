export class AppConfigurationClient {
  getConfigurationSetting({ key }: { key: string }) {
    if (key === "my-secret-key") {
      return {
        value: JSON.stringify({ uri: "secret" }),
      };
    }

    return {
      value: "my-value",
    };
  }
}
