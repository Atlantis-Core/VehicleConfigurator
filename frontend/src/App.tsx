// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from '@pages/startPage';
import ConfiguratorPage from '@pages/configuratorPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/configurator" element={<ConfiguratorPage />} />
        {
          /*
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/success" element={<SuccessPage />} />
          */
        }
      </Routes>
    </Router>
  );
}

export default App;