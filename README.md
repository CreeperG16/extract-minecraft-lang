# extract-minecraft-lang

This is a simple script that extracts and parses Minecraft .lang files for specific version(s). It works by:
- Downloading the vanilla Bedrock Dedicated Server zipfile
- Extracting the `en_US.lang` file from `resource_packs/vanilla/texts/en_US.lang`
- Parsing the lang file into JSON keys and values

## Usage

To download, extract and parse a single version's language file, run:
```bash
node index.js <version> <outDir>
```

To download, extract and parse all bedrock versions' (from [minecraft-data](https://github.com/PrismarineJS/minecraft-data/)) language files, you can run:
```bash
node index.js --all
```
This will download the language files for all bedrock versions in `require("minecraft-data").versions.bedrock`.
