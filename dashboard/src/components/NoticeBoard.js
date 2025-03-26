import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NoticeBoard.css';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const userId = localStorage.getItem('userId'); // Retrieve the logged-in user's ID
  const userName = localStorage.getItem('userName'); // Retrieve the logged-in user's name
  const navigate = useNavigate();

  // Fetch tasks for the logged-in user
  useEffect(() => {
    fetch(`http://localhost:5000/tasks?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, [userId]);

  const handleAddTask = (e) => {
    e.preventDefault();
    const newTask = {
      heading: e.target['title-input'].value,
      work: e.target['author-input'].value,
      description: e.target['des-input'].value,
      userId, // Include the logged-in user's ID
    };

    fetch('http://localhost:5000/add-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Task added successfully!') {
          setTasks([...tasks, { ...newTask, id: Date.now() }]);
          setShowModal(false);
        }
      })
      .catch((error) => console.error('Error adding task:', error));
  };

  const handleDeleteTask = (id) => {
    fetch(`http://localhost:5000/delete-task/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Task deleted successfully!') {
          setTasks(tasks.filter((task) => task.id !== id));
        }
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Remove the user ID from localStorage
    localStorage.removeItem('userName'); // Remove the user name from localStorage
    navigate('/'); // Redirect to the login page
  };

  return (
    <div className='col'>
      <div className="navbar">
        <h1>Notice Board</h1>
        <button onClick={handleLogout} className="nav-linkh logout-button">Logout</button>
      </div>

      {/* Personalized Greeting */}
      <div className="greeting">
        <h2>Hello, {userName}!</h2>
      </div>

      <div className="container">
  {tasks.map((task) => (
    <div className="task-container" key={task.id}>
      <h2 className="task-h">{task.heading}</h2>
      <p>{task.work}</p>
      <p>{task.description}</p>
      <button onClick={() => handleDeleteTask(task.id)} className="task-container-button">Delete</button>
    </div>
  ))}
</div>
      {showModal && (
        <>
          <div className="overlay" onClick={() => setShowModal(false)}></div>
          <div className="pop">
            <h2>Add Task</h2>
            <form onSubmit={handleAddTask}>
              <input type="text" placeholder="Heading" id="title-input" required />
              <input type="text" placeholder="Work" id="author-input" required />
              <textarea placeholder="Short description" id="des-input" required></textarea>
              <button type="submit">Add</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </>
      )}
      <button className="add-button" onClick={() => setShowModal(true)}>+</button>
    </div>
  );
}

export default App;