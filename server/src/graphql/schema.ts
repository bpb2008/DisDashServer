import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String! 
    email: String! 
    trips: [Trip]
  }

  type Trip {
    id: ID! 
    user_id: ID! 
    name: String! 
    start_date: String! 
    end_date: String! 
    flights: [Flight]
    hotels: [Hotel] 
    rentalCars: [RentalCar]
    reservations: [Reservation]
    excursions: [Excursion]
  }

  type Flight {
    id: ID! 
    trip_id: ID! 
    airline: String 
    flight_number: String 
    departure_time: String 
    arrival_time: String
    confirmation_number: String
  }

  type Hotel {
    id: ID! 
    trip_id: ID!
    name: String 
    check_in_date: String
    check_out_date: String
  }

  type RentalCar {
    id: ID! 
    trip_id: ID!
    agency: String 
    pick_up_date: String
    drop_off_date: String
  }

  type Reservation {
    id: ID! 
    trip_id: ID!
    name: String 
    reservation_time: String
  }

  type Excursion {
    id: ID! 
    trip_id: ID!
    name: String 
    start_time: String
    end_time: String
    details: String
  }

  type Query {
    getUsers: [User]
    getUser(auth0_id: String!): User
    getTrips(user_id: ID!): [Trip]
    getTrip(id: ID!): Trip
  }

  type Mutation {
    addUser(auth0_id: String!, email: String!): User
    addTrip(user_id: ID!, name: String!, start_date: String!, end_date: String!): Trip
  }
  `; 