import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, scientific_name, average_depth
      FROM creatures
      ORDER BY RANDOM()
      LIMIT 100;
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching creatures:", error);
    return NextResponse.json(
      { error: "Failed to fetch creatures" },
      { status: 500 }
    );
  }
}
