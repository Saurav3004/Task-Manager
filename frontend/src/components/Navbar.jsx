import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="flex justify-between items-center px-6 py-3 bg-gray-900 text-white">
      <h1 className="font-bold">Task Manager</h1>

      <div className="flex gap-4 items-center">
        <Link to="/">Dashboard</Link>

        {user?.role === "admin" && <Link to="/users">Users</Link>}

        <button
          onClick={() => dispatch(logout())}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;