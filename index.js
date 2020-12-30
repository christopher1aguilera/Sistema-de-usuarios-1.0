const http = require("http");
const url = require("url");
const { insertar, consultar, login} =
require("./consultas");
const fs = require("fs");

http
.createServer(async (req, res) => {
if (req.url == "/" && req.method === "GET") {
res.setHeader("content-type", "text/html");
const html = fs.readFileSync("index.html", "utf8");
res.end(html);
}

// Paso 1
if ((req.url == "/usuario" && req.method == "POST")) {
let body = "";
req.on("data", (payload) => {
body += payload;
});
req.on("end", async () => {
const datos = Object.values(JSON.parse(body));
const respuesta = await insertar(datos);
res.end(JSON.stringify(respuesta));
});
}

// Paso 2
if ((req.url == "/login" && req.method == "POST")) {
    let body = "";
    req.on("data", (payload) => {
    body += payload;
    });
    req.on("end", async () => {
    const datos = Object.values(JSON.parse(body));
    const respuesta = await login(datos);
    // console.log(respuesta.length)
    // console.log(datos[0])
    if (respuesta.length == 0){
        console.log('error')
        // res.end('error')
    }
    else{
        console.log('exito')
        res.end(JSON.stringify(respuesta))
    }
    });
    }

// Paso 3
if (req.url == "/usuarios" && req.method === "GET") {
    const registros = await consultar();
    fs.writeFileSync("usuarios.json",JSON.stringify(registros));
    res.end(JSON.stringify(registros));
    }

})
.listen(3000);