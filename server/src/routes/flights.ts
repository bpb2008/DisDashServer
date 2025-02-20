import express, { Request, Response } from "express";
import { db } from "../db-connection";
import { checkJwt } from "../middleware/auth";

const router = express.Router();

//Create Flight 
router.post("/flights", checkJwt, async (req, res) => {
  try {
    const{ trip_id, airline, flight_number, departure_time, arrival_time, confirmation_number } = req.body;
    const result = await db.query(
      "INSERT INTO flights (trip_id, airline, flight_number, departure_time, arrival_time, confirmation_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [trip_id, airline, flight_number, departure_time, arrival_time, confirmation_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to create flight" });
  }
}); 

//Get A Specfic Flight 
router.get("/flights/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM flights WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Flight not found" });
      return; 
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flight" });
  }
});

//Get All Flights For A Trip 
router.get("/trip/:trip_id", checkJwt, async (req, res) => {
  try {
    const { trip_id } = req.params;
    const result = await db.query("SELECT * FROM flights WHERE trip_id = $1", [trip_id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flights" });
  }
}); 

//Edit or Update Flight 
router.put("flights/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { airline, flight_number, departure_time, arrival_time, confirmation_number } = req.body;
    const result = await db.query(
      "UPDATE flights SET airline = $1, flight_number = $2, departure_time = $3, arrival_time = $4, confirmation_number = $5 WHERE id = $6 RETURNING *",
      [airline, flight_number, departure_time, arrival_time, confirmation_number, id]
    ); 

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Flight not found" });
      return; 
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update flight" });
  }
});

//Delete A Flight 
router.delete("/flights/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM flights WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Flight not found" });
      return; 
    }
    res.json({ message: "Flight deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete flight" });
  }
});

export default router;