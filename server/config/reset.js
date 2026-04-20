import { pool } from './database.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url)
const tripsFile = fs.readFileSync(path.join(dirname(currentPath), 'data.json'), 'utf8')
const tripsData = JSON.parse(tripsFile)

const createTripsTable = async () => {
 

  try {
    await pool.query(createTripsTableQuery)
    console.log('🎉 trips table created successfully')
  } catch (err) {
    console.error('⚠️ error creating trips table', err)
    throw err
  }
}

const createDestinationsTable = async () => {
  

  try {
    await pool.query(createDestinationsTableQuery)
    console.log('🎉 destinations table created successfully')
  } catch (err) {
    console.error('⚠️ error creating destinations table', err)
    throw err
  }
}

const createActivitiesTable = async () => {
 

  try {
    await pool.query(createActivitiesTableQuery)
    console.log('🎉 activities table created successfully')
  } catch (err) {
    console.error('⚠️ error creating activities table', err)
    throw err
  }
}

const createTripsDestinationsTable = async () => {
 
  try {
    const res = await pool.query(createTripsDestinationsTableQuery)
    console.log('🎉 trips_destinations table created successfully')
  } catch (err) {
    console.error('⚠️ error creating trips_destinations table', err)
    throw err
  }
}

const createUsersTable = async () => {
  
  try {
    await pool.query(createUsersTableQuery)
    console.log('🎉 users table created successfully')
  } catch (err) {
    console.error('⚠️ error creating users table', err)
    throw err
  }
}

const createTripsUsersTable = async () => {
 

  try {
    await pool.query(createTripsUsersTableQuery)
    console.log('🎉 trips_users table created successfully')
  } catch (err) {
    console.error('⚠️ error creating trips_users table', err)
    throw err
  }
}

const seedTripsTable = async () => {
   
}

const seedDatabase = async () => {
  
}