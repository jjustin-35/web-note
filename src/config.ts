let API_BASE_URL = "/api";
let HOST = "http://localhost:5173";

switch (process.env.NODE_ENV) {
  case "production":
    HOST = "https://web-note-nine.vercel.app";
    break;
  default:
    break;
}

export { API_BASE_URL, HOST };
