const { getLang } = require("./language.js");

const [,, version, outDir] = process.argv;

(async () => {
  if (version === undefined || outDir === undefined) throw new Error("Usage: node index.js <version> <outDir>");

  await getLang(outDir, version);

  console.log(`Downloaded and parsed language file for version ${version}.`);
})()
