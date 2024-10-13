import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routers/foodRoute.js"


// app config
const app = express()
const port = 4000

//middleware
app.use(express.json())
app.use(cors())

// db connect
connectDB();

// api endpoint
app.use("/api/food", foodRouter)

app.get("/",(req, res) => {
    res.send("API work")
})

app.listen(port,() => {
    console.log(`Server start on http://localhost:${port}`)
})
