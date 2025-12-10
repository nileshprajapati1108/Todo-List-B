import React, { useEffect, useState } from "react";
import "../style/list.css";

function List() {
  const [taskData, setTaskData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDesc, setUpdatedDesc] = useState("");

  useEffect(() => {
    getListData();
  }, []);

  // Fetch Data
  const getListData = async () => {
    try {
      let list = await fetch("http://localhost:3200/tasks", {
        method: "GET",
        credentials:"include",
      });
      list = await list.json();

      if (list.success) {
        const updated = list.result.map((t) => ({ ...t, checked: false }));
        setTaskData(updated);
        setSelectAll(false);
      } else {
        alert("Failed to fetch tasks");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while fetching tasks");
    }
  };

  // Select All Checkbox
  const handleSelectAll = () => {
    const updated = taskData.map((task) => ({ ...task, checked: !selectAll }));
    setTaskData(updated);
    setSelectAll(!selectAll);
  };

  // Individual Checkbox
  const handleSingleCheck = (id) => {
    const updated = taskData.map((task) =>
      task._id === id ? { ...task, checked: !task.checked } : task
    );
    setTaskData(updated);
    setSelectAll(updated.every((t) => t.checked));
  };

  // Delete Single Task
  const deleteTask = async (id) => {
    try {
      let response = await fetch(`http://localhost:3200/delete-task/${id}`, {
        method: "DELETE",
        credentials:"include",
      });
      response = await response.json();
      if (response.success) getListData();
      else alert("Delete Failed");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting task");
    }
  };

  // Bulk Delete
  const deleteSelected = async () => {
    const selectedIds = taskData.filter((t) => t.checked).map((t) => t._id);
    if (selectedIds.length === 0) return alert("No tasks selected!");

    try {
      let response = await fetch("http://localhost:3200/delete-multiple", {
        method: "POST",
        credentials:"include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      response = await response.json();
      if (response.success) {
        getListData();
        setSelectAll(false);
      } else {
        alert("Bulk delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while bulk deleting");
    }
  };

  // Open Update Form
  const openUpdate = (task) => {
    setEditTask(task);
    setUpdatedTitle(task.title);
    setUpdatedDesc(task.description);
  };

  // Update Task
  const updateTask = async () => {
    try {
      let response = await fetch(
        `http://localhost:3200/update-task/${editTask._id}`,
        {
          method: "PUT",
          credentials:"include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: updatedTitle,
            description: updatedDesc,
          }),
        }
      );
      response = await response.json();
      if (response.success) {
        setEditTask(null);
        getListData();
      } else alert("Update Failed");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating task");
    }
  };

  return (
    <div className="list-container">
      <h1 className="heading">Todo List</h1>

      {taskData.filter((t) => t.checked).length > 1 && (
        <button className="bulk-delete-btn" onClick={deleteSelected}>
          Delete Selected
        </button>
      )}

      <div className="list-row header">
        <div>
          <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
        </div>
        <div>S.No</div>
        <div>Title</div>
        <div>Description</div>
        <div>Action</div>
      </div>

      {taskData.map((item, index) => (
        <div className="list-row" key={item._id}>
          <div>
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => handleSingleCheck(item._id)}
            />
          </div>
          <div>{index + 1}</div>
          <div>{item.title}</div>
          <div>{item.description}</div>
          <div className="actions">
            <button className="edit-btn" onClick={() => openUpdate(item)}>
              Edit
            </button>
            <button className="delete-btn" onClick={() => deleteTask(item._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}

      {editTask && (
        <div className="popup">
          <div className="popup-box">
            <h2>Update Task</h2>
            <input
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              placeholder="Update Title"
            />
            <textarea
              value={updatedDesc}
              onChange={(e) => setUpdatedDesc(e.target.value)}
              placeholder="Update Description"
            ></textarea>
            <div className="popup-actions">
              <button onClick={updateTask} className="update-btn">
                Update
              </button>
              <button onClick={() => setEditTask(null)} className="close-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default List;
