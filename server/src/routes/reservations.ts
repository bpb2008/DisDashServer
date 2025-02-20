import express, { Request, Response } from "express";
import { db } from "../db-connection";
import { checkJwt } from "../middleware/auth";

const router = express.Router();

//Create A Dining Reservation 
router.post("/dining", checkJwt, async (req, res) => {
  try {
    const { trip_id, name, reservation_time } = req.body;
    const result = await db.query(
      "INSERT INTO reservations (trip_id, name, reservation_time) VALUES ($1, $2, $3) RETURNING *",
      [trip_id, name, reservation_time]
    ); 
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to create reservation." });
  }
});

//Get A Dining Reservation
router.get("/dining:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM reservations WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Reservation not found." });
      return; 
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to get reservation." });
  }
});

//Get All Dining Reservations
router.get("/trip/:trip_id", checkJwt, async (req, res) => {
  try {
    const { trip_id } = req.params;
    const result = await db.query("SELECT * FROM reservations WHERE trip_id = $1", [trip_id]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to get reservations." });
  }
});

//Update A Dining Reservation
router.get("/dining/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, reservation_time } = req.body;

    const result = await db.query(
      "UPDATE reservations SET name = $1, reservation_time = $2 WHERE id = $3 RETURNING *",
      [name, reservation_time, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Reservation not found." });
      return; 
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update reservation." });
  }
});

//Delete A Dining Reservation
router.delete("/dining/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM reservations WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Reservation not found." });
      return; 
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete reservation." });
  }
});

export default router; 