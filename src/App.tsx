import React from "react";
import GostergePaneli from "./components/gosterge/";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { Spin } from "antd";
import { useGosterge } from "./components/gosterge/useGosterge";

const App: React.FC = () => {
  const { gostergeler, yukleniyor } = useGosterge();

  return (
    <Spin spinning={yukleniyor} size="large">
      <GostergePaneli gostergeler={gostergeler} />
    </Spin>
  );
};

export default App;