const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { ServerApiVersion, ObjectId, MongoClient } = require('mongodb')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running....');
});

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const run = async () => {
    try {
        await client.connect();
        const db = client.db("mediaqueue");
        const tutorsCollection = db.collection("tutors");

        


        app.listen(PORT, () => {
            console.log(`Simple CRUD server is running on port ${PORT}`);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } catch (error) {
        console.log(error);
    }
}

run().catch(console.dir);
