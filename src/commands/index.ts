import { Command, flags } from "@oclif/command";
import cli from "cli-ux";
import generate from "..";

class AzureAppConfigK8sCommand extends Command {
  static description =
    "Generate Kubernetes Secrets from Azure App Configuration and Key Vault keys";

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

    cli.action.start("Generating k8s secrets");

    await generate({
      input: args.input,
      output: args.output,
    });

    cli.action.stop();
  }
}

export = AzureAppConfigK8sCommand;
