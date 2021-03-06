import { getValue } from "./get";

describe("Azure: Get Value", () => {
  it("should return app config value", async () => {
    const value = await getValue("my-key");

    expect(value).toEqual("my-value");
  });

  it("should return secret value", async () => {
    const value = await getValue("my-secret-key");

    expect(value).toEqual("my-secret-value");
  });

  it("should throw if key not found", async () => {
    expect(getValue("not-found")).rejects.toThrow(
      `The key "not-found" was not found`
    );
  });
});
