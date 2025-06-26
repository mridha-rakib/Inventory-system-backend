import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import { BadRequestError } from "../utils/errors/index.js";

export const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new BadRequestError("Invalid email");
        }
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 5,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new BadRequestError('Password cannot contain "password"');
        }
      },
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
      },
    },
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("User", userSchema);
