import UnhandledError from "#errors/unhandled.mjs";

export default function errorsHandler(err, req, res, next) {
  let inLogError = {};
  if (err instanceof UnhandledError) {
    let { error } = err;
    if (error.name == "ValidationError") {
      let issues = {};
      for (let issue in error.errors)
        issues[issue] = error.errors[issue].message
      return res.status(400).json({ code: "INVALID", issues });
    }

    inLogError.action = err.action;
    inLogError.error = error;
  } else {
    inLogError.action = "Unspecified";
    inLogError.error = err;
  }

  console.error(inLogError); // TODO: log errors
  res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
}
