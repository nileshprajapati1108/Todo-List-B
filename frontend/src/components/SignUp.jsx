import { useEffect, useState } from "react";
import "../style/addtask.css";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp(){

  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('login')) {
      navigate("/");
    }
  }, [navigate]);

  const handleSignUp = async () => {
  let result = await fetch('http://localhost:3200/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  result = await result.json();

  if (result.success) {
    alert(result.message); // will show "Signup successful"
    navigate('/login');
  } else {
    alert(result.message); // will show the correct error like "User already exists"
  }
};



  return (
    <div className="container">
      <h1>Create Account</h1>

      <label>Name</label>
      <input
        type="text"
        placeholder="Enter the name"
        onChange={(e)=>setUserData({...userData, name:e.target.value})}
      />

      <label>Email</label>
      <input
        type="text"
        placeholder="Enter the email"
        onChange={(e)=>setUserData({...userData, email:e.target.value})}
      />

      <label>Password</label>
      <input
        type="password"
        className="in"
        placeholder=" Password"
        onChange={(e)=>setUserData({...userData, password:e.target.value})}
      />

      <button onClick={handleSignUp} className="submit">Sign up</button>
      <Link className="link" to="/login">Login</Link>
    </div>
  );
}
