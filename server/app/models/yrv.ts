/*
 * Created on Sat Jul 28 2018
 * Copyright © 2017-2018 Mikhail K. (iSm1le)
 * Licensed under the Apache License, Version 2.0
 */
// import * as bcrypt from "bcryptjs";
import * as mongoose from "mongoose";

const yrvSchema = new mongoose.Schema({
  videoId: { type: String, unique: true, required: true },
  friendlyName: { type: String, default: undefined },
  start: { type: Number, trim: true, default: 0 },
  end: { type: Number, trim: true, default: undefined },
  views: { type: Number, trim: true, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  reports: { type: Number, default: 0 },
  disabled: { type: Boolean, default: false },
  changedBy: { type: String, default: undefined }
},
{timestamps: {
  createdAt: "created",
  updatedAt: "updated"
}});

const YRV = mongoose.model("YRV", yrvSchema);

export default YRV;
