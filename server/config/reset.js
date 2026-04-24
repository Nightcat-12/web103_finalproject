import { pool } from './database.js'
import './dotenv.js'
import { shopItems } from '../../client/src/data/shopItems.js'

const createUsersTable = async () => {
  const createUsersTableQuery = `
    DROP TABLE IF EXISTS users CASCADE;

    CREATE TABLE IF NOT EXISTS users (
      uid TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      profilePicture TEXT,
      coins INTEGER NOT NULL DEFAULT 0 CHECK (coins >= 0),
      createdAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `

  try {
    const res = await pool.query(createUsersTableQuery)
    console.log('✅ users table created successfully!')
  } catch (err) {
    console.error(`⚠️ Error creating users table\n${err}`)
  }
}

const createCatsTable = async () => {
  const createCatsTableQuery = `
    DROP TABLE IF EXISTS cats CASCADE;

    CREATE TABLE IF NOT EXISTS cats (
      id SERIAL PRIMARY KEY,
      userId TEXT NOT NULL UNIQUE REFERENCES users(uid) ON DELETE CASCADE,
      name TEXT NOT NULL,
      image TEXT,
      energy INTEGER NOT NULL DEFAULT 100 CHECK (energy >= 0)
    );
  `

  try {
    const res = await pool.query(createCatsTableQuery)
    console.log('✅ cats table created successfully!')
  } catch (err) {
    console.error(`⚠️ Error creating cats table\n${err}`)
  }
}

const createPomodoroProfilesTable = async () => {
  const createPomodoroProfilesTableQuery = `
    DROP TABLE IF EXISTS pomodoro_profiles CASCADE;

    CREATE TABLE IF NOT EXISTS pomodoro_profiles (
      id SERIAL PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
      name TEXT NOT NULL,
      timeOn INTEGER NOT NULL CHECK (timeOn > 0),
      timeBreak INTEGER NOT NULL CHECK (timeBreak > 0),
      timeLongBreak INTEGER NOT NULL CHECK (timeLongBreak > 0),
      isDefault BOOLEAN NOT NULL DEFAULT FALSE
    );

    CREATE UNIQUE INDEX IF NOT EXISTS one_default_profile_per_user
      ON pomodoro_profiles (userId)
      WHERE isDefault = TRUE;
  `

  try {
    const res = await pool.query(createPomodoroProfilesTableQuery)
    console.log('✅ pomodoro_profiles table created successfully!')
  } catch (err) {
    console.error(`⚠️ Error creating pomodoro_profiles table\n${err}`)
  }
}

const createStudySessionsTable = async () => {
  const createStudySessionsTableQuery = `
    DROP TABLE IF EXISTS study_sessions CASCADE;

    CREATE TABLE IF NOT EXISTS study_sessions (
      id SERIAL PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
      profileId INTEGER REFERENCES pomodoro_profiles(id) ON DELETE SET NULL,
      startTime TIMESTAMPTZ NOT NULL,
      endTime TIMESTAMPTZ,
      coinsEarned INTEGER NOT NULL DEFAULT 0 CHECK (coinsEarned >= 0)
    );
  `

  try {
    const res = await pool.query(createStudySessionsTableQuery)
    console.log('✅ study_sessions table created successfully!')
  } catch (err) {
    console.error(`⚠️ Error creating study_sessions table\n${err}`)
  }
}

const createShopItemsTable = async () => {
  const createShopItemsTableQuery = `
    DROP TABLE IF EXISTS shop_items CASCADE;

    CREATE TABLE IF NOT EXISTS shop_items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT,
      category TEXT NOT NULL,
      price INTEGER NOT NULL CHECK (price >= 0)
    );
  `

  try {
    const res = await pool.query(createShopItemsTableQuery)
    console.log('✅ shop_items table created successfully!')
  } catch (err) {
    console.error(`⚠️ Error creating shop_items table\n${err}`)
  }
}

const createInventoryTable = async () => {
  const createInventoryTableQuery = `
    DROP TABLE IF EXISTS inventory CASCADE;

    CREATE TABLE IF NOT EXISTS inventory (
      id SERIAL PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
      shopItemId INTEGER NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
      equipped BOOLEAN NOT NULL DEFAULT FALSE,
      acquiredAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (userId, shopItemId)
    );
  `

  try {
    const res = await pool.query(createInventoryTableQuery)
    console.log('✅ inventory table created successfully!')
  } catch (err) {
    console.error(`⚠️ Error creating inventory table\n${err}`)
  }
}

const createTasksTable = async () => {
  const createTasksTableQuery = `
    DROP TABLE IF EXISTS tasks CASCADE;

    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
      title TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      createdAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completedAt TIMESTAMPTZ
    );
  `

  try {
    const res = await pool.query(createTasksTableQuery)
    console.log('✅ tasks table created successfully!')
  } catch (err) {
    console.error(`⚠️ Error creating tasks table\n${err}`)
  }
}

const seedShopItemsTable = async() => {
  await createShopItemsTable()

  shopItems.forEach((item) => {
    const insertQuery = {
      text: 'INSERT INTO shop_items (name, image, category, price) VALUES ($1, $2, $3, $4)'
    }

    const values = [
      item.name,
      item.img,
      item.category,
      item.price
    ]

    pool.query(insertQuery, values, (err,res) => {
      if (err) {
        console.error('⚠️ error inserting shop item', err)
        return
      }

      console.log(`✅ ${item.name} added successfully`)
    })
  })

}

const seedDatabase = async () => {
  try {
    await createUsersTable()
    await createCatsTable()
    await createPomodoroProfilesTable()
    await createStudySessionsTable()
    seedShopItemsTable()
    await createInventoryTable()
    await createTasksTable()
    console.log('✅ database tables created successfully!')
  } catch (err) {
    console.error(`⚠️ Error seeding database\n${err}`)
  }
}

seedDatabase()