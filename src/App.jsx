// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NoteCreation from './components/NoteCreation';
import NoteEditor from './components/NoteEditor';


function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<NoteCreation />} />
            <Route path="/note/:id" element={<NoteEditor />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;