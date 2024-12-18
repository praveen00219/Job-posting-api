import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

export default (db) => {
  const jobsCollection = db.collection("jobs");

  // Create Job
  router.post("/", async (req, res) => {
    try {
      const result = await jobsCollection.insertOne(req.body);
      res
        .status(201)
        .json({ success: true, message: "Job created", job: result.ops[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get All Jobs
  router.get("/", async (req, res) => {
    try {
      const jobs = await jobsCollection.find().toArray();
      res.status(200).json({ success: true, jobs });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update Job
  router.put("/:id", async (req, res) => {
    try {
      const result = await jobsCollection.findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body },
        { returnDocument: "after" }
      );
      if (!result.value)
        return res
          .status(404)
          .json({ success: false, message: "Job not found" });
      res
        .status(200)
        .json({ success: true, message: "Job updated", job: result.value });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Delete Job
  router.delete("/:id", async (req, res) => {
    try {
      const result = await jobsCollection.findOneAndDelete({
        _id: new ObjectId(req.params.id),
      });
      if (!result.value)
        return res
          .status(404)
          .json({ success: false, message: "Job not found" });
      res
        .status(200)
        .json({ success: true, message: "Job deleted", job: result.value });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
};
