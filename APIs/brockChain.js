const { response } = require("express");
const { default: fetch } = require("node-fetch");
require('dotenv').config();
const Web3 = require('web3')
const FILE = process.env.FILE
const CHAINID = process.env.CHAINID
const RPC = process.env.RPC
const PRIVATE_KEY = process.env.PRIVATE_KEY
const API_KEY = process.env.API_KEY
const WALLET = process.env.WALLET
const API = process.env.API
const ADDRESS= process.env.ADDRESS
const abi = require(`../Artifacts/oxygen.json`)

const purchase = async (request, response) =>
{
   const requestingKey = request.params.api_key
   if (requestingKey != API_KEY) {
       response.status(500).send({ error: 'not authorized' })
   }
   else {
       console.log(request.body.customer);
       console.log(request.body.amount);
       const {customer, amount} = request.body
       const web3 = new Web3(RPC)
       var gasprice = await web3.eth.getGasPrice()
       gasprice = gasprice * 2
       var nonce = await web3.eth.getTransactionCount(WALLET)
       const CT = new web3.eth.Contract(abi, ADDRESS)
       console.log(CT.methods);
       var string = amount.toString()
       const weiCount = web3.utils.toWei(string, 'ether')
       const payout = web3.utils.toHex(weiCount)
       ////this is what we transfer to them
       const txObject = {
           from: WALLET,
           nonce: "0x" + nonce.toString(16),
           to: customer,
           gas: 200000,
           value: "0x0",
           data: CT.methods.transfer(customer, payout).encodeABI(),
           gasPrice: gasprice
       }
       web3.eth.accounts.signTransaction(txObject, PRIVATE_KEY, (err, res) => {
           if (err) {
               console.log('err', err)
           }
           else {
               console.log('res', res)
           }
           const raw = res.rawTransaction
           web3.eth.sendSignedTransaction(raw, (err, txHash) => {
               if (err) {
                   console.log(err)
               }
               else {
                   console.log("txHash:", txHash)
               }
           })
       })
       response.status(200).send({ message: 'Great Job!' })
   }
}
const transactionTracker = (request, response) => {       
   fetch(
       `https://api.covalenthq.com/v1/${CHAINID}/address/${WALLET}/transfers_v2/?contract-address=${ADDRESS}&key=${COVELANTKEY}`,
           {
               method: "GET",
               mode: "cors",
               headers: {
                   "Content-Type": "application/json",
                   Accept: "application/json",
               }
           }
   )
   .then((response) => response.json())
   .then((covelantResponse) => {
       covelantResponse.map((transaction) => {
           console.log(transaction)
       })
   });
}



module.exports={purchase}
// module.exports={}