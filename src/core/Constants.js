

var _HTTP_HOST;
var _RAW_HTTP_HOST;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {

  _RAW_HTTP_HOST = "localhost:3000"; 
  _HTTP_HOST = `http://${_RAW_HTTP_HOST}`;

  console.log("We are Development");

} else {

  _RAW_HTTP_HOST = "firepit_api.ezcampus.org"; 
  _HTTP_HOST = `https://${_RAW_HTTP_HOST}`;

}

export const HTTP_HOST = _HTTP_HOST;
export const RAW_HTTP_HOST = _RAW_HTTP_HOST;
