export class SecretClient {
  async getSecret() {
    return Promise.resolve({
      value: "my-secret-value",
    });
  }
}
