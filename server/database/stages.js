export default {
  pagination({ limit, page }) {
    let stages = [];
    if (page > 1)
      stages.push({ $skip: limit * (page - 1) });
    stages.push({ $limit: limit });
    return stages;
  }
}
