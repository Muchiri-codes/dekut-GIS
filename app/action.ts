"use server";
import clientPromise from "@/lib/mongodb";

export async function getLandmarksFromDB(query: string) {
  try {
    const client = await clientPromise;
    const db = client.db("dekut_landmarks");
    
    const collectionNames = [
      "buildings", 
      "parking", 
      "entrances",
      "emergency_points"
    ]; 

    // 2. Create a search promise for every collection
    const searchPromises = collectionNames.map(async (colName) => {
      return db.collection(colName).aggregate([
        { $unwind: "$features" },
        { 
          $match: { 
            "features.properties.name": { $regex: query, $options: "i" } 
          } 
        },
        { $limit: 3 } // Limit per collection to keep it fast
      ]).toArray();
    });
    const resultsArray = await Promise.all(searchPromises);
    const combinedResults = resultsArray.flat();

    console.log(`Searching all collections for: ${query} | Found: ${combinedResults.length}`);

    return combinedResults.map(item => ({
      name: item.features.properties.name || item.features.properties.use || "Unnamed Location",
      lat: item.features.geometry.coordinates[1],
      lng: item.features.geometry.coordinates[0]
    }));
  } catch (e) {
    console.error("Multi-collection search error:", e);
    return [];
  }
}