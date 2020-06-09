import { getValue } from "./get";

describe("Azure: Get Value", () => {
  it("should return app config value", async () => {
    const value = await getValue("my-key");

    expect(value).toEqual("my-value");
  });

  it.todo("should return secret value");
});
