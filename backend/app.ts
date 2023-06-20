import {encriptar} from "./encriptacion";

const express = require('express');
const mysql=require("mysql");
const app=express();
//cors
const cors=require('cors');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json()


//algoritmo de encriptacion


app.use(cors());

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    port:  3306,
    database : 'Ecommerce'
  });

  connection.connect(function(err:any) {
    if (err) {
      console.error('Error conectando a la DB ' + err.stack);
      return;
    }
    console.log('Conexión establecida' + connection.threadId);
  });

//creamos servidor
const configuracion={
    hostname: "127.0.0.1",
    port: 3000,
}

app.get("",(req:any, res:any) => {
    connection.query("select * from Usuarios", function(error:any, results:any, fields:any){
        res.send(JSON.stringify(results));
    });
});

app.post("",jsonParser,(req:any, res:any) => {
    let usuario=req.body.usuario;
    let clave=req.body.clave;
    console.log(usuario);
    connection.query("select * from Usuarios where Usuario=? and Password=?",[usuario,clave],function(error:any,results:any,fields:any){
        res.send(JSON.stringify(results));
    });
})

//PUT VIENE CON EL CODIGO
app.put("/registro",jsonParser,(req:any, res:any) => {
    let nombre=req.body.nombre;
    let apellidos=req.body.apellidos;
    let email=req.body.email;
    let password=req.body.recontrasenya;
    let region=req.body.region;
    let comuna=req.body.comuna;
    
    connection.query("INSERT INTO usuarios (nombres,apellidos,email,password,region,comuna,fecha) VALUES (?,?,?,?,?,?,now())",[nombre,apellidos,email,password,region,comuna],function(error:any,results:any,fields:any){
        if (error) throw error;
        res.send(JSON.stringify({"mensaje":true,"resultado":results}));
    });
  });

app.delete("",jsonParser, (req:any,res:any)=>{
    let usuario=req.body.usuario;
    connection.query("delete from Usuarios where Usuario=?",[usuario],function(error:any,results:any,fields:any){
        res.send(JSON.stringify({"eliminado":true}));
    });
});

app.listen(configuracion, () => {
    console.log(`Conectando al servidor http://localhost:${configuracion.port}`)
})

