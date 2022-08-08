import './App.css';
import DataForm from './components/DataForm';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DataForm />} />
      </Routes>
    </div>
  );
}

export default App;
