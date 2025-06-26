import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = await sql`
      SELECT
        id,
        scientific_name,
        common_name,
        average_depth,
        occurrence_count
      FROM species
      ORDER BY RANDOM()
      LIMIT 100;
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching species:", error);
    return NextResponse.json(
      { error: "Failed to fetch species" },
      { status: 500 }
    );
  }
}
