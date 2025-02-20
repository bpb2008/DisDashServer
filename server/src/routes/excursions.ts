import express, { Request, Response } from "express";
import { db } from "../db-connection"; 
import { checkJwt } from "../middleware/auth";

const router = express.Router();

//Create A New Excursion
router.post("/excursions", checkJwt, async (req, res) => {
  try {
    const { trip_id, name, start_time, end_time, details } = req.body;
    const result = await db.query(
      "INSERT INTO excursions (trip_id, name, start_time, end_time, details) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [trip_id, name, start_time, end_time, details]
    ); 
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error creating excursion." });
  }
});

//Get A Specific Excursion 
router.get("/excursions/:id", checkJwt, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM excursions WHERE id = $1", [id]);
    if (result.rows.length) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Excursion not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error getting excursion." });
  }
});

//Get All Excursions 
router.get("/trip/:trip_id", checkJwt, async (req, res) => {
  try {
    const { trip_id } = req.params;
    const result = await db.query("SELECT * FROM excursions WHERE trip_id = $1", [trip_id]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error getting excursions." });
  }
}); 

//Update An Excursion
router.put("/excursions/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, start_time, end_time, details } = req.body;
    
    const result = await db.query(
      "UPDATE excursions SET name = $1, start_time = $2, end_time = $3, details = $4 WHERE id = $5 RETURNING *",
      [name, start_time, end_time, details, id]
    ); 

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Excursion not found." });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error updating excursion." });
  }
});

//Delete An Excursion
router.delete("/excursions/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM excursions WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Excursion not found." });
      return; 
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error deleting excursion." });
  }
});

export default router; 