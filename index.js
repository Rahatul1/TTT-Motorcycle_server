const express = require("express");
const cors = require("cors");
const app = express();
let jwt = require('jsonwebtoken');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//
function validate(req, res, next) {
  const authheader = req.headers.authorization;
  if (!authheader) {
    return res.status(401).send({ status: 'validate faild' })
  }
  const token = authheader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Not validate'})
    }
    console.log('decoded', decoded)
    req.decoded = decoded;
  })

  next();
}

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
    
    // 
    app.post('/login', async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15d"
      });
    res.send({accessToken});
    })
    

    //-product-api---//
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
  
    // myitem
    app.get('/myItem', validate, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
      if (email === decodedEmail) {
        const query = {email: email};
      const cursor = productCollection.find(query);
      const myItem = await cursor.toArray();
      res.send(myItem);
      } else {
        res.status(404).send({message: 'Not Found'})
     }
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
