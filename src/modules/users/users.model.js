import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,  // OAuth users don't have password
    default: null,
  },
  preferences: {
    type: Array,
    default: [],
  },
  provider: {
    type: String,
    default: "email",
  },
});

userSchema.virtual("id").get(function () {
  return this._id;
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.password;
    delete ret.__v;
  },
});

const User = mongoose.model("User", userSchema);

export default User;
