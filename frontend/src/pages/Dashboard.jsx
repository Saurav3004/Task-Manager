import { useEffect, useState } from "react";
import API from "../services/api";
import { useSelector,useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const {user} = useSelector((state) => state.auth);
    console.log(user)
    
    
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const isAdmin = user?.role?.toLowerCase() === "admin";
    const hasUsers = users?.length > 0;
    console.log(hasUsers)

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
  });

  const [form, setForm] = useState({
    title: "",
    status: "pending",
    priority: "low",
    assignedTo: "",
    files: null,
  });

  // 🔹 Fetch Tasks
  const fetchTasks = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await API.get(`/tasks?${query}`);
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Fetch Users (Admin only)
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    if (user?.role === "admin") {
      fetchUsers();
    }
  }, [filters]);

  // 🔹 Create Task
  const handleCreate = async () => {
    if (!form.title) return;

    try {
      const fd = new FormData();

      fd.append("title", form.title);
      fd.append("status", form.status);
      fd.append("priority", form.priority);

      // ✅ FIX: send assignedTo
      if (form.assignedTo) {
        fd.append("assignedTo", form.assignedTo);
      }

      if (form.files) {
        for (let f of form.files) {
          fd.append("documents", f);
        }
      }

      await API.post("/tasks", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // reset form
      setForm({
        title: "",
        status: "pending",
        priority: "low",
        assignedTo: "",
        files: null,
      });

      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Delete
  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Update Status
  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };
  const dispatch = useDispatch();
const navigate = useNavigate();

  const handleLogout = () => {
  dispatch(logout());
  navigate("/login");
};

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
  <h1 className="text-3xl font-bold">
    Dashboard {user?.role === "admin" && "(Admin)"}
  </h1>

  <button
    onClick={handleLogout}
    className="bg-red-500 text-white px-4 py-2 rounded"
  >
    Logout
  </button>
</div>

      {/* 🔹 FILTERS */}
      <div className="flex flex-wrap gap-2 mb-6">
        <input
          placeholder="Search..."
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />

        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, priority: e.target.value })
          }
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* 🔹 CREATE TASK */}
      <div className="flex flex-wrap gap-2 mb-8">
        <input
          placeholder="Task title"
          className="border p-2 rounded flex-1"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <select
          value={form.status}
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={form.priority}
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* 🔥 Assign User (Admin Only) */}
        {isAdmin && (
          <select
            value={form.assignedTo}
            className="border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, assignedTo: e.target.value })
            }
          >
            <option value="">Assign User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.email}
              </option>
            ))}
          </select>
        )}

        <input
          type="file"
          multiple
          className="border p-2 rounded"
          onChange={(e) =>
            setForm({ ...form, files: e.target.files })
          }
        />

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* 🔹 TASK LIST */}
      <div className="grid gap-4">
        {tasks.map((t) => (
          <div
            key={t._id}
            className="border p-4 rounded shadow-sm bg-white"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-lg">{t.title}</p>
                <p className="text-sm text-gray-500">
                  {t.status} | {t.priority}
                </p>

                {/* ✅ Assigned User */}
                <p className="text-sm text-gray-600">
                  Assigned to:{" "}
                  {t.assignedTo?.email || "Unassigned"}
                </p>
              </div>

              {/* DELETE (ADMIN) */}
              {user?.role === "admin" && (
                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              )}
            </div>

            {/* STATUS UPDATE */}
            {(user?.role === "admin" ||
              t.assignedTo?._id === user?._id) && (
              <select
                value={t.status}
                onChange={(e) =>
                  handleStatusChange(t._id, e.target.value)
                }
                className="border mt-2 p-1 rounded"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            )}

            {/* FILES */}
            <div className="mt-2">
              {t.documents?.map((doc, i) => (
                <a
                  key={i}
                  href={`http://localhost:5000${doc.filePath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 text-sm block"
                >
                  View File {i + 1}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;