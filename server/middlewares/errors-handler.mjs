import { MongooseError } from "mongoose";
import { isDBConnected } from "#database/connection.mjs";
import { CommonError, DatabaseError } from "#errors/index.mjs";
import { randomString } from "#lib/random.mjs";

export default function errorsHandler(err, req, res, next) {
  let inLogError = { id: randomString(8) };

  if (err instanceof CommonError) {
    Object.assign(inLogError, err)
  } else {
    inLogError.name = "UnhandledError";
    inLogError.source = err;
  }

  if (err instanceof DatabaseError) {
    if (err.source.name == "ValidationError") {
      let issues = {}, { errors } = err.source;
      for (let issue in errors)
        issues[issue] = errors[issue].message
      return res.status(400).json({ code: "INVALID", issues });
    }
  } else if (err instanceof MongooseError && !isDBConnected()) {
    return res.status(400).json({ code: "UNAVAILABLE", "database-issue": "CONNECTION_FAILURE" });
  }

  console.error(inLogError); // TODO: log errors

  res.status(500).json({ code: "INTERNAL_SERVER_ERROR", id: inLogError.id });
}
