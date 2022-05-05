const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

//middlewerw
app.use(cors());
app.use(express.json());



// run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Running warehouse or inventory management website')
};
app.listen(port, () => {
    console.log('listening on port')
});
