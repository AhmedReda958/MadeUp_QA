import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    // Existing fields...
    username: {
      type: String,
      // required: [true, "Username is required"],
      unique: [true, "Username must be unique"],
      trim: true, // Remove leading/trailing whitespaces
      match: [
        /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
        "Username invalid, it should contain 8-20 alphanumeric letters and be unique!",
      ],
    },
    email: {
      type: String,
      // required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
      trim: true,
      lowercase: true, // Store emails in lowercase for consistency
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
    },
    fullName: {
      type: String,
      default: function () {
        return this.username; // Set default value to username
      },
    },
    bio: {
      type: String,
      default: "Tell us something about yourself...",
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
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
    // New social media fields...
    socialMedia: {
      facebook: {
        type: String,
      },
      twitter: {
        type: String,
      },
      instagram: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      Link: {
        type: String,
      },
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
// Indexes
userSchema.index({ username: 1, email: 1 });

userSchema.pre("save", async function (next) {
  // Middleware for updating 'updatedAt'
  this.updatedAt = new Date();

  //for password hashing
  if (this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// Custom method to compare hashed passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = models.User || model("User", userSchema);

export default User;
