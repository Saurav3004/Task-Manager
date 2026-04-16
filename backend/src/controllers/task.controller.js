import Task from "../models/task.model.js";


// 🔹 CREATE TASK
export const createTask = async (req, res) => {
  console.log("here");

  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
    } = req.body;

    const documents =
      req.files?.map((file) => ({
        fileName: file.originalname,
        filePath: `/uploads/${file.filename}`, // 🔥 fix path also
      })) || [];

    console.log("documents", documents);
    console.log("assignedTo raw:", assignedTo);

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,

      // 🔥 CRITICAL FIX
      assignedTo: assignedTo && assignedTo !== "" ? assignedTo : null,

      createdBy: req.user._id,
      documents,
    });

    console.log("task", task);

    res.status(201).json(task);
  } catch (error) {
    console.error("CREATE TASK ERROR:", error); // 🔥 ADD THIS
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      sort = "createdAt",
    } = req.query;

    const query = {};

    // 🔐 Normal users see only their tasks
    if (req.user.role !== "admin") {
      query.$or = [
        { createdBy: req.user._id },
        { assignedTo: req.user._id },
      ];
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate("assignedTo", "email role")
      .populate("createdBy", "email role")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Task.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "email role")
      .populate("createdBy", "email role");

    if (!task) return res.status(404).json({ message: "Task not found" });

    // 🔐 Ownership check
    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() !== req.user._id.toString() &&
      task.assignedTo?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // 🔐 Ownership check
    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.files?.length) {
  const newDocs = req.files.map(file => ({
    fileName: file.originalname,
    filePath: file.path,
  }));

  task.documents = [...task.documents, ...newDocs].slice(0, 3);
}

    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.dueDate = dueDate ?? task.dueDate;
    task.assignedTo = assignedTo ?? task.assignedTo;

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // 🔐 Ownership or admin
    if (
      req.user.role !== "admin" &&
      task.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadFile = (req, res) => {
  const filePath = `src/uploads/${req.params.filename}`;
  res.download(filePath);
};