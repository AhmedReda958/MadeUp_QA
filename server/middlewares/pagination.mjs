export default function paginationMiddleware(req, res, next) {
  let inputs = ["page", "limit"], issues = {};
  req.pagination = {};
  for(let input of inputs) {
    let value = input in req.query ? Number(req.query[input]) : 1;
    if (Number.isInteger(value) && value > 0)
      req.pagination[input] = value;
    else issues[input] = "Not a positive integer.";
  };
  if (Object.keys(issues).length > 0)
    return res.status(400).json({ code: "INVALID", issues });
  next();
}
