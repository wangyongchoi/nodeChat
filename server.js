const app = require("express")();
const url = require("url");

app.get("/", (req, res) => {
	console.log("get:index.html");
	res.sendFile("index.html", {root: __dirname});
});

app.use((req, res) => {
	const fileName = url.parse(req.url).pathname.replace("/", "");

	res.sendFile(fileName, {root: __dirname});
	console.log("use:", fileName);
});

const server = require("http").createServer(app);

server.listen(3000);
const uniqueID = (function() {
	let id = 0;

	return function() { return id++; };
})();

const socket = require("socket.io").listen(server);

socket.sockets.on("connection", client => {
	const clientID = uniqueID();

	console.log("Connection: " + clientID);

	client.on("serverReceiver", value => {
		socket.sockets.emit("clientReceiver", {clientID, message: value});
	});
});
