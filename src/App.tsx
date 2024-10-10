import GostergePaneli from './components/gosterge/';
import { gosterge } from './utils/gosterge';
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

const App = () => {
  return <GostergePaneli gostergeler={gosterge} />;
};

export default App; 
