"use server";
import clientPromise from "@/lib/mongodb";

export async function getLandmarksFromDB(query: string) {
  try {
    const client = await clientPromise;
    const db = client.db("dekut_landmarks"); 
    const locations = await db.collection("landmarks")
      .find({ name: { $regex: query, $options: "i" } })
      .limit(5)
      .toArray();

    // Map MongoDB _id out so it doesn't break serialisation
    return locations.map(loc => ({
      name: loc.name,
      lat: loc.lat,
      lng: loc.lng
    }));
  } catch (e) {
    console.error("Database search error:", e);
    return [];
  }
}