

var _HTTP_HOST;
var _RAW_HTTP_HOST;
var _WEBSOCKET_PROT;

const FORCE_PROD = false;

if (!FORCE_PROD && ( !process.env.NODE_ENV || process.env.NODE_ENV === 'development' )) {

  _RAW_HTTP_HOST = "localhost:3000"; 
  _HTTP_HOST = `http://${_RAW_HTTP_HOST}`;
  _WEBSOCKET_PROT = "ws";

  console.log("We are Development");

} else {

  _RAW_HTTP_HOST = "firepit_api.ezcampus.org"; 
  _HTTP_HOST = `https://${_RAW_HTTP_HOST}`;
  _WEBSOCKET_PROT = "wss";

}

export const HTTP_HOST = _HTTP_HOST;
export const RAW_HTTP_HOST = _RAW_HTTP_HOST;

export const WEBSOCKET_PROT = _WEBSOCKET_PROT;

export const LOCAL_STORAGE__JOIN_ROOM_QUERY_KEY = "requested_self";