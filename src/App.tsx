import GostergePaneli from './components/gosterge/';
import { gostergeData } from './utils/gostergeData';
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

const App = () => {
  return <GostergePaneli gostergeler={gostergeData} />;
};

export default App; 
