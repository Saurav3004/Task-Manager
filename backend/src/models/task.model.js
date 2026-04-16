import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    status: {
      type: String,
      enum: ["pending", "in-progress", "done"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: Date,

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    documents: {
      type: [documentSchema],
      validate: [arr => arr.length <= 3, "Max 3 files allowed"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);