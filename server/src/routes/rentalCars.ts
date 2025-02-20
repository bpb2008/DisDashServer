import express, { Request, Response } from "express";
import { db } from "../db-connection";
import { checkJwt } from "../middleware/auth";

const router = express.Router();

//Create Rental Car
router.post("/rentalCars", checkJwt, async (req, res) => {
  try {
    const { trip_id, agency, pick_up_date, drop_off_date } = req.body;
    const result = await db.query(
      "INSERT INTO rental_cars (trip_id, agency, pick_up_date, drop_off_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [trip_id, agency, pick_up_date, drop_off_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to create rental car" });
  }
});

//Get A Specific Rental Car
router.get("/rentalCars/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM rental_cars WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Rental Car not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rental car" });
  }
});

//Get All Rental Cars For A Trip
router.get("/trip/:trip_id", checkJwt, async (req, res) => {
  try {
    const { trip_id } = req.params;
    const result = await db.query("SELECT * FROM rental_cars WHERE trip_id = $1", [trip_id]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rental cars" });
  }
});

//Edit or Update Rental Car
router.put("/rentalCars/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { agency, pick_up_date, drop_off_date } = req.body;
    const result = await db.query(
      "UPDATE rental_cars SET agency = $1, pick_up_date = $2, drop_off_date = $3 WHERE id = $4 RETURNING *",
      [agency, pick_up_date, drop_off_date, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Rental Car not found" });
      return; 
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update rental car" });
  }
});

//Delete Rental Car
router.delete("/rentalCars/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM rental_cars WHERE id = $1", [id]);
  
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Rental Car not found" });
      return;
    }
    res.json({ message: "Rental Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete rental car" });
  }
});

export default router; 