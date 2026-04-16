import { useEffect, useState } from "react";
import API from "../services/api";

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user",
  });

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

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">User Management</h2>

      <div className="flex gap-2 mb-4">
        <input
          placeholder="Email"
          className="border p-2"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Password"
          className="border p-2"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <select
          className="border p-2"
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4"
        >
          Create
        </button>
      </div>

      {users.map((u) => (
        <div key={u._id} className="border p-3 mb-2 rounded">
          {u.email} — {u.role}
        </div>
      ))}
    </div>
  );
}

export default Users;