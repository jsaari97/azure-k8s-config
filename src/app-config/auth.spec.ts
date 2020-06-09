import { appClient } from "./auth";

describe("Azure: Authentication", () => {
  it("should return app config value", async () => {
    const { value } = await appClient.getConfigurationSetting({
      key: "my-key",
    });

    expect(value).toEqual("my-value");
  });

  it.todo("should fail if missing APP_CONFIG_NAME");

  it.todo("should not fail if only missing APP_KEYVAULT_NAME");
});
