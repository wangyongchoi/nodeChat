window.onload = function() {
	const socket = io.connect("ws://10.106.151.60:3000");
	const list = document.getElementById("chatInput");
	const text = document.getElementById("txtChat");
	const listPanel = document.getElementById("chatListPanel");

	text.focus();

	text.onkeydown = sendMessage.bind(this);
	function sendMessage(event) {
	 if (event.keyCode === 13) {
			const message = event.target.value;

			if (message) {
				socket.emit("serverReceiver", message);
				text.value = "";
			}
	 }
	}

	socket.on("clientReceiver", data => {
		const message = `<li class="media">
											<div class="media-body">
													<div class="media">
															<a class="pull-left" href="#">
																	<img class="media-object img-circle " src="assets/img/user.png" />
															</a>
															<div class="media-body" >
																` + data.message + `
																<br />
																<small class="text-muted">왕용친구` + data.clientID + `</small>
																<hr />
															</div>
													</div>
											</div>
									</li>`;

		list.innerHTML += message;
		listPanel.scrollTop = listPanel.scrollHeight;
	});
};
