const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 5000;

require('dotenv').config()
app.use(cors())
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1cmhy5v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send({ message: 'Unauthorized Access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send({ message: 'Forbidden Access' });
        }
        req.decoded = decoded;
        next();
    })
}


async function run() {
    try {
        const serviceCollection = client.db("serviceReview").collection('services');
        const reviewCollection = client.db("serviceReview").collection('reviews');

        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
            res.send({ token });
        });

        app.post('/addservice', async (req, res) => {
            const serviceDetails = req.body;
            console.log(serviceDetails)
            const result = await serviceCollection.insertOne(serviceDetails);
            console.log(result)

        })
        app.post('/addreview', async (req, res) => {
            const reviewData = req.body;
            console.log(reviewData)
            const result = await reviewCollection.insertOne(reviewData);
            console.log(result)
            res.send(result)

        })
        app.put('/myreviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true }

            const reviewData = req.body;

            const updatedReview = {
                $set: {
                    review: reviewData.info,
                }
            }

            console.log(reviewData)

            const result = await reviewCollection.updateOne(filter, updatedReview, option)
            const newUpdatedReview = await reviewCollection.findOne(filter)

            res.send(newUpdatedReview)


        })

        app.get('/', async (req, res) => {
            const cursor = serviceCollection.find({})
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })
        app.get('/alltours', async (req, res) => {
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray();
            res.send(services)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = {
                _id: ObjectId(id)
            }

            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = {
                postID: id
            }
            const options = {
                sort: { timestamp: -1 },
            };

            const cursor = reviewCollection.find(query, options)
            const reviews = await cursor.toArray();
            res.send(reviews)
        })
        app.get('/myreviews/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = {
                userID: id
            }
            const options = {
                sort: { timestamp: -1 },
            };

            const cursor = reviewCollection.find(query, options)
            const reviews = await cursor.toArray();
            res.send(reviews)
        })
        app.delete('/myreviews/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = {
                _id: ObjectId(id)
            }
            const result = await reviewCollection.deleteOne(query)
            console.log(result)
            res.send(result)

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