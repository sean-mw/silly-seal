import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import * as fs from "fs/promises";
import * as path from "path";

dotenv.config({ path: ".env.development.local" });

const sql = neon(process.env.DATABASE_URL!);

type SpeciesRecord = {
  scientificName: string;
  commonName: string;
  averageDepth: number;
  occurrenceCount: number;
};

async function seed() {
  try {
    const speciesListPath = path.resolve("data", "speciesList.json");
    const raw = await fs.readFile(speciesListPath, "utf-8");
    const data: SpeciesRecord[] = JSON.parse(raw);

    await sql`
      CREATE TABLE IF NOT EXISTS species (
        id SERIAL PRIMARY KEY,
        scientific_name TEXT UNIQUE NOT NULL,
        common_name TEXT,
        average_depth INTEGER NOT NULL,
        occurrence_count INTEGER
      );
    `;

    for (const species of data) {
      await sql`
        INSERT INTO species (scientific_name, common_name, average_depth, occurrence_count)
        VALUES (
          ${species.scientificName},
          ${species.commonName},
          ${Math.round(species.averageDepth)},
          ${species.occurrenceCount}
        )
        ON CONFLICT (scientific_name) DO NOTHING;
      `;
    }

    console.log(`Seeded ${data.length} species to the database successfully.`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
