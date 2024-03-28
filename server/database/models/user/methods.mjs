import bcrypt from "bcrypt";
import schema from "./schema.mjs";

schema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
