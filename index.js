//  "db.js" ko index.js me import krny k liye ↓ 
const connectToMongo = require("./db");
const express = require('express')
var cors = require('cors')

// app.use(express.json())

connectToMongo();
const app = express()
const port = 5000

// app.use(cors())
app.use(cors({
  origin: 'https://getinotebook.vercel.app'
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://getinotebook.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json())

// "Routes" use krny k liye syntax ↓ 
app.use("/api/auth", require("./Routes/auth"))
app.use("/api/notes", require("./Routes/notes"))

app.get('/', (req, res) => {
  res.json({ message: 'The server is working' });
});

app.listen(port, () => {
  console.log(`iNotebook backend listening on port http://localhost:${port}`)
})