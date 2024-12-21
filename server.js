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
  res.header("Access-Control-Allow-Origin",'http://localhost:38146');
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
  console.log("app.getです。");
  console.log(req.query);
  var aaaa = convertQueryStringToSQL(req.query['query']);
  console.log(aaaa);
  client.query(aaaa,(err,result)=>{
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
  
function convertQueryStringToSQL(query){
  console.log("変換する関数です。");
  let SQL ="";
  for(let i=0;i<query.length;i++){
    if (query[i]=="/"){
      SQL = SQL + " ";
    }else{
      SQL = SQL + query[i];
    }
  }

  return SQL;
}