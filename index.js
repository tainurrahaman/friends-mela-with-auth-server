const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xtebx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const friendCollection = client.db("friendsDB").collection("friends");

    app.get("/friends", async (req, res) => {
      const cursor = friendCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/friends", async (req, res) => {
      const friend = req.body;
      const result = await friendCollection.insertOne(friend);
      res.send(result);
    });

    app.patch("/friends", async (req, res) => {
      const email = req.body.email;
      const filter = { email };
      const updateFriend = {
        $set: {
          lastSignInTime: req?.body?.lastSignInTime,
        },
      };
      const result = await friendCollection.updateOne(filter, updateFriend);

      res.send(result);
    });

    app.delete("/friends/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await friendCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Friends mela is running");
});

app.listen(port, () => {
  console.log("Port is running on ", port);
});
