import * as https from "https";
import * as fs from "fs/promises";
import * as path from "path";

const UNIPROT_URL =
  "https://ftp.uniprot.org/pub/databases/uniprot/knowledgebase/complete/docs/speclist.txt";
const OUTPUT_FILE = path.resolve(
  process.cwd(),
  "data",
  "scientificNameMap.json"
);

function fetchText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(
            new Error(`Request failed with status code: ${res.statusCode}`)
          );
          return;
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

async function parseScientificNameMap(
  content: string
): Promise<Map<string, string>> {
  const lines = content.split(/\r?\n/);

  const sciToCommon = new Map<string, string>();
  let currentScientificName: string | null = null;
  let inRealOrganismSection = false;

  for (const line of lines) {
    if (!inRealOrganismSection && line.includes("Real organism codes")) {
      inRealOrganismSection = true;
      continue;
    }
    if (inRealOrganismSection && line.includes("Virtual")) break;
    if (!inRealOrganismSection) continue;

    const nMatch = line.match(/N=([^\r\n]+?)(?=\s+[A-Z]=|$)/);
    if (nMatch) {
      currentScientificName = nMatch[1].trim();
    }
    const cMatch = line.match(/C=([^\r\n]+?)(?=\s+[A-Z]=|$)/);
    if (cMatch && currentScientificName) {
      sciToCommon.set(currentScientificName, cMatch[1].trim());
      currentScientificName = null;
    }
  }

  return sciToCommon;
}

async function saveMapAsJSON(map: Map<string, string>, filepath: string) {
  const obj = Object.fromEntries(map);
  await fs.writeFile(filepath, JSON.stringify(obj, null, 2), "utf-8");
  console.log(`Saved ${map.size} entries to ${filepath}`);
}

async function main() {
  try {
    console.log("Downloading UniProt speclist...");
    const content = await fetchText(UNIPROT_URL);

    console.log("Parsing speclist...");
    const map = await parseScientificNameMap(content);

    await saveMapAsJSON(map, OUTPUT_FILE);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
