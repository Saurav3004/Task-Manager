import { useEffect, useState } from "react";
import API from "../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", password: "", role: "user" });

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    await API.post("/users", form);
    setForm({ email: "", password: "", role: "user" });
    fetchUsers();
  };

  const inputClass =
    "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition";

  const roleStyles = {
    admin: "bg-purple-100 text-purple-700",
    user: "bg-gray-100 text-gray-600",
  };

  const roleInitialColor = {
    admin: "bg-purple-600",
    user: "bg-blue-500",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">User management</h1>
          <p className="text-sm text-gray-400 mt-1">{users.length} registered user{users.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Create user card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">Add new user</p>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Email address</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={inputClass}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="sm:w-40">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Role</label>
                <select
                  className={inputClass}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                onClick={handleCreate}
                className="sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Create user
              </button>
            </div>
          </div>
        </div>

        {/* User list */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">All users</p>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400">
              No users yet. Create one above.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {users.map((u, i) => (
                <li key={u._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${roleInitialColor[u.role] || "bg-gray-400"}`}>
                      {u.email?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{u.email}</p>
                      <p className="text-xs text-gray-400">User #{i + 1}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleStyles[u.role] || "bg-gray-100 text-gray-500"}`}>
                    {u.role}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default Users;