import { Command, flags } from "@oclif/command";
import cli from "cli-ux";
import generate from "..";

class AzureK8sConfigCommand extends Command {
  static description =
    "Generate Kubernetes Secrets from Azure App Configuration and Key Vault data";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
  };

  static args = [
    { name: "input", required: true, description: "input directory" },
    { name: "output", required: true, description: "output directory" },
  ];

  async run() {
    const { args } = this.parse(AzureK8sConfigCommand);

    cli.action.start("Generating k8s secrets");

    await generate({
      input: args.input,
      output: args.output,
    });

    cli.action.stop();
  }
}

export = AzureK8sConfigCommand;
