import bcrypt from "bcrypt";
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "MISSING_USERNAME"],
      match: [
        /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-z0-9._]+(?<![_.])$/,
        "INVALID_USERNAME",
      ],
      index: { name: "username", unique: true }
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "MISSING_EMAIL"],
      match: [/^\S+@\S+\.\S+$/, "INVALID_EMAIL"],
      index: { name: "userEmail", unique: true }
    },
    password: {
      type: String,
      // match: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "INVALID_PASSWORD"], // TODO: more strength
      required: [true, "MISSING_PASSWORD"]
    },
    fullName: {
      type: String,
      default: function () {
        return this.username;
      },
    },
    bio: {
      type: String
    },
    profilePicture: {
      type: String,
    },
    //   friends: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "User",
    //     },
    //   ],
    // socialMedia: {
    //   facebook: {
    //     type: String,
    //   },
    //   twitter: {
    //     type: String,
    //   },
    //   instagram: {
    //     type: String,
    //   },
    //   linkedin: {
    //     type: String,
    //   },
    //   Link: {
    //     type: String,
    //   },
    // },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
  }
);

userSchema.pre("validate", function (next) {
  if (typeof this.username == "string")
    this.username = this.username.toLowerCase();
  next();
});

userSchema.pre("save", async function (next) {
  this.updatedAt = new Date();

  if (this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default models.User || model("User", userSchema);
