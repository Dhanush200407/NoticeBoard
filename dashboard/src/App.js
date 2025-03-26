import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import NoticeBoard from './components/NoticeBoard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/notice-board" element={<NoticeBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
