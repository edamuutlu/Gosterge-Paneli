import React, { useMemo, useState, useEffect } from "react";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import GostergePaneli from "./components/GostergePaneli/GostergePaneli";
import { gostergeNufusSayisiGrafik, gostergeNufusSayisiNumber, gostergeNufusSayisiString } from "./components/GostergePaneli/useGostergeleriYukle";
import { IGosterge } from "./components/GostergePaneli/IGosterge";
import { Button, Modal, Card, Space, Empty, Typography } from "antd";
import { FaPlus } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";

const SECILI_GOSTERGE_ANAHTARLARI = 'seciliGostergeler';
const PANEL_PREFIX = 'panel_1_gosterge_';

const App: React.FC = () => {
  const [modalGorunurluk, setModalGorunurluk] = useState(false);
  const [secilenGostergeler, setSecilenGostergeler] = useState<IGosterge<any>[]>([]);

  useEffect(() => {
    const kayitliGostergeler = localStorage.getItem(SECILI_GOSTERGE_ANAHTARLARI);
    if (kayitliGostergeler) {
      try {
        const gostergeIdleri = JSON.parse(kayitliGostergeler);
        const yuklenenGostergeler = varsayilanGostergeler
          .map(item => item.gosterge)
          .filter(gosterge => gostergeIdleri.includes(gosterge.gostergeId));
        setSecilenGostergeler(yuklenenGostergeler);
      } catch (error) {
        console.error('Gösterge yüklenirken bir hata oluştu:', error);
      }
    }
  }, []);

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

  const gostergeToggle = (gosterge: IGosterge<any>) => {
    setSecilenGostergeler((prev) => {
      const gostergeVarMi = prev.some((g) => g === gosterge);
      const yeniGostergeler = gostergeVarMi
        ? prev.filter((g) => g !== gosterge)
        : [...prev, gosterge];

      const gostergeIdleri = yeniGostergeler.map(g => g.gostergeId).filter(Boolean);
      localStorage.setItem(SECILI_GOSTERGE_ANAHTARLARI, JSON.stringify(gostergeIdleri));

      if (gostergeVarMi && gosterge.gostergeId) {
        localStorage.removeItem(`${PANEL_PREFIX}${gosterge.gostergeId}`);
      }

      return yeniGostergeler;
    });
  };

  const gostergeSecildiMi = (gosterge: IGosterge<any>) => {
    return secilenGostergeler.some((selected) => selected === gosterge);
  };

  return (
    <div>
      {secilenGostergeler.length > 0 ? (
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