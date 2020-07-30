const app = require('express')();
const server = require('http').createServer(app);
const {JsonDB} = require('node-json-db');
//  = const test = require('node-json-db').JsonDB;
const {Config} = require('node-json-db/dist/lib/JsonDBConfig');
const bodyParser = require('body-parser');
const path = require('path');

let db = new JsonDB(new Config("myDataBase", true, false, '/')); // création de la bdd = "npm i --save node-json-db"

app.use(bodyParser.json({limit: '10MB'}))
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.send("hello");
})

app.get('/formulaire', (req, res) => { // id = comme une variable  exemple de route dynamique
  res.sendFile(path.join(__dirname, "index.html"));
})

app.post('/product/add', (req,res) => {
  if (req.body.id && req.body.name && req.body.desc){ // id (clé ppale), name, description
    db.push("/" + req.body.id, { name: req.body.name,desc: req.body.desc});
    return res.send("insertion ok");
  } else {
    return res.status(401).send('bad request parameters');
  }
})

app.get('/product/:id', (req,res) => {
  try {
    let data = db.getData("/" + req.params.id);
    res.send(data);
  } catch(error) {
    res.status(401).send('product missinggg');
  };
})
// taper dans le navigateur : http://localhost:8081/p roduct/get/234

app.delete('/product/delete/:id', (req, res) => {
  db.delete("/" + req.params.id);
  res.status(200).send('😝');
})
// taper : http://localhost:8081/product/delete/345

server.listen(8081);
