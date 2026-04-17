import { useEffect, useState } from "react";
import API from "../services/api";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [filters, setFilters] = useState({ search: "", status: "", priority: "" });
  const [form, setForm] = useState({
    title: "", status: "pending", priority: "low", assignedTo: "", files: null,
  });

  const fetchTasks = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await API.get(`/tasks?${query}`);
      setTasks(res.data.tasks);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data.users);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchTasks();
    if (user?.role === "admin") fetchUsers();
  }, [filters]);

  const handleCreate = async () => {
    if (!form.title) return;
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("status", form.status);
      fd.append("priority", form.priority);
      if (form.assignedTo) fd.append("assignedTo", form.assignedTo);
      if (form.files) for (let f of form.files) fd.append("documents", f);
      await API.post("/tasks", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setForm({ title: "", status: "pending", priority: "low", assignedTo: "", files: null });
      fetchTasks();
    } catch (err) { console.error(err.response?.data || err.message); }
  };

  const handleDelete = async (id) => {
    try { await API.delete(`/tasks/${id}`); fetchTasks(); }
    catch (err) { console.error(err); }
  };

  const handleStatusChange = async (id, status) => {
    try { await API.put(`/tasks/${id}`, { status }); fetchTasks(); }
    catch (err) { console.error(err); }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => { dispatch(logout()); navigate("/login"); };

  const statusBadge = {
    pending: "bg-amber-100 text-amber-800",
    "in-progress": "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
  };

  const priorityBadge = {
    low: "bg-green-100 text-green-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-red-100 text-red-800",
  };

  const selectClass = "border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-400";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Welcome back</p>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              Dashboard
              {isAdmin && (
                <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-600 border border-gray-200 bg-white px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">Filters</p>
          <div className="flex flex-wrap gap-2">
            <input
              placeholder="Search tasks..."
              className={`${selectClass} flex-1 min-w-36`}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <select className={selectClass} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <select className={selectClass} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
              <option value="">All priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Create Task */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">New task</p>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              placeholder="Task title..."
              className={`${selectClass} flex-1 min-w-44`}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <select value={form.status} className={selectClass} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <select value={form.priority} className={selectClass} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {isAdmin && (
              <select value={form.assignedTo} className={selectClass} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                <option value="">Assign user</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>{u.email}</option>
                ))}
              </select>
            )}
            <label className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
              📎 Attach files
              <input type="file" multiple className="hidden" onChange={(e) => setForm({ ...form, files: e.target.files })} />
            </label>
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add task
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="flex flex-col gap-3">
          {tasks.map((t) => (
            <div key={t._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <p className="font-medium text-gray-900">{t.title}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusBadge[t.status] || "bg-gray-100 text-gray-600"}`}>
                      {t.status}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityBadge[t.priority] || "bg-gray-100 text-gray-600"}`}>
                      {t.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Assigned to: {t.assignedTo?.email || "Unassigned"}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {(user?.role === "admin" || t.assignedTo?._id === user?._id) && (
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusChange(t._id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In progress</option>
                      <option value="done">Done</option>
                    </select>
                  )}
                  {user?.role === "admin" && (
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1"
                      title="Delete task"
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>

              {/* File attachments */}
              {t.documents?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.documents.map((doc, i) => (
                    <a
                      key={i}
                      href={`https://task-manager-9mtr.onrender.com${doc.filePath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      📄 File {i + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No tasks found. Create one above!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;