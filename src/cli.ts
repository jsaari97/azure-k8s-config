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
  }).argv;

export async function run(): Promise<void> {
  try {
    spinner = ora("Validating environment variables").start();

    validateEnvVariables();

    spinner.succeed();

    spinner = ora("Generating Kubernetes configurations").start();

    await generate({
      input: args.input,
      output: args.output,
      recursive: !!args.recursive,
      force: !!args.force,
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
