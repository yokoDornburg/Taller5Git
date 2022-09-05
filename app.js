//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
const { Client } = require('pg');
var connectionString = "postgres://postgres:postgres@db:5432/postgres";
const client = new Client({
    connectionString: connectionString
});
client.connect();
/*aqui estamos requiriendo el modulo dentro del archivo date.js y como no es algo que deba enviarse
al browser para funcionar, si que es parte del proceso en el backend, entonces puede perfectamente 
estar en el root

La forma de usarlo es como se muestra abajo con el comando date(), ya que solo existe un modulo
pero si fuera mas de uno variaria como se observara en el siguiente branch
*/
let items = [];
let workItems = [];


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


//every time something is display on screen is because
//it was sent to it so that we 
app.get("/", function(req, res) {
    res.render("list", { listTitle: date.SpanishDay(), listOfItems: items });
});

app.post("/", function(request, response) {
    let newItem = request.body.newItem;

    if (request.body.listTitle == "work") {
        workItems.push(newItem); //guardando el new item en el array workItems
        //despues de guardar los datos podriamos decir que la pagina se recarga
        response.redirect("/work");
    } else {

        items.push(newItem);
        response.redirect("/");
    }

});


//este es como decir el metodo para cargar la pagina
app.get('/work', function(request, response) {
    let title = 'work';
    response.render("list", { listTitle: title, listOfItems: workItems });
});

app.get("/about", function(req, res) {
    res.render('about');
});
app.get('/postgres', function (req, res, next) {
    client.query('SELECT * FROM Employee where id = $1', [1], function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        res.status(200).send(result.rows);
    });
});
app.listen(process.env.PORT, function () {
    console.log('Server is running on Port'+process.env.PORT );
});

