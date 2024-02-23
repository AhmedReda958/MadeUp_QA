import IntegerRange from "./lib/range.mjs";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
const { env } = process;

env.NODE_ENV = (env.NODE_ENV ?? 'production').toLowerCase();
console.log(`Working in ${env.NODE_ENV} mode.`);

function isNonEmptyString(input) { return typeof(input) == 'string' && input.length > 0 }
let portsRange = new IntegerRange(0, Math.pow(2,16), 1, false, false);

switch(env.NODE_ENV) {
  case 'development':
    if (!env.MONGODB_URI) env.MONGODB_URI = "mongodb://127.0.0.1:27017/";
    if (!env.HOST) env.HOST = "0.0.0.0";
    if (!isNaN(env.PORT)) env.PORT = 8000;
    if (!env.JWT_SECRET_KEY) env.JWT_SECRET_KEY = "insecure-test-secret-key";
  default:
    if (!isNonEmptyString(env.MONGODB_URI)) throw new Error("Invalid MongoDB URI.");
    if (!isNonEmptyString(env.HOST)) throw new Error("Invalid host address.");
    if (!portsRange.includes(Number(env.PORT))) throw new Error("Invalid port.");
    if (!isNonEmptyString(env.JWT_SECRET_KEY)) throw new Error("Invalid JWT secret key.");
}

