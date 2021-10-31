const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
require('dotenv').config()
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qrkkr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
    console.log(uri);


async function run() {
  try {
    await client.connect();
    console.log("connected to databse");


     const database = client.db("travelAndtour");
     const placesCollection = database.collection("places");


    //  GET PLACES API 
    app.get("/places", async(req,res)=>{
      const cursor = placesCollection.find({});
      const places = await cursor.toArray();
      res.send(places)
    })
    // Get Single Place Api
    app.get("/places/:id",async(req,res)=>{
      const id  = req.params.id;
      const query = {_id:ObjectId(id)};
      const place = await placesCollection.findOne(query)
      res.json(place)
    })

    //  POST API 
    app.post("/places", async(req,res)=>{
        const  places = req.body;
        const result = await placesCollection.insertOne(places);
        console.log(result);
        res.json(result)
    })
    // DELETE API
    app.delete("/places/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result =  await placesCollection.deleteOne(query);
      console.log(result);
      res.json(result)
    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);





// started the server
app.get("/", (req, res) => {
  res.send("Server Ready");
});
app.listen(port, () => {
  console.log("Running on port", port);
});
