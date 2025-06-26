import * as fs from "fs/promises";
import * as path from "path";

const DATA_DIR = path.resolve("data", "obis_parquet", "occurrence");
const OUTPUT_FILE = path.resolve("data", "speciesList.json");
const MAP_FILE = path.resolve("data", "scientificNameMap.json");

type SpeciesStats = {
  totalDepth: number;
  count: number;
};

let sciToCommon: Record<string, string> = {};
const speciesStats = new Map<string, SpeciesStats>();

async function loadScientificNameMap(): Promise<Record<string, string>> {
  const raw = await fs.readFile(MAP_FILE, "utf8");
  return JSON.parse(raw);
}

async function readParquetFile(filePath: string): Promise<void> {
  const { asyncBufferFromFile, parquetReadObjects } = await import("hyparquet");

  const file = await asyncBufferFromFile(filePath);
  const records = await parquetReadObjects({
    file,
    columns: ["scientificName", "depth"],
    rowFormat: "object",
  });

  for (const { scientificName, depth } of records) {
    if (!scientificName || typeof depth !== "number") continue;
    if (!(scientificName in sciToCommon)) continue;

    const stats = speciesStats.get(scientificName) ?? {
      totalDepth: 0,
      count: 0,
    };
    stats.totalDepth += depth;
    stats.count += 1;
    speciesStats.set(scientificName, stats);
  }
}

async function main() {
  sciToCommon = await loadScientificNameMap();
  const files = await fs.readdir(DATA_DIR);

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    console.log(`Reading ${file}...`);
    await readParquetFile(filePath);
  }

  const result = Array.from(speciesStats.entries()).map(([sciName, stats]) => ({
    scientificName: sciName,
    commonName: sciToCommon[sciName],
    averageDepth: Number((stats.totalDepth / stats.count).toFixed(2)),
    occurrenceCount: stats.count,
  }));

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(result, null, 2));
  console.log(`Saved ${result.length} species to ${OUTPUT_FILE}`);
}

main().catch(console.error);
