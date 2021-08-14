import yargs from "yargs";
import generate from ".";
import ora from "ora";
import { validateEnvVariables } from "./validate";

interface CommandArguments {
  input: string;
  output?: string;
}

let spinner: ora.Ora;

const args = yargs
  .command<CommandArguments>(
    "$0 <input> <output>",
    "Generate kubernetes configs"
  )
  .demandCommand(2)
  .options({
    recursive: {
      alias: "r",
      describe: "recursively search subdirs for files",
      type: "boolean",
      default: false,
    },
    force: {
      alias: "f",
      describe: "allow local values",
      type: "boolean",
      default: false,
    },
  });

export async function run(): Promise<void> {
  try {
    const { input, output, recursive, force } = await args.argv;

    spinner = ora("Validating environment variables").start();

    validateEnvVariables();

    spinner.succeed();

    spinner = ora("Generating Kubernetes configurations").start();

    await generate({
      input,
      output,
      recursive,
      force,
    });

    spinner.succeed();

    spinner = ora("Done!").start().succeed();
  } catch (error) {
    spinner.fail();

    spinner = ora({
      text: error.message,
      indent: 2,
    })
      .start()
      .warn();
  }
}
