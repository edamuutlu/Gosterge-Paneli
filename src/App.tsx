import React, { useMemo, useState } from "react";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import GostergePaneli from "./components/GostergePaneli/GostergePaneli";
import { gostergeNufusSayisiGrafik, gostergeNufusSayisiNumber, gostergeNufusSayisiString } from "./components/GostergePaneli/useGostergeleriYukle";
import { IGosterge } from "./components/GostergePaneli/IGosterge";
import { Button, Modal, Card, Space, Empty, Typography, Alert, Spin } from "antd";
import { FaPlus } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { useKullaniciVerisiYukleyici } from "./components/GostergePaneli/useKullaniciVerisiYukle";
const { Title, Text } = Typography;

const App: React.FC = () => {
  const [kullaniciId, setKullaniciId] = useState<number | null>(null);
  const [modalGorunurluk, setModalGorunurluk] = useState(false);

  const varsayilanGostergeler = useMemo(() => {
    return [
      {
        title: "Ülke İsmi (String)",
        gosterge: gostergeNufusSayisiString,
      },
      {
        title: "Nüfus Sayısı (Number)",
        gosterge: gostergeNufusSayisiNumber,
      },
      {
        title: "Nüfus Dağılımı (Grafik)",
        gosterge: gostergeNufusSayisiGrafik,
      },
    ];
  }, []);

  const { 
    secilenGostergeler, 
    setSecilenGostergeler, 
    yukleniyor, 
    hata 
  } = useKullaniciVerisiYukleyici(kullaniciId, varsayilanGostergeler);

  if (yukleniyor) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Veriler yükleniyor..." />
      </div>
    );
  }

  if (hata) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert
          message="Hata"
          description={hata.message}
          type="error"
          showIcon
        />
      </div>
    );
  }

  const gostergeToggle = (gosterge: IGosterge<any>) => {
    if (kullaniciId === null) return;

    const gostergeVarMi = secilenGostergeler.some((g) => g.gostergeId === gosterge.gostergeId);
    let yeniGostergeler: IGosterge<any>[];

    if (gostergeVarMi) {
      yeniGostergeler = secilenGostergeler.filter((g) => g.gostergeId !== gosterge.gostergeId);
    } else {
      yeniGostergeler = [...secilenGostergeler, gosterge];
    }

    setSecilenGostergeler(yeniGostergeler);

    const kullaniciVerisi = localStorage.getItem(`kullanici_${kullaniciId}`);
    const mevcutVeri = kullaniciVerisi ? JSON.parse(kullaniciVerisi) : {};
    
    const yeniVeri = {
      ...mevcutVeri,
      seciliGostergeler: yeniGostergeler.map(g => g.gostergeId)
    };

    // Eğer gösterge kaldırılıyorsa, ilgili panel verilerini de temizle
    if (gostergeVarMi && gosterge.gostergeId) {
      delete yeniVeri[`panel_1_gosterge_${gosterge.gostergeId}`];
    }

    localStorage.setItem(`kullanici_${kullaniciId}`, JSON.stringify(yeniVeri));
  };

  const gostergeSecildiMi = (gosterge: IGosterge<any>) => {
    return secilenGostergeler.some((selected) => selected.gostergeId === gosterge.gostergeId);
  };

  const KullaniciGiris = (id: number) => {
    const storageKey = `kullanici_${id}`;
    const mevcutVeri = localStorage.getItem(storageKey);
    
    if (!mevcutVeri) {
      const kullaniciVerisi = {
        seciliGostergeler: [],
        kaydedilmisLayoutlar: {},
      };
      localStorage.setItem(storageKey, JSON.stringify(kullaniciVerisi));
    }
    
    setKullaniciId(id);
  };

  return (
    <div>
      {kullaniciId !== null ? (
        secilenGostergeler.length > 0 ? (
          <>
            <Button
              type="primary"
              onClick={() => setModalGorunurluk(true)}
              style={{ margin: "16px 16px 0px 10px" }}
            >
              <IoSettingsSharp size={12}/>
              Gösterge Ayarlar
            </Button>
            <GostergePaneli 
              gostergeler={secilenGostergeler}
              kullaniciId={kullaniciId}
            />
          </>
        ) : (
          <div style={{ margin: "200px auto" }}>
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 100 }}
              description={
                <Typography.Text>Gösterge bulunmamaktadır.</Typography.Text>
              }
            >
              <Button
                type="primary"
                onClick={() => setModalGorunurluk(true)}
                style={{ margin: "16px 16px 0px 10px" }}
              >
                <FaPlus size={12}/>
                Gösterge Ekle
              </Button>
            </Empty>
          </div>
        )
      ) : (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Card
            style={{ width: 300, textAlign: "center" }}
            bordered={true}
          >
            <Title level={4}>Kullanıcı Girişi Yok</Title>
            <Text>Devam etmek için lütfen giriş yapın.</Text>
            <div style={{ marginTop: 16 }}>
              <Button type="primary" onClick={() => KullaniciGiris(1)}>
                Giriş Yap
              </Button>
            </div>
          </Card>
        </div>
      )}
      <Modal
        title="Gösterge Seçimi"
        footer={null}
        open={modalGorunurluk}
        onCancel={() => setModalGorunurluk(false)}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          {varsayilanGostergeler.map(({ title, gosterge }) => (
            <Card key={title} style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{title}</span>
                <Button
                  type={gostergeSecildiMi(gosterge) ? "dashed" : "primary"}
                  onClick={() => gostergeToggle(gosterge)}
                >
                  {gostergeSecildiMi(gosterge) ? "Kaldır" : "Ekle"}
                </Button>
              </div>
            </Card>
          ))}
        </Space>
      </Modal>
    </div>
  );
};

export default App;