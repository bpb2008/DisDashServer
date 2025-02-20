import express, { Request, Response } from "express";
import { db } from "../db-connection";
import { checkJwt } from "../middleware/auth";
import { AuthenticatedRequest } from "./types";

const router = express.Router();

//Create User 
router.post("/users", checkJwt, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const auth0_id = req.auth?.sub;

  if (!auth0_id) {
    res.status(400).json({ error: "Auth0 ID is required." });
    return;
  }
    const result = await db.query(
      "INSERT INTO users (auth0_id, email) VALUES ($1, $2, $3) RETURNING *",
      [auth0_id, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

//Get A User 
router.get("/users/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "User not found" })
      return;
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
})

//Edit or Update A User
router.put("/users/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const result = await db.query(
      'UPDATE users SET email = $1 WHERE id = $2 RETURNING *',
      [email, id]
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
})

//Delete A User
router.delete("/users/:id", checkJwt, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}); 

export default router; 