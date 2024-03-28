import mongoose from "mongoose";

/**
 * @type {mongoose.SchemaDefinition}
 */
const definition = {
  username: {
    type: String,
    trim: true,
    required: [true, "MISSING_USERNAME"],
    match: [
      /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-z0-9._]+(?<![_.])$/,
      "INVALID_USERNAME",
    ],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "MISSING_EMAIL"],
    match: [/^\S+@\S+\.\S+$/, "INVALID_EMAIL"],
  },
  password: {
    type: String,
    // match: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "INVALID_PASSWORD"], // TODO: more strength
    required: [true, "MISSING_PASSWORD"],
  },
  fullName: {
    type: String,
    default: function () {
      return this.username;
    },
  },
  bio: {
    type: String,
  },
  profilePicture: {
    link: {
      type: String,
    },
    deletehash: { type: String },
  },
  lastSeen: {
    type: Date,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  // TODO: add social media links
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
};

/**
 * @type {mongoose.SchemaOptions}
 */
const options = {
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.email; // ! Temporally
    },
  },
};

/**
 * @type {mongoose.Schema}
 */
const schema = new mongoose.Schema(definition, options);

schema.index({ username: 1 }, { name: "username", unique: true });
schema.index({ email: 1 }, { name: "email", unique: true });

import methods from "./methods.mjs";
Object.keys(methods).forEach(methodName => schema.method[methodName] = methods[methodName]);

export default schema;
