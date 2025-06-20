import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.development.local" });

const sql = neon(process.env.DATABASE_URL!);

type Creature = {
  scientific_name: string;
  average_depth: number;
};

const data: Creature[] = [
  { scientific_name: "Melanocetus johnsonii", average_depth: 1500 }, // Anglerfish
  { scientific_name: "Architeuthis dux", average_depth: 1000 }, // Giant Squid
  { scientific_name: "Holothuria edulis", average_depth: 400 }, // Sea Cucumber
  { scientific_name: "Grimpoteuthis spp.", average_depth: 3000 }, // Dumbo Octopus
  { scientific_name: "Psychrolutes marcidus", average_depth: 1000 }, // Blobfish
  { scientific_name: "Myctophum punctatum", average_depth: 500 }, // Lanternfish
  { scientific_name: "Vampyroteuthis infernalis", average_depth: 800 }, // Vampire Squid
  { scientific_name: "Argyropelecus gigas", average_depth: 1200 }, // Hatchetfish
  { scientific_name: "Chlamydoselachus anguineus", average_depth: 1500 }, // Frilled Shark
];

async function seed() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS creatures (
        id SERIAL PRIMARY KEY,
        scientific_name TEXT UNIQUE NOT NULL,
        average_depth INTEGER NOT NULL
      );
    `;

    for (const creature of data) {
      await sql`
        INSERT INTO creatures (scientific_name, average_depth)
        VALUES (${creature.scientific_name}, ${creature.average_depth})
        ON CONFLICT (scientific_name) DO NOTHING;
      `;
    }

    console.log("Seeded database successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
