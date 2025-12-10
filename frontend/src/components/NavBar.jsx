import { Link, useNavigate } from "react-router-dom";
import "../style/navbar.css";
import { useEffect, useState } from "react";

function NavBar() {
  const [login, setLogin] = useState(localStorage.getItem("login"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("login");
    setLogin(null);
    window.dispatchEvent(new Event("localStorage-change"));
    navigate("/login");
  };

  useEffect(() => {
    const handleStorage = () => {
      setLogin(localStorage.getItem("login"));
    };
    window.addEventListener("localStorage-change", handleStorage);
    return () => {
      window.removeEventListener("localStorage-change", handleStorage);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">To Do App</div>
      <ul className="nav-links">
        {login && (
          <>
            <li className="list">
              <Link to="/">List</Link>
            </li>
            <li className="addtask">
              <Link to="/add">Add Task</Link>
            </li>
            <li className="addtask">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              >
                Logout
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
