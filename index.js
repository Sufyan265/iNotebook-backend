//  "db.js" ko index.js me import krny k liye ↓ 
const connectToMongo = require("./db");
const express = require('express')
var cors = require('cors')

// app.use(express.json())

connectToMongo();
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// "Routes" use krny k liye syntax ↓ 
app.use("/api/auth", require("./Routes/auth"))
app.use("/api/notes", require("./Routes/notes"))

// app.get('/', (req, res) => {
//   res.status(400).json({ error: 'Bad Request' });
// });

app.listen(port, () => {
  console.log(`iNotebook backend listening on port http://localhost:${port}`)
})