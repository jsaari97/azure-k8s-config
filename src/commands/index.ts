import { Command, flags } from "@oclif/command";
import cli from "cli-ux";
import generate from "..";

class AzureK8sConfigCommand extends Command {
  static description =
    "Generate Kubernetes Secrets from Azure App Configuration and Key Vault data";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    recursive: flags.boolean({ char: "R" }),
    force: flags.boolean({ char: "f" }),
  };

  static args = [
    { name: "input", required: true, description: "input directory" },
    { name: "output", required: true, description: "output directory" },
  ];

  async run() {
    const { args, flags } = this.parse(AzureK8sConfigCommand);

    cli.action.start("Generating k8s secrets");

    try {
      await generate({
        input: args.input,
        output: args.output,
        recursive: flags.recursive,
        force: flags.force,
      });

      cli.action.stop();
    } catch (error) {
      cli.action.stop("failed");

      cli.error(error.toString().replace("Error: ", ""));
    }
  }
}

export = AzureK8sConfigCommand;
