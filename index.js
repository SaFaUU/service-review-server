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
        const userCollection = client.db("serviceReview").collection('services');
        app.post('/addservice', async (req, res) => {
            const serviceDetails = req.body;
            console.log(serviceDetails)
            const result = await userCollection.insertOne(serviceDetails);
            console.log(result)

        })

        app.get('/', async (req, res) => {
            const cursor = userCollection.find({})
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })
        app.get('/alltours', async (req, res) => {
            const cursor = userCollection.find({})
            const services = await cursor.toArray();
            res.send(services)
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