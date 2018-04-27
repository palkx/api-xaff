import * as bcrypt from "bcryptjs";
import * as mongoose from "mongoose";

const userSchema: mongoose.Schema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  name: { type: String },
  email: { type: String, unique: true, lowercase: true, trim: true, required: true },
  password: { type: String, required: true, select: false },
  roles: [ String ],
  changedBy: { type: String, default: undefined }
},
{timestamps: {
  createdAt: "created",
  updatedAt: "updated"
}});

// Before saving the user, hash the password
userSchema.pre("save", function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(this.password, salt, function (error, hash) {
      if (error) {
        return next(error);
      }
      this.password = hash;
      next();
    });
  });
});

userSchema.pre("findOneAndUpdate", function(next) {
  const user = this.getUpdate();
  if (!user.password) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) {
        return next(error);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = (candidatePassword, password, callback) => {
  bcrypt.compare(candidatePassword, password, (err, isMatch) => {
    console.log(candidatePassword + "/" + password);
    if (err) {
      return callback(err);
    }
    callback(undefined, isMatch);
  });
};

// Omit the password when returning a user
/*userSchema.set('toJSON', {
  /*transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});*/

const user = mongoose.model("user", userSchema);

export default user;
