// nodeのコアモジュールのhttpを使う
var http = require('http');
const { Client } = require("pg");
const path = require('path');
require('dotenv').config();
/// .envから環境変数取り込み
require('dotenv').config({ 
    path: path.resolve(__dirname, '../.env') 
  });

const express = require('express');
const cors = require('cors');
const app = express();
const port = 30000;

app.use((req,res,next)=>{
  //全てのオリジンを許可
  res.header("Access-Control-Allow-Origin",'*');
  res.header("Access-Control-Allow-Methods",'GET,POST,PUT,DELETE');
  res.header("Access-Control-Allow-Headers",'Content-Type');
  next();
});

const client = new Client({
  user:process.env.user,
  host:process.env.host,
  database:process.env.database,
  password:process.env.password,
  port:process.env.port,
})

client.connect()
app.get('/get-data', (req, res) => {
  client.query("select * from parking_lots",(err,result)=>{
    if(err){
      res.status(500).send(err);
    }else{
      res.json(result.rows);
    }
  })
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
  
