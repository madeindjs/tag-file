import path from "node:path";

/**
 * Check if the file contains the tag.
 * @param {string} file
 * @param {string | string[]} tagOrTags one or multiples tags. If it's an array, check that every tags exists in the filename
 * @returns {boolean}
 */
export function hasTag(file, tagOrTags) {
  if (Array.isArray(tagOrTags)) {
    return tagOrTags.every((tag) => hasTag(file, tag));
  }

  const basename = path.basename(file);

  return (
    basename.includes(`#${tagOrTags}.`) || basename.includes(`#${tagOrTags}#`) || basename.includes(`#${tagOrTags}#`)
  );
}
