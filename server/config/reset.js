import { pool } from './database.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url)
const tripsFile = fs.readFileSync(path.join(dirname(currentPath), 'data.json'), 'utf8')
const tripsData = JSON.parse(tripsFile)

const createTripsTable = async () => {
  /*const createTripsTableQuery = `
      DROP TABLE IF EXISTS trips CASCADE;

      CREATE TABLE IF NOT EXISTS trips (
          id serial PRIMARY KEY,
          title varchar(100) NOT NULL,
          description varchar(500) NOT NULL,
          img_url text NOT NULL,
          num_days integer NOT NULL,
          start_date date NOT NULL,
          end_date date NOT NULL,
          total_cost money NOT NULL
      );
  `*/

  try {
    await pool.query(createTripsTableQuery)
    console.log('🎉 trips table created successfully')
  } catch (err) {
    console.error('⚠️ error creating trips table', err)
    throw err
  }
}

const createDestinationsTable = async () => {
  /*const createDestinationsTableQuery = `
      DROP TABLE IF EXISTS destinations CASCADE;

      CREATE TABLE IF NOT EXISTS destinations (
          id serial PRIMARY KEY,
          name varchar(150) NOT NULL,
          description varchar(500),
          country varchar(100),
          img_url text
      );
  `*/

  try {
    await pool.query(createDestinationsTableQuery)
    console.log('🎉 destinations table created successfully')
  } catch (err) {
    console.error('⚠️ error creating destinations table', err)
    throw err
  }
}

const createActivitiesTable = async () => {
  /*const createActivitiesTableQuery = `
      DROP TABLE IF EXISTS activities CASCADE;

      CREATE TABLE IF NOT EXISTS activities (
          id serial PRIMARY KEY,
          trip_id integer REFERENCES trips(id) ON DELETE CASCADE,
          title varchar(150) NOT NULL,
          description varchar(500),
          location varchar(150),
          likes integer DEFAULT 0
      );
  `*/

  try {
    await pool.query(createActivitiesTableQuery)
    console.log('🎉 activities table created successfully')
  } catch (err) {
    console.error('⚠️ error creating activities table', err)
    throw err
  }
}

const createTripsDestinationsTable = async () => {
  /*const createTripsDestinationsTableQuery = `
      DROP TABLE IF EXISTS trips_destinations CASCADE;

      trip_id int NOT NULL,
          destination_id int NOT NULL,
          PRIMARY KEY (trip_id, destination_id),
          FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
          FOREIGN KEY (destination_id) REFERENCES destinations(id) ON UPDATE CASCADE
      );
  `
*/
  try {
    const res = await pool.query(createTripsDestinationsTableQuery)
    console.log('🎉 trips_destinations table created successfully')
  } catch (err) {
    console.error('⚠️ error creating trips_destinations table', err)
    throw err
  }
}

const createUsersTable = async () => {
  /*const createUsersTableQuery = `
        DROP TABLE IF EXISTS users CASCADE;

        CREATE TABLE IF NOT EXISTS users (
            id serial PRIMARY KEY,
            name varchar(100) NOT NULL,
            email varchar(255) NOT NULL UNIQUE,
            password_hash text NOT NULL
        );
    `*/

  try {
    await pool.query(createUsersTableQuery)
    console.log('🎉 users table created successfully')
  } catch (err) {
    console.error('⚠️ error creating users table', err)
    throw err
  }
}

const createTripsUsersTable = async () => {
  /*const createTripsUsersTableQuery = `
      DROP TABLE IF EXISTS trips_users CASCADE;

      CREATE TABLE IF NOT EXISTS trips_users (
          id serial PRIMARY KEY,
          trip_id integer REFERENCES trips(id) ON DELETE CASCADE,
          user_id integer REFERENCES users(id) ON DELETE CASCADE,
          role varchar(50)
      );
  `*/

  try {
    await pool.query(createTripsUsersTableQuery)
    console.log('🎉 trips_users table created successfully')
  } catch (err) {
    console.error('⚠️ error creating trips_users table', err)
    throw err
  }
}

const seedTripsTable = async () => {
    /*await createTripsTable()

    tripsData.forEach((trip) => {
        const insertQuery = {
            text: 'INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        }

        const values = [
            trip.title,
            trip.description,
            trip.img_url,
            trip.num_days,
            trip.start_date,
            trip.end_date,
            trip.total_cost,
        ]

        pool.query(insertQuery, values, (err, res) => {
            if (err) {
                console.error('⚠️ error inserting trip', err)
                return
            }

            console.log(`✅ ${trip.title} added successfully`)
        })
    })*/
}

const seedDatabase = async () => {
  /*try {
    await createDestinationsTable()
    await createActivitiesTable()
    await createTripsUsersTable()
    await createTripsDestinationsTable()
    await createUsersTable()
    await seedTripsTable()
    console.log('🎉 database reset complete')
  } catch (err) {
    console.error('⚠️ error during database reset', err)
  } finally {
    await pool.end()
  }*/
}