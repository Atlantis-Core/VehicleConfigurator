import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from '@pages/startPage';
import ModelPicker from '@pages/modelPicker';
import Configurator from '@pages/configurator';
import SummaryPage from '@pages/summaryPage';
import SavedConfigurations from '@pages/savedConfigurations';
import Orders from '@pages/orders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/configurator" element={<ModelPicker />} />
        <Route path="/configurator/:modelId" element={<Configurator />} />
        <Route path="/summary" element={<SummaryPage />} />
        <Route path="/saved-configurations" element={<SavedConfigurations />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Router>
  );
}

export default App;