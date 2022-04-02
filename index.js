const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const q = require("./queries.js");
require("dotenv").config();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.post(`/purchase/:api_key`, q.brockChain.purchase)
// app.get(`trackTransations/:api_key`, q.brockChain.trackTransations)
app.listen(port, () => {
console.log(`App running on port ${port}. API is pointed towards ${process.env.API}, with
${process.env.WALLET} as the wallet account address.
${process.env.FILE} is the ABI being used, on CHAINID ${process.env.CHAINID} WITH RPC ${process.env.RPC}`);
});