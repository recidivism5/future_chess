class Room {
    constructor(){
		this.peerConnection = null;
		this.dataChannel = null;
		this.clientID = null;
		this.peerID = null;
		this.ws = new WebSocket("wss://netplayjs.varunramesh.net");
		this.ws.onmessage = (message) => {
			var msg = JSON.parse(message.data);
			if (msg.kind === "registration-success"){
				this.clientID = msg.clientID;
				this.iceServers = msg.iceServers;
			} else if (msg.kind === "peer-message"){
				if (!this.peerConnection){
					this.initPC();
					this.peerID = msg.sourceID;
					this.peerConnection.onicecandidate = (event) => {
						if (event.candidate) {
							this.signal({
								kind: "send-message",
								type: "candidate",
								destinationID: msg.sourceID,
								payload: event.candidate,
							});
						}
					};
					this.peerConnection.ondatachannel = (event) => {
						this.setDataChannel(event.channel);
					};
				}
				if (msg.type === "offer"){
					this.peerConnection.setRemoteDescription(msg.payload)
					.then(() => this.peerConnection.createAnswer()
					.then((answer) => this.peerConnection.setLocalDescription(answer)
					.then(() => this.signal({
						kind: "send-message",
						type: "answer",
						destinationID: this.peerID,
						payload: answer,
					}))));//kek
				}
				else if (msg.type === "answer"){
					console.log(msg);
					this.peerConnection.setRemoteDescription(msg.payload);
				}
				else if (msg.type === "candidate"){
					console.log(msg);
					this.peerConnection.addIceCandidate(msg.payload);
				}
			}
			if (!this.peerConnection){
				var surl = window.location.href.split("#");
				if (surl.length == 2){
					this.peerID = surl[1];
					this.initPC();
					this.peerConnection.onnegotiationneeded = (ev) => {
						this.peerConnection.createOffer()
						.then((offer) => this.peerConnection.setLocalDescription(offer)
						.then(() => 
							this.signal({
								kind: "send-message",
								type: "offer",
								destinationID: this.peerID,
								payload: this.peerConnection.localDescription,
							})
						)
						.catch((err) => 
							console.error(err)
						));
					};
					this.setDataChannel(this.peerConnection.createDataChannel("data", {ordered: true}));
				}
			}
		};
    }
	initPC(){
		this.peerConnection = new RTCPeerConnection({iceServers: this.iceServers});
		window.addEventListener("beforeunload", (e) => {
			this.close();
		});
		this.peerConnection.onconnectionstatechange = (event) => {
			if (this.peerConnection.connectionState === "disconnected") {
				this.close();
			}
		};
	}
	setDataChannel(dataChannel) {
        this.dataChannel = dataChannel;
        this.dataChannel.binaryType = "arraybuffer";
        this.dataChannel.onopen = (e) => {
			console.log("dataChannel opened.");
        };
        this.dataChannel.onmessage = (e) => {
			console.log("Received data.");
            //this.emit("data", msgpack_lite__WEBPACK_IMPORTED_MODULE_2__.decode(new Uint8Array(e.data)));
        };
        this.dataChannel.onclose = (e) => {
            this.close();
        };
    }
	signal(msg){
        this.ws.send(JSON.stringify(msg));
    }
	close(){
		this.peerConnection.close();
		if (this.dataChannel){
			this.dataChannel.close();
		}
	}
	getURL(){
		return window.location.href + "#" + this.clientID;
	}
};