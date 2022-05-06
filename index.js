const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//------------------//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fozpl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productCollection = client
      .db("warehouseManagement")
      .collection("produts");

    //--get---//
    app.get("/produts", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const produts = await cursor.toArray();
      res.send(produts);
    });
    //
    
  } finally {
    //
  }
}

run().catch(console.dir);

//-------------------------//
app.get("/", (req, res) => {
  res.send("Running warehouse or inventory management website");
});

app.listen(port, () => {
  console.log(`"CRUD server started" ${port}`);
});
