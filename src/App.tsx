import React, { useMemo, useState } from "react";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import GostergePaneli from "./components/GostergePaneli/GostergePaneli";
import { gostergeNufusSayisiGrafik, gostergeNufusSayisiNumber, gostergeNufusSayisiString } from "./components/GostergePaneli/useGostergeleriYukle";
import { IGosterge } from "./components/GostergePaneli/IGosterge";
import { Button, Modal, Card, Space, Empty, Typography, ConfigProvider } from "antd";
import { FaPlus } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";

const App: React.FC = () => {
  const [modalGorunurluk, setModalGorunurluk] = useState(false);
  const [secilenGostergeler, setSecilenGostergeler] = useState<IGosterge<any>[]>([]);

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

  const modalGoster = () => {
    setModalGorunurluk(true);
  };

  const modalKapat = () => {
    setModalGorunurluk(false);
  };

  const gostergeToggle = (gosterge: IGosterge<any>) => {
    setSecilenGostergeler((prev) => {
      const gostergeVarMi = prev.some((g) => g === gosterge);
      if (gostergeVarMi) {
        return prev.filter((g) => g !== gosterge);
      } else {
        return [...prev, gosterge];
      }
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
            onClick={modalGoster}
            style={{ margin: "16px 16px 0px 10px" }}
          >
            <IoSettingsSharp size={12}/>
            Gösterge Ayarlar
          </Button>
          <GostergePaneli gostergeler={secilenGostergeler} />
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
              onClick={modalGoster}
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
        onCancel={modalKapat}
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
                <ConfigProvider>
                <Button
                  color={gostergeSecildiMi(gosterge) ? "danger" : "primary"}
                  onClick={() => gostergeToggle(gosterge)}
                >
                  {gostergeSecildiMi(gosterge) ? "Kaldır" : "Ekle"}
                </Button>
                </ConfigProvider>
              </div>
            </Card>
          ))}
        </Space>
      </Modal>
    </div>
  );
};

export default App;