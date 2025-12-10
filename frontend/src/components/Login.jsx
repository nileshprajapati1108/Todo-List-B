import { useEffect, useState } from "react";
import "../style/addtask.css";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {

  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('login')) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async () => {
  let result = await fetch('http://localhost:3200/login', {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: "include"
  });

  result = await result.json();

  if (result.success) {
    document.cookie = `token=${result.token}; path=/`;
    localStorage.setItem('login', userData.email);
    navigate('/');
    window.dispatchEvent(new Event("localStorage-change"));
  } else {
    if (result.error) {
      alert(result.error);
    } else if (result.msg) {
      alert(result.msg);
    } else {
      alert("Invalid email or password");
    }
  }
};


  return (
    <div className="container">
      <h1>Login</h1>

      <label>Email</label>
      <input
        type="text"
        name="email"
        placeholder="Enter the email"
        onChange={(event) =>
          setUserData({ ...userData, email: event.target.value })
        }
      />

      <label>Password</label>
      <input
        type="password"
        name="password"
        placeholder=" Password"
        onChange={(event) =>
          setUserData({ ...userData, password: event.target.value })
        }
        className="in"
      />

      <button onClick={handleLogin} className="submit">Login</button>

      <Link className="link" to="/signup">Signup</Link>
    </div>
  );
}
