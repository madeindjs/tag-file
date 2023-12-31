import fs from "node:fs/promises";
import path from "node:path";
import { isDirectory, walkDir } from "./fs.utils.mjs";
import { hasTag } from "./tag.mjs";

/**
 * Change a given tag to the filename and return the new filename
 * @param {string} file
 * @param {string | string[]} tagOrTags one or multiples tags
 * @param {{ allowAddTag?: boolean, allowRemoveTag?: boolean }} opts
 */
export function changeTagToFilename(file, tagOrTags, opts = {}) {
  if (Array.isArray(tagOrTags)) {
    return tagOrTags.reduce((acc, tag) => toggleTagToFilename(acc, tag), file);
  }

  const { name, ext, dir, root } = path.parse(file);

  if (hasTag(file, tagOrTags)) {
    if (!opts.allowRemoveTag) return file;
    const basename = path.basename(file);
    const newBasename = basename.replace(`#${tagOrTags}.`, ".").replace(`#${tagOrTags}#`, "#");
    return `${dir}${root}${newBasename}`;
  } else {
    if (!opts.allowAddTag) return file;
    return `${dir}${root}${name}#${tagOrTags}${ext}`;
  }
}

/**
 * Change a given tag to the filename and rename if necessary
 * @param {string} file absolute or relative path
 * @param {string | string[]} tagOrTags one or multiples tags
 * @param {{ verbose?: boolean, recursive?: boolean, dryRun?: boolean, allowAddTag?: boolean, allowRemoveTag?: boolean }} opts
 */
export async function changeTagAndRename(file, tagOrTags, opts = {}) {
  if (opts.recursive && (await isDirectory(file))) {
    for await (const f of walkDir(file)) {
      toggleTagAndRename(f, tagOrTags, { ...opts, recursive: false });
    }
    return;
  }

  const newFilename = changeTagToFilename(file, tagOrTags, {
    allowAddTag: opts.allowAddTag,
    allowRemoveTag: opts.allowRemoveTag,
  });

  if (newFilename === file) return;
  if (!opts.dryRun) await fs.rename(file, newFilename);
  if (opts.verbose || opts.dryRun) console.log(`"${file}" => "${newFilename}"`);
}

// ALIASES
// =======

// TOGGLE
// ------

/**
 * Add or remove a given tag to the filename
 * @param {string} file
 * @param {string | string[]} tagOrTags one or multiples tags
 */
export const toggleTagToFilename = (file, tagOrTags) =>
  changeTagToFilename(file, tagOrTags, { allowAddTag: true, allowRemoveTag: true });

/**
 * Add or remove a given tag to the filename and then rename if necessary
 * @param {string} file absolute or relative path
 * @param {string | string[]} tagOrTags one or multiples tags
 * @param {{ verbose?: boolean, recursive?: boolean, dryRun?: boolean }} opts
 */
export const toggleTagAndRename = (file, tagOrTags, opts = {}) =>
  changeTagAndRename(file, tagOrTags, { ...opts, allowAddTag: true, allowRemoveTag: true });

// ADD
// ------

/**
 * Add a given tag to the filename (if tag already exists, nothing happens).
 * @param {string} file
 * @param {string | string[]} tagOrTags one or multiples tags
 */
export const addTagToFilename = (file, tagOrTags) => changeTagToFilename(file, tagOrTags, { allowAddTag: true });

/**
 * Add a given tag to the filename and then rename if necessary (if tag already exists, nothing happens).
 * @param {string} file absolute or relative path
 * @param {string | string[]} tagOrTags one or multiples tags
 * @param {{ verbose?: boolean, recursive?: boolean, dryRun?: boolean }} opts
 */
export const addTagAndRename = (file, tagOrTags, opts = {}) =>
  changeTagAndRename(file, tagOrTags, { ...opts, allowAddTag: true });

// REMOVE
// ------

/**
 * Remove a given tag to the filename (if tag not already exists, nothing happens).
 * @param {string} file
 * @param {string | string[]} tagOrTags one or multiples tags
 */
export const removeTagToFilename = (file, tagOrTags) => changeTagToFilename(file, tagOrTags, { allowRemoveTag: true });

/**
 * Remove a given tag to the filename and then rename if necessary (if tag not already exists, nothing happens).
 * @param {string} file absolute or relative path
 * @param {string | string[]} tagOrTags one or multiples tags
 * @param {{ verbose?: boolean, recursive?: boolean, dryRun?: boolean }} opts
 */
export const removeTagAndRename = (file, tagOrTags, opts = {}) =>
  changeTagAndRename(file, tagOrTags, { ...opts, allowRemoveTag: true });
