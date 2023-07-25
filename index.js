const { getLang } = require("./language.js");

async function getAllVersions() {
  const { versions } = require("minecraft-data");

  for (const { minecraftVersion: version } of versions.bedrock) {
    try {
      console.log(`> Downloading lang file for ${version}...`);
      await getLang("./language", version);
      console.log(`> Downloaded and parsed language file for version ${version}.`);
    } catch (e) {
      console.log(e.message);
    }
  }

  process.exit(0);
}

async function getOneVersion() {
  const [,, version, outDir] = process.argv;

  if (version === undefined || outDir === undefined) throw new Error("Usage: node index.js <version> <outDir>");

  await getLang(outDir, version);

  console.log(`Downloaded and parsed language file for version ${version}.`);

  process.exit(0);
}

if (process.argv.includes("--all")) {
  getAllVersions();
} else {
  getOneVersion();
}
