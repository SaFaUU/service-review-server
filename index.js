const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config()
app.use(cors())
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1cmhy5v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        app.get('/addtour', (req, res) => {
            res.send(uri)
        })
    }
    catch {

    }

}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send("Tour Service Server is running")
})

app.listen(port, () => {
    console.log(`Service Server app listening at http://localhost:${port}`);
})