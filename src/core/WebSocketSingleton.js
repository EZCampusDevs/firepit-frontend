
import { HTTP_HOST, RAW_HTTP_HOST, WEBSOCKET_PROT } from "./Constants";

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
      this.WS_PREFIX = WEBSOCKET_PROT;
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

    this.ws.onopen = () => {
      console.log("websocket open");
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
        payload: {
          speaker_id: passingToUUID
        }
      }));

    } else {
      console.error("SET SPEAKER ERROR; WebSocket is not open.");
    }
  }

  disconnect() {
    if (this.ws) {
      console.log("Disconnecting WebSocket...");
      
      // Close the WebSocket if it's open or in the process of opening
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close();
      }
  
      // Optionally: Handle any cleanup actions after WebSocket is closed
      // This could involve resetting instance variables or executing any callback functions
      this.ws.onclose = () => {
        console.log("WebSocket disconnected.");
        // Reset the WebSocket instance to null to ensure the singleton can establish a new connection later
        this.ws = null;
      };
  
      // If there's a need to handle errors (optional but recommended)
      this.ws.onerror = (error) => {
        console.error("WebSocket encountered an error: ", error);
        // Ensure WebSocket is closed if an error occurs
        this.ws.close();
      };
    } else {
      console.log("No active WebSocket connection to disconnect.");
    }
  }

}


