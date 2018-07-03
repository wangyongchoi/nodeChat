window.onload = function() {
	const socket = io.connect("ws://10.106.151.60:3000");
	// const socket = io.connect("ws://localhost:3000");
	const list = document.getElementById("chatInput");
	const text = document.getElementById("txtChat");
	const listPanel = document.getElementById("chatListPanel");
	const infoList = document.getElementById("infoList");

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
	socket.on("clientConnectReceiver", data => {
		const infoHTML = `<li class="media">
										<div class="media-body">
												<div class="media">
														<a class="pull-left" href="#">
																<img class="media-object img-circle" style="max-height:40px;" src="assets/img/user.png" />
														</a>
														<div class="media-body" >
																<h5>왕용친구` + data.clientID + ` 님이 입장하셨습니다.</h5>
															<small class="text-muted">` + data.time + `</small>
														</div>
												</div>
										</div>
								</li>`;

		infoList.innerHTML += infoHTML;
	});
	socket.on("clientDisconnectReceiver", data => {
		const infoHTML = `<li class="media">
										<div class="media-body">
												<div class="media">
														<a class="pull-left" href="#">
																<img class="media-object img-circle" style="max-height:40px;" src="assets/img/user.png" />
														</a>
														<div class="media-body" >
																<h5>왕용친구` + data.clientID + ` 님이 퇴장하셨습니다.</h5>
															<small class="text-muted">` + data.time + `</small>
														</div>
												</div>
										</div>
								</li>`;

		infoList.innerHTML += infoHTML;
	});
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
