import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/users.js'
import catsRoutes  from './routes/cats.js'
import profilesRoutes from './routes/pomodoroProfiles.js'
import shopItemsRoutes from './routes/shopItems.js'
import inventoryRoutes from './routes/inventory.js'
import sessionsRoutes from './routes/studySessions.js'
import tasksRoutes from './routes/tasks.js'

// import the router from your routes file


dotenv.config()

const app = express()

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.status(200).send(`
        <h1 style="text-align: center; margin-top: 50px">
        🍅 Pawmodoro API
        </h1>
        `)
    })
const PORT = process.env.PORT || 3000

// Insert routes here
app.use('/api/users', userRoutes)
app.use('/api/cats', catsRoutes)
app.use('/api/pomodoro_profiles', profilesRoutes)
app.use('/api/shop_items', shopItemsRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/sessions', sessionsRoutes)
app.use('/api/tasks', tasksRoutes)

app.listen(PORT, () => {
    console.log(`🍅 server listening on http://localhost:${PORT}`)
})