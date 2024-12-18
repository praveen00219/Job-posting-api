import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ServerApiVersion } from "mongodb";
import jobRoutes from "./routes/jobs.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection URI and Client
const uri =
  "mongodb+srv://paru2192000:ZdQCdi5JDhrWeHMG@cluster0.hjiwj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");

    // Pass the database instance to routes
    const db = client.db("jobDB");
    app.use("/api/jobs", jobRoutes(db));
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDatabase();

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
