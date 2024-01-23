
import { HTTP_HOST, RAW_HTTP_HOST } from "./Constants";

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
      this.HTTP_HOST = HTTP_HOST;
      this.RAW_HOST = RAW_HTTP_HOST;
      this.WS_PREFIX = "ws";
  }

  connect(SOCKET_CONNECTION_PAYLOAD, callback) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log("ERROR CONNECTING: Already in a room");
      return;
    }

    if (this.ws) { //* If the variable isn't null or false, but it's not open, just close it as it's probably dangling
      this.ws.close();
    }

    const SOCKET_CONNECTION_STRING = `${this.WS_PREFIX}://${this.RAW_HOST}/ws${SOCKET_CONNECTION_PAYLOAD}`;
    console.log(SOCKET_CONNECTION_STRING);

    this.ws = new WebSocket(SOCKET_CONNECTION_STRING);

    this.ws.onclose = () => {
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
      setTimeout(function() {
        connect(SOCKET_CONNECTION_PAYLOAD, callback);
      }, 1000);
    }

    this.ws.onopen = () => {
      console.log("websocket open");
      
      this.ws.send(
        JSON.stringify({
          messageType: 200,
        }));

    };

    this.ws.onmessage = function (event) {

        const json = JSON.parse(event.data);
        console.log(json);
        callback(json);

      if (!json) {
        return;
      }

    };

    // Implement other event handlers (onerror, onclose) as needed
  }

  //* passingToUUID, I'm passing the stick to UUID:
  setSpeaker(passingToUUID) {
    
    console.log("Trying to send Speaker Set MSG");

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
          messageType: 30,
          speaker_id: passingToUUID
      }));
  } else {
      console.error("SET SPEAKER ERROR; WebSocket is not open.");
  }
  }
}

