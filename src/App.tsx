import React, { useState } from "react";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import GostergePaneli from "./components/GostergePaneli/GostergePaneli";
import { Button, Card, Typography } from "antd";
const { Title, Text } = Typography;

const App: React.FC = () => {
  const [kullaniciId, setKullaniciId] = useState<number | null>(null);

  const kullaniciGiris = (id: number) => {
    const mevcutVeri = localStorage.getItem(`kullanici_${id}`);
    
    if (!mevcutVeri) {
      const kullaniciVerisi = {
        seciliGostergeler: [],
        kaydedilmisLayoutlar: {},
      };
      localStorage.setItem(`kullanici_${id}`, JSON.stringify(kullaniciVerisi));
    }
    
    setKullaniciId(id);
  };

  if (kullaniciId === null) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Card
          style={{ width: 300, textAlign: "center" }}
          bordered={true}
        >
          <Title level={4}>Kullanıcı Girişi Yok</Title>
          <Text>Devam etmek için lütfen giriş yapın.</Text>
          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={() => kullaniciGiris(1)}>
              Giriş Yap
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <GostergePaneli
      kullaniciId={kullaniciId}
    />
  );
};

export default App;