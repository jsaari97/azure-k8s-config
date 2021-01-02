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

  it("should not fail if only missing AZURE_KEYVAULT_NAME", async () => {
    delete process.env.AZURE_KEYVAULT_NAME;

    const auth = await import("./auth");

    expect(auth.appClient).toBeTruthy();
    expect(auth.appClient).toEqual(appClient);
    expect(auth.vaultClient).toEqual(null);
  });
});
