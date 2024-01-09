class PeerConnection {
    constructor(client, peerID, initiator){
        this.closed = false;
        this.client = client;
        this.peerID = peerID;
        // Create a RTCPeerConnection.
        this.peerConnection = new RTCPeerConnection({
            iceServers: client.iceServers,
        });
        // Close the connection if the browser page is closed.
        window.addEventListener("beforeunload", (e) => {
            var _a;
            this.peerConnection.close();
            (_a = this.dataChannel) === null || _a === void 0 ? void 0 : _a.close();
        });
        // Send out candidate messages as we generate ICE candidates.
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.client.send({
                    kind: "send-message",
                    type: "candidate",
                    destinationID: peerID,
                    payload: event.candidate,
                });
            }
        };
        this.peerConnection.onconnectionstatechange = (event) => {
            if (this.peerConnection.connectionState === "disconnected") {
                this.close();
            }
        };
        if (initiator) {
            // Invoked when we are ready to negotiate.
            this.peerConnection.onnegotiationneeded = () => __awaiter(this, void 0, void 0, function* () {
                // Create an offer and send to our peer.
                const offer = yield this.peerConnection.createOffer();
                this.client.send({
                    kind: "send-message",
                    type: "offer",
                    destinationID: peerID,
                    payload: offer,
                });
                // Install this offer locally.
                yield this.peerConnection.setLocalDescription(offer);
            });
            // Create a reliable data channel.
            this.setDataChannel(this.peerConnection.createDataChannel("data", {
                ordered: true,
            }));
        }
        else {
            this.peerConnection.ondatachannel = (event) => {
                this.setDataChannel(event.channel);
            };
        }
    }
    close() {
        var _a;
        if (!closed) {
            this.closed = true;
            this.peerConnection.close();
            (_a = this.dataChannel) === null || _a === void 0 ? void 0 : _a.close();
            this.onClose.emit();
        }
    }
    setDataChannel(dataChannel) {
        this.dataChannel = dataChannel;
        this.dataChannel.binaryType = "arraybuffer";
        this.dataChannel.onopen = (e) => {
            this.emit("open");
        };
        this.dataChannel.onmessage = (e) => {
            this.emit("data", msgpack_lite__WEBPACK_IMPORTED_MODULE_2__.decode(new Uint8Array(e.data)));
        };
        this.dataChannel.onclose = (e) => {
            this.close();
        };
    }
    onSignalingMessage(type, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type === "offer") {
                // Set the offer as our remote description.
                yield this.peerConnection.setRemoteDescription(payload);
                // Generate an answer and set it as our local description.
                const answer = yield this.peerConnection.createAnswer();
                yield this.peerConnection.setLocalDescription(answer);
                // Send the answer back to our peer.
                this.client.send({
                    kind: "send-message",
                    type: "answer",
                    destinationID: this.peerID,
                    payload: answer,
                });
            }
            else if (type === "answer") {
                // Set the answer as our remote description.
                yield this.peerConnection.setRemoteDescription(payload);
            }
            else if (type === "candidate") {
                // Add this ICE candidate.
                yield this.peerConnection.addIceCandidate(payload);
            }
        });
    }
    send(data) {
        var _a;
        if (((_a = this.dataChannel) === null || _a === void 0 ? void 0 : _a.readyState) !== "open")
            return;
        let encoded = msgpack_lite__WEBPACK_IMPORTED_MODULE_2__.encode(data);
        this.sendStats.onMessage(encoded.byteLength);
        this.dataChannel.send(encoded);
    }
}

const DEFAULT_SERVER_URL = "https://netplayjs.varunramesh.net";
/**
 * Server URLs are provided using either http:// or https://. We use
 * this URL to connect to any REST endpoints. We can also derive the
 * WebSocket endpoint by changing the protocol to ws:// or wss:// respectively.
 */
function getWebSocketURL(serverURL) {
    const url = new URL(serverURL);
    if (url.protocol === "http:") {
        return `ws://${url.hostname}/`;
    }
    else if (url.protocol === "https:") {
        return `wss://${url.hostname}/`;
    }
    else {
        throw new Error(`Unknown protocol: ${url.protocol}`);
    }
}
class MatchmakingClient {
    constructor(serverURL = DEFAULT_SERVER_URL) {
        this.serverURL = serverURL;
        this.ws = new WebSocket(getWebSocketURL(this.serverURL));
        this.ws.onmessage = (message) => {
            this.onServerMessage(JSON.parse(message.data));
        };
    }
    send(msg) {
        const data = JSON.stringify(msg);
        this.ws.send(data);
    }
    /** THis function handles all messages received from the server. */
    onServerMessage(msg) {
        if (msg.kind === "registration-success") {
            // If we registered successfully, emit an event.
            this.clientID = msg.clientID;
            this.iceServers = msg.iceServers;
        }
        else if (msg.kind === "peer-message") {
            // We've received a peer message. Check if we already have a
            // matching PeerConnection.
            if (!this.connections.has(msg.sourceID)) {
                // Create the connection and emit it.
                const connection = new PeerConnection(this, msg.sourceID, false);
            }
            // Forward the signaling message to our peer.
            this.connections
                .get(msg.sourceID)
                .onSignalingMessage(msg.type, msg.payload);
        }
    }
    /** Start opening a connection to a peer. */
    connectPeer(peerID) {
        const connection = new PeerConnection(this, peerID, true);
        return connection;
    }
}

class GameMenu {
    connectToHost(hostID) {
        const conn = this.matchmaker.connectPeer(hostID);
        conn.on("open", () => {
            conn.onClose.on(() => {
            });
        });
    }
    constructor() {
        var surl = window.location.href.split("#");
        // The URL of the game is everything before the hash.
        this.gameURL = surl[0];
        // Create a matchmaking client and connect to the server.
        this.matchmaker = new MatchmakingClient();
        // Wait for the client to be registered.
        this.matchmaker.onRegistered.once(() => {
            if (surl.length == 2) {
                // If a hostID was provided in the URL hash,
                // directly connect to that ID.
                this.connectToHost(surl[1]);
            }
            else {
                const room = this.matchmaker.clientID;
                const joinURL = this.getJoinURL(room);
                const qrCanvas = document.createElement("canvas");
                this.startHostListening();
            }
        });
    }
    startHostListening() {
        this.hostListeningHandle = this.matchmaker.onConnection.on((conn) => {
            conn.on("open", () => {
                conn.onClose.on(() => {
                });
            });
        });
    }
    stopHostListening() {
        this.hostListeningHandle.dispose();
    }
    getJoinURL(room) {
        let hashParams = { room: room };
        if (this.matchmaker.serverURL !== _matchmaking_client__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_SERVER_URL) {
            hashParams.server = this.matchmaker.serverURL;
        }
        return `${this.gameURL}#${query_string__WEBPACK_IMPORTED_MODULE_2__.stringify(hashParams)}`;
    }
}