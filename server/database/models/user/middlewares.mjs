import bcrypt from "bcrypt";
import schema from "./schema.mjs";

schema.pre("validate", function (next) {
  if (typeof this.username == "string")
    this.username = this.username.toLowerCase();
  next();
});

schema.pre("save", async function (next) {
  this.updatedAt = new Date();

  if (this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});
