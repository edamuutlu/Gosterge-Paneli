import React from "react";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { GostergeleriYukle } from "./components/GostergePaneli/GostergeleriYukle";
import GostergePaneli from "./components/GostergePaneli/GostergePaneli";

const App: React.FC = () => {
  const { gostergeler } = GostergeleriYukle();

  return <GostergePaneli gostergeler={gostergeler} />;
};

export default App;
