import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from '@pages/startPage';
import ModelPicker from '@pages/modelPicker';
import Configurator from '@pages/configurator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/configurator" element={<ModelPicker />} />
        <Route path="/configurator/:modelId" element={<Configurator />} />
      </Routes>
    </Router>
  );
}

export default App;