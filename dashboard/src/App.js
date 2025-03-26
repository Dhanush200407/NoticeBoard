import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import NoticeBoard from './components/NoticeBoard';
import AdminPage from './components/AdminPage'; // Import the AdminPage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/notice-board" element={<NoticeBoard />} />
        <Route path="/admin" element={<AdminPage />} /> {/* Add the admin route */}
      </Routes>
    </Router>
  );
}

export default App;