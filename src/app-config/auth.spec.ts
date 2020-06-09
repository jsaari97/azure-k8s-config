import { appClient } from "./auth";

describe("Azure: Authentication", () => {
  it("should return app config value", async () => {
    const { value } = await appClient.getConfigurationSetting({
      key: "my-key",
    });

    expect(value).toEqual("my-value");
  });
});
