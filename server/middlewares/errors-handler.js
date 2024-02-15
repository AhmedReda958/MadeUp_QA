export class CommonError extends Error {
  constructor(code, source, showSourceWithStatus) {
    super();
    this.code = code;
    this.source = source;
    this.showSourceWithStatus = showSourceWithStatus;
  }
}

export default function errorsHandler(err, req, res, next) {
  if (err instanceof CommonError) {
    let { showSourceWithStatus, code: commonCode } = err;
    err = err.source;
    
    if (showSourceWithStatus)
      return res.status(showSourceWithStatus).json(err);
      

    if (err.name == "ValidationError") {
      let issues = {};
      for (let issue in err.errors)
        issues[issue] = err.errors[issue].message
      return res.status(400).json({ code: "INVALID", issues });
    }

    if (commonCode == "REGISTER_USER" && err.code == 11000)
      return res.status(409).json({ code: "USER_EXISTS", user: err.keyValue });
  }

  console.error(err); // TODO: log errors
  res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
}
