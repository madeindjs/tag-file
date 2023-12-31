import { walkDir } from "./fs.utils.mjs";
import { hasTag } from "./tag.mjs";

/**
 * @param {string} dir
 * @param {string | string[]} tagOrTags one or multiples tags
 * @returns {AsyncGenerator}
 */
export async function* search(dir, tagOrTags) {
  for await (const file of walkDir(dir)) {
    if (hasTag(file, tagOrTags)) yield file;
  }
}
