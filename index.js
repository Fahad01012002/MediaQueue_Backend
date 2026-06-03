const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { ServerApiVersion, ObjectId, MongoClient } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');

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
        const studentTutotrsCollection = db.collection('studentTutors');
        const studentBookingCollection = db.collection('bookingTutors');


        app.get('/tutors' , async (req, res) => {
            const result = await tutorsCollection.find().toArray();
            res.send(result);
        });

        app.get('/tutors/:id' , async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await tutorsCollection.findOne(query);
            res.send(result);
        });

            const result = await studentTutotrsCollection.find().toArray();
            res.send(result);
        })

        app.get('/my-tutors/user/:userId', middleware, async (req, res) => {
            const { userId } = req.params;
            const query = { userId: userId };
            const result = await studentTutotrsCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/bookings/:studentId', middleware, async (req, res) => {
            const { studentId } = req.params;
            const query = { studentId: studentId };
            const result = await studentBookingCollection.find(query).toArray();
            res.send(result);
        })

        app.delete('/my-tutors/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const myTutorResult = await studentTutotrsCollection.deleteOne(query);
            const tutorResult = await tutorsCollection.deleteOne(query);
            res.json({
                deletedCount: myTutorResult.deletedCount + tutorResult.deletedCount
            });
        });

        app.listen(PORT, () => {
            console.log(`Simple CRUD server is running on port ${PORT}`);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } catch (error) {
        console.log(error);
    }
}