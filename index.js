const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
dotenv.config();

const uri = process.env.MONGODB_URI;
const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    //create database and databaseCollection
    const db = client.db("sports");
    const sportsCollection = db.collection("facility");
    const bookingCollection = db.collection("conform");

    //create get api find all Data
    app.get("/facility", async (req, res) => {
      const result = await sportsCollection.find().toArray();
      res.json(result);
    });

    //create get api find single data
    app.get("/facility/:id", async (req, res) => {
      const { id } = req.params;
      const result = await sportsCollection.findOne({ _id: new ObjectId(id) });
      res.json(result);
    });

    //create post api (form)
    app.post("/facility", async (req, res) => {
      const facilityData = req.body;
      console.log(facilityData);
      const result = await sportsCollection.insertOne(facilityData);
      res.json(result);
    });

    //create patch api for update
    app.patch("/facility/:id", async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      const result = await sportsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );
      res.json(result);
    });

    //create delete api
    app.delete("/facility/:id", async (req, res) => {
      const { id } = req.params;
      const result = await sportsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    //create get api for my booking card
    app.get("/conform/:userId", async (req, res) => {
      const { userId } = req.params;
      const result = await bookingCollection.find({ userId: userId }).toArray();
      res.json(result);
    });

    //create post api for my booking card
    app.post("/conform", async (req, res) => {
      const data = req.body;
      const result = await bookingCollection.insertOne(data);
      res.json(result);
    });

    //create delete api for delete the booking card
    app.delete("/conform/:bookingsId", async (req, res) => {
      const { bookingsId } = req.params;
      const result = await bookingCollection.deleteOne({
        _id: new ObjectId(bookingsId),
      });
      res.json(result);
    });

    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running on the port");
});

app.listen(PORT, () => {
  console.log(`Server running on the PORT ${PORT}`);
});
