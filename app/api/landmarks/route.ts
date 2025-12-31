
import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("dekut_nav");

    // Fetch all landmarks from your "places" collection
    const landmarks = await db.collection("places").find({}).toArray();

    return NextResponse.json(landmarks);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to connect to database" }, { status: 500 });
  }
}