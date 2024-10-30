import React, { useMemo } from "react";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import GostergePaneli from "./components/GostergePaneli/GostergePaneli";
import { gostergeNufusSayisiGrafik, gostergeNufusSayisiNumber, gostergeNufusSayisiString } from "./components/GostergePaneli/useGostergeleriYukle";
import { IGosterge } from "./components/GostergePaneli/IGosterge";

const App: React.FC = () => {
  const gostergeler = useMemo<IGosterge<any>[]>(() => {
    return [
      gostergeNufusSayisiString,
      gostergeNufusSayisiNumber,
      gostergeNufusSayisiGrafik,
    ];
  }, []);

  return <GostergePaneli gostergeler={gostergeler} />;
};

export default App;
