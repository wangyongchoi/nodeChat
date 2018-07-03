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
	socket.sockets.emit("clientConnectReceiver", {clientID, time: getNowTime()});
	socket.on("disconnect", () => {
		socket.sockets.emit("clientDisconnectReceiver", {clientID, time: getNowTime()});
	});
	client.on("serverReceiver", value => {
		socket.sockets.emit("clientReceiver", {clientID, message: value});
	});
});

function getNowTime() {
	now = new Date();
	year = "" + now.getFullYear();
	month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
	day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
	hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
	minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
	second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
	return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
