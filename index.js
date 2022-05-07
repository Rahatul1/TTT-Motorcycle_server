const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    // get id
    app.get("/produts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const produts = await productCollection.findOne(query);
      res.send(produts);
    });

    // post 
    app.post('/produts', async (req, res) => {
      const newProduts = req.body;
      const results = await productCollection.insertOne(newProduts);
      res.send(results);
    })
    //update
    app.put("/produts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await productCollection.findOne(query);
      if (products) {
        const filter = { _id: ObjectId(id) };
        const option = { upsert: true };
        const updateInfo = {
          $set: {
            quantity: products.quantity - 1,
            sold: parseInt(products.sold) + 1
          }
        };
        const result = await productCollection.updateOne(filter,  updateInfo, option);
        console.log(result);
        res.send({ msg: "Susccess dalivary" })
      }
    })

    // quantity quantity
    app.put('/ProductsDetail/:id', async (req, res) => {
      const quantity = req.body.quantity;
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const products = await productCollection.findOne(query);
      if (products) {
        const filter = { _id: ObjectId(id) };
        const option = { upsert: true };
        const updateInfo = {
          $set: {
            quantity: parseInt(products.quantity) + parseInt(quantity)           
          }
        };
        const result = await productCollection.updateOne(filter,  updateInfo, option);
        console.log(result);
        res.send({ msg: "Quantity Add" })
      } 
    })
    //dellet
    app.delete('/products/:id',async (req, res) => {
      //
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })
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
