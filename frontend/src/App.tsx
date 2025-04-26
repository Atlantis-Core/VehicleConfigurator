import logo from './logo.svg';
import { useEffect, useState } from 'react';
import { getModels, getRims } from './api/api';
import { Rim } from './types/types';
import { getImageUrl } from './lib/getImageUrl';

function App() {

  const [rims, setRims] = useState<Rim[]>([]);

  useEffect(() => {
    const fetchRims = async () => {
      const rims = await getRims();
      setRims(rims);
    };

    fetchRims();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h2>Vehicle Configurator</h2>
        {rims.map((rim) => (
          <img key={rim.id} src={getImageUrl(rim.imagePath)} alt={rim.name} />
        ))
        }
      </header>
    </div>
  );
}

export default App;
