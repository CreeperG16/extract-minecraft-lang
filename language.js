const cp = require("child_process");
const http = require("https");
const fs = require("fs");
const path = require("path");

/**
 * Slightly modified download function from extremeheat/minecraft-bedrock-server
 * @param {import("fs").PathLike} outDir Where to save the .lang file
 * @param {string} version Version to download
 * @returns {Promise<void>}
 */
async function downloadServerLang(outDir, version) {
  const versionStr = version.split(".").slice(0, 3).join(".");
  fs.mkdirSync(path.resolve(outDir), { recursive: true });

  async function getUrl() {
    const head = (url) =>
      new Promise((resolve, reject) => http.request(url, { method: "HEAD" }, resolve).on("error", reject).end());

    for (let i = 0; i < 8; i++) {
      const url = `https://minecraft.azureedge.net/bin-linux/bedrock-server-${versionStr}.${i
        .toString()
        .padStart(2, "0")}.zip`;
      const res = await head(url);

      if (res.statusCode === 200) return url;
    }

    throw new Error(`Did not find version for ${versionStr}`);
  }

  const url = await getUrl();

  // Download server
  cp.execSync(`curl -o ${outDir}/bds.zip ${url}`);

  // Extract lang file from zip
  if (process.platform === "linux")
    cp.execSync(`unzip -p ${outDir}/bds.zip resource_packs/vanilla/texts/en_US.lang > ${outDir}/en_US_${version}.lang`);
  else {
    cp.execSync(`tar -xf ${outDir}/bds.zip -C ${outDir}/ resource_packs/vanilla/texts/en_US.lang `);
    fs.writeFileSync(`${outDir}/en_US_${version}.lang`, fs.readFileSync(`${outDir}/resource_packs/vanilla/texts/en_US.lang`));
    fs.rmSync(`${outDir}/resource_packs`, { recursive: true });
  }

  // Delete files
  fs.rmSync(`${outDir}/bds.zip`);

  return;
}

/**
 * Parse the .lang file into JSON
 * @param {import("fs").PathLike} fileDir The directory the .lang file is located in
 * @returns {{ [key: string]: string }}
 */
function parseLang(fileDir, version, preserveLang) {
  const langText = fs.readFileSync(`${fileDir}/en_US_${version}.lang`);
  const langArr = langText
    .toString()
    .split("\n") // Split lines
    .map((x) => x.trim().replace(/#.*$/g, "").trim()) // Remove comments
    .filter((x) => x.length > 0) // Remove empty lines
    .map((x) => x.split("=")); // Split key/value

  // Delete file
  if (!preserveLang) fs.rmSync(`${fileDir}/en_US_${version}.lang`);

  return Object.fromEntries(langArr);
}

/**
 * Download a minecraft bedrock BDS zip, extract from it the language file, then parse and save it as a JSON file
 * @param {import("fs").PathLike} outDir Where to save the JSON file
 * @param {string} version The version to download
 * @param {boolean} preserveLang Whether to keep the .lang file after parsing - defaults to false
 */
async function getLang(outDir, version, preserveLang = false) {
  console.log("Downloading and extracting lang file...");
  await downloadServerLang(outDir, version);

  console.log("Parsing lang file...");
  const langObj = parseLang(outDir, version, preserveLang);

  console.log("Writing language JSON file...");
  fs.writeFileSync(`${outDir}/language_${version}.json`, JSON.stringify(langObj, null, 2));
}

// testing
//const OUT_DIR = "./out";
//const VERSION = "1.20.12";
//if (!module.parent) getLang(OUT_DIR, VERSION);

module.exports = { downloadServerLang, parseLang, getLang };
