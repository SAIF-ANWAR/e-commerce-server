const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.izrfy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        await client.connect()
        const mobileCollection = client.db("mobiles").collection("mobile");
        const laptopCollection = client.db("laptops").collection("laptop");
        const laptopOrdersCollection = client.db("orders").collection("laptopOrders");
        const phoneOrdersCollection = client.db("orders").collection("phoneOrders");
        const usersCollection = client.db("users").collection("user");
        const registeredUserCollection = client.db("users").collection("registeredUser")
        const reviewCollection = client.db("reviews").collection("review");


        /* All apis for mobile data */

        app.get('/mobiles', async (req, res) => {
            const query = {}
            const cursor = mobileCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/mobiles', async (req, res) => {
            const query = req.body
            const result = await mobileCollection.insertOne(query)
            res.send(result)
        })
        app.get('/mobiles/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await mobileCollection.findOne(query)
            res.send(result)
        })
        app.delete('/mobiles/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await mobileCollection.deleteOne(query)
            res.send(result)
        })

        app.put('/mobiles/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const quantity = req.body
            const options = { upsert: true }
            const updatedDoc = {
                $set: quantity
            }
            const result = await mobileCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        /* All apis for laptop data */
        app.get('/laptops', async (req, res) => {
            const result = await laptopCollection.find().toArray()
            res.send(result)
        })
        app.post('/laptops', async (req, res) => {
            const query = req.body
            const result = await laptopCollection.insertOne(query)
            res.send(result)
        })
        app.get('/laptops/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await laptopCollection.findOne(query)
            res.send(result)
        })
        app.delete('/laptops/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await laptopCollection.deleteOne(query)
            res.send(result)
        })
        app.put('/laptops/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const quantity = req.body
            const options = { upsert: true }
            const updatedDoc = {
                $set: quantity
            }
            const result = await laptopCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        app.put('/phoneOrders/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const data = req.body
            const options = { upsert: true }
            const updatedDoc = {
                $set: data
            }
            const result = await phoneOrdersCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        app.post('/phoneOrders', async (req, res) => {
            const query = req.body
            const result = await phoneOrdersCollection.insertOne(query)
            res.send(result)
        })
        app.get('/phoneOrders/:email', async (req, res) => {
            const email = req.params.email
            const filter = { email: email }
            const result = await phoneOrdersCollection.find(filter).toArray()
            res.send(result)
        })
        app.delete('/phoneOrders/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const result = await phoneOrdersCollection.deleteOne(filter)
            res.send(result)
        })
        app.get('/phoneOrders', async (req, res) => {
            const result = await phoneOrdersCollection.find().toArray()
            res.send(result)
        })
        app.post('/laptopOrders', async (req, res) => {
            const query = req.body
            const result = await laptopOrdersCollection.insertOne(query)
            res.send(result)
        })

        /* sending registered user to DB */
        app.put('/user/registeredUser/:email', async (req, res) => {
            const email = req.params.email
            const filter = { email: email }
            const data = req.body
            const options = { upsert: true }
            const updatedDoc = {
                $set: data
            }
            const result = await registeredUserCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        /* fetching data for useAdmin hook */
        app.get('/user/registeredUser/:email', async (req, res) => {
            const email = req.params.email
            const filter = { email: email }
            const user = await registeredUserCollection.findOne(filter)
            const isAdmin = user.role === 'admin'
            if (isAdmin) {
                res.send({ admin: isAdmin })
            }
            else {
                res.send({ admin: false })
            }
            // const isAdmin = user.role === 'admin'
            // res.send({ admin: isAdmin })
        })
        app.get('/user/allRegisteredUser/:email', async (req, res) => {
            const email = req.params.email
            const filter = { email: email }
            const user = await registeredUserCollection.findOne(filter)
            res.send(user)
        })

        /* update customer profile */
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email
            const filter = { email: email }
            const data = req.body
            const options = { upsert: true }
            const updatedDoc = {
                $set: data
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            const filter = { email: email }
            const result = await usersCollection.findOne(filter)
            res.send(result)
        })


        /* Posting customer reviews */
        app.post('/reviews', async (req, res) => {
            const query = req.body
            const result = await reviewCollection.insertOne(query)
            res.send(result)
        })
        app.get('/reviews', async (req, res) => {
            const result = await reviewCollection.find().toArray()
            res.send(result)
        })
        app.get('/allUsers', async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        })

    } finally {

    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


