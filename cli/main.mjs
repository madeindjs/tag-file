#!/bin/node
import { Argument, Command, Option } from "commander";

import { addTagAndRename, removeTagAndRename, toggleTagAndRename } from "@tag-file/core";
import pkg from "./package.json" assert { type: "json" };

const program = new Command();

const filepathArgument = new Argument("<filepaths...>", "filenames or directories to edit");

const dryRunOption = new Option("-d, --dry-run", "don't move files");
const verboseOption = new Option("-v, --verbose", "display moved files");
const recursiveOption = new Option("-r, --recursive", "toggle files inside the directories");

program.name("tag-file").description(pkg.description).version(pkg.version);

program
  .command("toggle")
  .description("Add or remove the tags in the given filenames")
  .addArgument(filepathArgument)
  .requiredOption("-t, --tags <tags...>", "tag to toggle")
  .addOption(dryRunOption)
  .addOption(verboseOption)
  .addOption(recursiveOption)
  .action(async (files, options) => {
    for (const file of files) {
      await toggleTagAndRename(file, options.tags, {
        verbose: true,
        recursive: options.recursive,
        dryRun: options.dryRun,
      });
    }
  });

program
  .command("add")
  .description("Add the tags in the given filenames (if tag already exists, nothing happens).")
  .addArgument(filepathArgument)
  .requiredOption("-t, --tags <tags...>", "tag to toggle")
  .addOption(dryRunOption)
  .addOption(verboseOption)
  .addOption(recursiveOption)
  .action(async (files, options) => {
    for (const file of files) {
      await addTagAndRename(file, options.tags, {
        verbose: true,
        recursive: options.recursive,
        dryRun: options.dryRun,
      });
    }
  });

program
  .command("remove")
  .description("Remove the tags in the given filenames (if tag already exists, nothing happens).")
  .addArgument(filepathArgument)
  .requiredOption("-t, --tags <tags...>", "tag to toggle")
  .addOption(dryRunOption)
  .addOption(verboseOption)
  .addOption(recursiveOption)
  .action(async (files, options) => {
    for (const file of files) {
      await removeTagAndRename(file, options.tags, {
        verbose: true,
        recursive: options.recursive,
        dryRun: options.dryRun,
      });
    }
  });

program.parse();
