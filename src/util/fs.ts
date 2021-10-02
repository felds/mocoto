import fs from "fs";
import path from "path";

/**
 * Import all the files of a directory.
 */
export async function importDir(dir: string): Promise<any> {
  const files = fs.readdirSync(dir);
  return Promise.all(files.map((f) => import(path.join(dir, f))));
}
