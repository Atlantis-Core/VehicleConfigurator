import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from '@pages/startPage';
import ModelPicker from '@pages/modelPicker';
import Configurator from '@pages/configurator';
import ConfigurationSummary from '@pages/configurationSummary';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/configurator" element={<ModelPicker />} />
        <Route path="/configurator/:modelId" element={<Configurator />} />
        <Route path="/summary" element={<ConfigurationSummary />} />
      </Routes>
    </Router>
  );
}

export default App;