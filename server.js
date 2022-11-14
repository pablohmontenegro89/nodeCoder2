import express from "express";
import { Server as IOServer } from "socket.io";
import { Server as HttpServer } from "http";
import routerCarrito from "./routes/carritos.router.js";
import routerProductos from "./routes/productos.router.js";
import {normalize, denormalize, schema } from "normalizr"
import generarProductoRandom from "./faker.js"
import util from "util"

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


//--------------------------------------------
app.use(express.static("./public"));
app.get("/", (req, res) => {
	res.sendFile("index.html");
});

const router = express.Router();
app.use("/", router);
app.use("/productos", routerProductos);
app.use("/carritos", routerCarrito);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//productos.listarAll()
//productos.guardar(producto);


const demo=[]

for (let k=0; k<5; k++){ 
	demo.push(generarProductoRandom())
}

const messages = {
	messages:[
		{id: 1,
		author: {
			mail: 'pablo@hotmail.com',
			nombre: 'Pablo',
			apellido: 'Montenegro',
			edad: 20,
			alias: 'pablomontenegro',
			avatar: 'url.com',
		},
		text: "Hola, qué tal?",
	},
	{
		id: 2,
		author: {
			mail: 'julian@hotmail.com',
			nombre: 'Julian',
			apellido: 'Gomez',
			edad: 20,
			alias: 'juliangomez',
			avatar: 'url2.com',
		},
		text: "Todo bien, vos?",
	},
	{
		id: 3,
		author: {
			mail: 'daniel@hotmail.com',
			nombre: 'Daniel',
			apellido: 'Roldan',
			edad: 20,
			alias: 'danielroldan',
			avatar: 'url3.com',
		},
		text: "Me alegro mucho",
	}
]}

const authorSchema = new schema.Entity("author", undefined, {
	idAttribute: "mail",
  });
  const messageSchema = new schema.Entity(
	"message",
	{
	  author: authorSchema,
	},
	{
	  idAttribute: "id",
	}
  );
  const messagesSchemaNmlz = { messages: [messageSchema] };
  const normalizado = normalize(messages, messagesSchemaNmlz);
console.log("================NORMLIZADO=================")
console.log(normalizado)
console.log('normalizado',JSON.stringify(normalizado).length)
console.log('original',JSON.stringify(messages).length)
console.log("================DESNORMLIZADO=================")
// console.log(util.inspect(normalizado, false, Infinity))
const desnormalizado = denormalize(normalizado.result, messagesSchemaNmlz, normalizado.entities)
console.log(util.inspect(desnormalizado, false, Infinity))
console.log('desnormalizado', JSON.stringify(desnormalizado).length)

io.on("connection", (socket) => {
	console.log("se cargó un producto");

	socket.emit("demo", demo);

	socket.on("new-product", (data) => {
		demo.push(data);
		io.sockets.emit("demo", demo);

		  //.finally(() => {
			//knex.destroy();
		  //});
	});


	socket.emit("messages", messages);
	
	socket.on("new-message", (data) => {
		messages.push(data);

		io.sockets.emit("messages", messages);
	});
});

const PORT = 8080;
httpServer.listen(PORT, () => console.log("servidor Levantado"));