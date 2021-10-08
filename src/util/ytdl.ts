import YoutubeDlWrap from "youtube-dl-wrap";
import path from "path";
import fs from "fs";

export async function createYtdl(
  forceDownload = false,
): Promise<YoutubeDlWrap> {
  const filename = path.join(process.cwd(), "var", "youtube-dl");
  const maxAge = 86_400_000; // 1_000 * 60 * 60 * 24; // 24hs
  let stat;
  try {
    stat = fs.statSync(filename);
  } catch (err) {
    console.log("Youtube-dl bin not found.");
  }

  if (forceDownload || !stat || Date.now() - stat.mtimeMs > maxAge) {
    await YoutubeDlWrap.downloadFromGithub(filename);
    fs.chmodSync(filename, "0755");
    console.log("Downloaded latest youtube-dl version from github.");
  } else {
    console.log("No need to download youtube-dl.");
  }

  return new YoutubeDlWrap(filename);
}
