import { Command, flags } from "@oclif/command";
import generate from "../";

class AzureAppConfigK8sCommand extends Command {
  static description = "Generate Kubernetes Secrets from Azure App Configuration and Key Vault keys";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
  };

  static args = [
    { name: "input", required: true, description: "input directory" },
    { name: "output", required: true, description: "output directory" },
  ];

  async run() {
    const { args } = this.parse(AzureAppConfigK8sCommand);

    if (!args.input) {
      this.error("Input argument is missing");
    }

    if (!args.output) {
      this.error("Output argument is missing");
    }

    await generate({
      input: args.input,
      output: args.output,
    });

    this.log('Sucessfully generated k8s secrets!')
  }
}

export = AzureAppConfigK8sCommand;
