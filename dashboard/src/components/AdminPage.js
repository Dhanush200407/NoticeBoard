import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPage.css';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    fetch('http://localhost:5000/users') // Replace with your backend endpoint
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleDeleteUser = (id) => {
    fetch(`http://localhost:5000/delete-user/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'User deleted successfully!') {
          setUsers(users.filter((user) => user.id !== id));
        }
      })
      .catch((error) => console.error('Error deleting user:', error));
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Page</h1>
        <button onClick={handleLogout} className="nav-linkh logout-button">Logout</button>
      </header>

      <div className="user-list">
        <h2>Registered Users</h2>
        {users.map((user) => (
          <div className="user-item" key={user.id}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button onClick={() => handleDeleteUser(user.id)} className="delete-button">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPage;