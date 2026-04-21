import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import cors from 'cors'

// import the router from your routes file


dotenv.config()

const app = express()

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
// app.use('/api/')

app.listen(PORT, () => {
    console.log(`🍅 server listening on http://localhost:${PORT}`)
})