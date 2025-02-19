import { db } from '../db-connection';

export const resolvers = {
  Query: {
    getUsers: async () => {
      const result = await db.query("SELECT * FROM users"); 
      return result.rows; 
    }, 
    getUser: async (_: any, { auth0_id }: { auth0_id: string}) => {
      const result = await db.query("SELECT * FROM users WHERE auth0_id = $1", [auth0_id]);
      return result.rows[0]; 
    }, 
    getTrips: async (_: any, { user_id }: { user_id: string }) => {
      const result = await db.query("SELECT * FROM trips WHERE user_id = $1", [user_id]);
      return result.rows; 
    }, 
    getTrip: async (_: any, { id }: { id: string }) => {
      const result = await db.query("SELECT * FROM trips WHERE id = $1", [id]);
      return result.rows[0]; 
    }, 
  }, 

  Mutation: {
    addUser: async (_: any, { auth0_id, email }: { auth0_id: string, email: string}) => {
      const result = await db.query(
        "INSERT INTO users (auth0_id, email) VALUES ($1, $2) RETURNING *",
        [auth0_id, email]
      );
      return result.rows[0]; 
    }, 
    addTrip: async(_: any, { user_id, name, start_date, end_date }: 
      { user_id: string, name: string, start_date: string, end_date: string}) => {
        const result = await db.query(
          "INSERT INTO trips (user_id, name, start_date, end_date) VALUES ($1, $2, $3. $4) RETURNING *",
          [user_id, name, start_date, end_date]
        );
        return result.rows[0]; 
      }, 
  },
}; 