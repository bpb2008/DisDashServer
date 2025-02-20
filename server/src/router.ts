import express from "express";
import tripRoutes from "./routes/trips";
import userRoutes from "./routes/users";
import flightRoutes from "./routes/flights";
import hotelRoutes from "./routes/hotels";
import rentalCarRoutes from "./routes/rentalCars";
import diningRoutes from "./routes/reservations";
import excursionRoutes from "./routes/excursions";


const router = express.Router(); 

router.use("/trips", tripRoutes);
router.use("/users", userRoutes);
router.use("/flights", flightRoutes);
router.use("/hotels", hotelRoutes);
router.use("/rentalCars", rentalCarRoutes);
router.use("/dining", diningRoutes);
router.use("/excursions", excursionRoutes);

export default router; 