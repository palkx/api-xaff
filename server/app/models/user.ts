import * as bcrypt from 'bcryptjs';
import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, lowercase: true, trim: true, required: true },
  password: { type: String, required: true },
    /* TODO services - array of roles for different projects */
  services: String,
  created: { type: Date, default: Date.now() }
});

// Before saving the user, hash the password
userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function (error, hash) {
      if (error) {
        return next(error);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.pre('findOneAndUpdate', function(next) {
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

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// Omit the password when returning a user
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;
