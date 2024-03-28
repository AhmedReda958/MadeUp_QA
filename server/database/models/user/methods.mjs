import bcrypt from "bcrypt";

export default {
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  },
};
