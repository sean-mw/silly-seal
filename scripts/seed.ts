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

type RLSRecord = [
  scientificName: string,
  commonName: string,
  link: string,
  surveyMethod: number,
  imageUrls: string[]
];

async function seed() {
  try {
    const speciesListPath = path.resolve("data", "speciesList.json");
    const rlsPath = path.resolve("data", "rls", "species.json");

    const [speciesRaw, rlsRaw] = await Promise.all([
      fs.readFile(speciesListPath, "utf-8"),
      fs.readFile(rlsPath, "utf-8"),
    ]);

    const speciesList: SpeciesRecord[] = JSON.parse(speciesRaw);
    const rlsData: Record<number, RLSRecord> = JSON.parse(rlsRaw);

    const rlsByScientificName = Object.values(rlsData).reduce(
      (acc, [scientificName, , , , imageUrls]) => {
        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
          acc[scientificName.toLowerCase()] = imageUrls;
        }
        return acc;
      },
      {} as Record<string, string[]>
    );

    await sql`
      CREATE TABLE IF NOT EXISTS species (
        id SERIAL PRIMARY KEY,
        scientific_name TEXT UNIQUE NOT NULL,
        common_name TEXT,
        average_depth INTEGER NOT NULL,
        occurrence_count INTEGER,
        image_urls TEXT[]
      );
    `;

    let insertedCount = 0;

    for (const species of speciesList) {
      const images = rlsByScientificName[species.scientificName.toLowerCase()];

      if (!images || images.length === 0 || species.averageDepth <= 0) continue;

      await sql`
        INSERT INTO species (
          scientific_name,
          common_name,
          average_depth,
          occurrence_count,
          image_urls
        ) VALUES (
          ${species.scientificName},
          ${species.commonName},
          ${Math.round(species.averageDepth)},
          ${species.occurrenceCount},
          ${images}
        )
        ON CONFLICT (scientific_name) DO NOTHING;
      `;

      insertedCount++;
    }

    console.log(
      `Seeded ${insertedCount} species to the database successfully.`
    );
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
