import { SteppedRange } from "@_almahllawi/utils";
let inputs = {
  page: {
    range: new SteppedRange(1, Infinity, 1, true, false),
    default: 1
  },
  limit:  {
    range: new SteppedRange(1, 100),
    default: 50
  }
}

export default function paginationMiddleware(req, res, next) {
  let issues = {};
  req.pagination = {};
  for(let inputName in inputs) {
    let input = inputs[inputName];
    let value = inputName in req.query ? Number(req.query[inputName]) : input.default;
    if (input.range.includes(value)) 
      req.pagination[inputName] = value;
    else
      issues[inputName] = "Not in range.";
  };
  if (Object.keys(issues).length > 0)
    return res.status(400).json({ code: "INVALID", issues });
  next();
}
