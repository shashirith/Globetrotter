import clientPromise from "../lib/mongodb";

export async function getdbTable<T = Document>(name: string) {
  const client = await clientPromise;
  const db = client.db("globethrotter");
  const collection = db.collection<T & Document>(name);
  return collection;
}
