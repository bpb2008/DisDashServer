import express, { Request, Response } from "express"; 
import { db } from "../db-connection";
import { checkJwt } from "../middleware/auth";

const router = express.Router();

//Create Hotel 
router.post("/hotels", checkJwt, async (req, res) => {
  try {
    const { trip_id, name, check_in_date, check_out_date } = req.body;
    const result = await db.query(
      "INSERT INTO hotels (trip_id, name, check_in_date, check_out_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [trip_id, name, check_in_date, check_out_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to create hotel" });
  }
});

//Get A Specific Hotel
router.get("/hotels/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM hotels WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Hotel not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel" });
  }
});

//Get All Hotels For A Trip
router.get("/trip/:trip_id", checkJwt, async (req, res) => {
  try {
    const { trip_id } = req.params;
    const result = await db.query("SELECT * FROM hotels WHERE trip_id = $1", [trip_id]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

//Edit or Update Hotel
router.put("/hotels/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, check_in_date, check_out_date } = req.body;
    const result = await db.query(
      "UPDATE hotels SET name = $1, check_in_date = $2, check_out_date = $3 WHERE id = $4 RETURNING *",
      [name, check_in_date, check_out_date, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Hotel not found" });
      return; 
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update hotel" });
  }
});

//Delete A Hotel 
router.delete("/hotels/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM hotels WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Hotel not found" });
      return; 
    }
    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete hotel" });
  }
});

export default router;