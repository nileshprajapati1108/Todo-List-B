import "../style/addtask.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';   // ⭐ FIXED: useNavigate import

export default function AddTask() {

  const [taskData, setTaskData] = useState({
    title: "",
    description: ""
  });

  const navigate = useNavigate();   // ⭐ FIXED

  const handleTaskSubmit = async (event) => {
    event.preventDefault();
    console.log("Task Data:", taskData);

    let result = await fetch("http://localhost:3200/add-task", {
      method: 'POST',
      body: JSON.stringify(taskData),
      credentials:"include",
      headers: {
        'Content-Type': 'application/json'
      }
    });

    result = await result.json();

    if (result.success) {
      alert("Task Added Successfully");

      // 👉 Clear form after submit
      setTaskData({
        title: "",
        description: ""
      });

      navigate('/');

    } else {
      alert("Failed to add task");
    }
  };

  return (
    <div className="container">
      <h1>Add New Task</h1>

      <form onSubmit={handleTaskSubmit}>

        <label htmlFor="taskTitle">Task Title</label>
        <input
          type="text"
          id="taskTitle"
          required
          value={taskData.title}
          onChange={(event) =>
            setTaskData({ ...taskData, title: event.target.value })
          }
        />

        <br />

        <label htmlFor="taskDesc">Task Description</label>
        <textarea
          id="taskDesc"
          rows={4}
          required
          value={taskData.description}
          onChange={(event) =>
            setTaskData({ ...taskData, description: event.target.value })
          }
        ></textarea>

        <br />

        <button type="submit" className="submit">Add New Task</button>
      </form>
    </div>
  );
}
