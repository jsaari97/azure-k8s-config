import { appClient } from "./auth";

describe("Azure: Authentication", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("should return app config value", async () => {
    const { value } = await appClient.getConfigurationSetting({
      key: "my-key",
    });

    expect(value).toEqual("my-value");
  });

  it("should fail if missing AZURE_APP_CONFIG_NAME", async () => {
    delete process.env.AZURE_APP_CONFIG_NAME;

    expect(import("./auth")).rejects.toThrow(
      "AZURE_APP_CONFIG_NAME variable missing!"
    );
  });

  it("should not fail if only missing AZURE_KEYVAULT_NAME", async () => {
    delete process.env.AZURE_KEYVAULT_NAME;

    const m = await import("./auth");

    expect(m.appClient).toBeTruthy();
    expect(m.appClient).toEqual(appClient);
    expect(m.vaultClient).toEqual(null);
  });
});
