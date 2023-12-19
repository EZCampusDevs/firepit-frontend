export class WebSocketSingleton {
  static instance = null;

  static getInstance() {
    if (WebSocketSingleton.instance === null) {
      WebSocketSingleton.instance = new WebSocketSingleton();
    }
    return WebSocketSingleton.instance;
  }

  constructor() {
    this.ws = null;
    this.HTTP_HOST = "http://localhost:8080/firepit";
    this.RAW_HOST = "localhost:8080/firepit";
    this.WS_PREFIX = "ws"; // In production, change this to `wss`
  }

  connect(SOCKET_CONNECTION_PAYLOAD) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log("ERROR CONNECTING: Already in a room");
      return;
    }

    if (this.ws) { //* If the variable isn't null or false, but it's not open, just close it as it's probably dangling
      this.ws.close();
    }

    const SOCKET_CONNECTION_STRING = `${this.WS_PREFIX}://${this.RAW_HOST}/websocket/${SOCKET_CONNECTION_PAYLOAD}`;
    console.log(SOCKET_CONNECTION_STRING);

    this.ws = new WebSocket(SOCKET_CONNECTION_STRING);

    this.ws.onopen = () => {
      console.log("websocket open");
      this.ws.send(this.getOKMessage());
    };

    this.ws.onmessage = function (event) {
      console.log("room data: " + event.data);

      const json = JSON.parse(event.data);

      if (!json) {
        return;
      }

      console.log(json);

      // room info message
      if (json.messageType === 60) {
        console.log("");
      }

      // client joins room
      if (json.messageType === 50) {
        console.log("");
      }

      // client leaves room
      if (json.messageType === 40) {
        console.log("");
      }

      // set speaker
      if (json.messageType === 30) {
        console.log("Setting speaker to " + json.speaker_id);
      }
    };

    // Implement other event handlers (onerror, onclose) as needed
  }
}

