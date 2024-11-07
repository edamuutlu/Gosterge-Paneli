import { useEffect, useState, useMemo } from "react";
import { Spin, Button, Modal, Card, Space, Empty, Typography } from "antd";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";
import { FaPlus } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import GostergeKonteyner from "./GostergeKonteyner";
import { IGosterge } from "./IGosterge";
import { gostergeGrafik, gostergeSayi, gostergeMetin } from "./useGostergeleriYukle";

const ResponsiveGridLayout = WidthProvider(Responsive);
const dragHandleSinifAdi = "gosterge-drag-handle";

const GostergePaneli = ({ kullaniciId }: { kullaniciId: number }) => {
  const [layouts, setLayouts] = useState<Layouts>();
  const [yukleniyor, setYukleniyor] = useState(true);
  const [modalGorunurluk, setModalGorunurluk] = useState(false);
  const [secilenGostergeler, setSecilenGostergeler] = useState<IGosterge<any>[]>([]);

  const varsayilanGostergeler = useMemo(() => {
    return [
      {
        title: "Ülke İsmi",
        gosterge: gostergeMetin,
      },
      {
        title: "Nüfus Sayısı",
        gosterge: gostergeSayi,
      },
      {
        title: "Nüfus Dağılımı Grafiği",
        gosterge: gostergeGrafik,
      },
    ];
  }, []);

  useEffect(() => {
    const kullaniciVerisiYukle = () => {
      const kullaniciVerisi = localStorage.getItem(`kullanici_${kullaniciId}`);
      if (kullaniciVerisi) {
        const { seciliGostergeler } = JSON.parse(kullaniciVerisi);
        if (seciliGostergeler && Array.isArray(seciliGostergeler)) {
          const yuklenecekGostergeler = varsayilanGostergeler
            .filter(({ gosterge }) =>
              seciliGostergeler.includes(gosterge.gostergeId)
            )
            .map(({ gosterge }) => gosterge);
          setSecilenGostergeler(yuklenecekGostergeler);
        }
      }
    };

    kullaniciVerisiYukle();
  }, [kullaniciId, varsayilanGostergeler]);

  const gostergeToggle = (gosterge: IGosterge<any>) => {
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
      seciliGostergeler: yeniGostergeler.map((g) => g.gostergeId),
    };

    if (gostergeVarMi && gosterge.gostergeId) {
      delete yeniVeri[`panel_1_gosterge_${gosterge.gostergeId}`];
    }

    localStorage.setItem(`kullanici_${kullaniciId}`, JSON.stringify(yeniVeri));
  };

  const onLayoutChange = (currentLayout: Layout[], tumLayoutlar: Layouts) => {
    if (!kullaniciId) return;

    setLayouts((oncekiLayout) => {
      const guncellenmisLayoutlar = { ...oncekiLayout };

      Object.keys(tumLayoutlar).forEach((breakpoint) => {
        guncellenmisLayoutlar[breakpoint] = tumLayoutlar[breakpoint].map(
          (item) => ({
            ...item,
            x: item.x || 0,
            y: item.y || 0,
            w: Math.min(Math.max(item.w || 3, item.minW || 2), item.maxW || 6),
            h: Math.min(Math.max(item.h || 2, item.minH || 3), item.maxH || 6),
            minW: item.minW || 2,
            maxW: item.maxW || 6,
            minH: item.minH || 3,
            maxH: item.maxH || 6,
            static: item.static || false,
          })
        );
      });

      const kullaniciVerisi = localStorage.getItem(`kullanici_${kullaniciId}`);
      const mevcutVeri = kullaniciVerisi ? JSON.parse(kullaniciVerisi) : {};

      const yeniVeri = {
        ...mevcutVeri,
        kaydedilmisLayoutlar: guncellenmisLayoutlar,
      };

      localStorage.setItem(`kullanici_${kullaniciId}`,JSON.stringify(yeniVeri));

      return guncellenmisLayoutlar;
    });
  };

  useEffect(() => {
    const layoutlarıYukle = () => {
      if (!kullaniciId) return;

      const varsayilanLayout: Layout[] = secilenGostergeler.map(
        (gosterge, index) => ({
          i: gosterge.gostergeId || `${index}`,
          x: gosterge.varsayilanLayout?.x ?? (index % 2) * 3,
          y: gosterge.varsayilanLayout?.y ?? Math.floor(index / 2) * 3,
          w: Math.min(
            Math.max(
              gosterge.varsayilanLayout?.w ?? 3,
              gosterge.varsayilanLayout?.minW ?? 2
            ),
            gosterge.varsayilanLayout?.maxW ?? 6
          ),
          h: Math.min(
            Math.max(
              gosterge.varsayilanLayout?.h ?? 2,
              gosterge.varsayilanLayout?.minH ?? 3
            ),
            gosterge.varsayilanLayout?.maxH ?? 6
          ),
          minW: gosterge.varsayilanLayout?.minW ?? 2,
          maxW: gosterge.varsayilanLayout?.maxW ?? 6,
          minH: gosterge.varsayilanLayout?.minH ?? 3,
          maxH: gosterge.varsayilanLayout?.maxH ?? 6,
          static: gosterge.varsayilanLayout?.static ?? false,
        })
      );

      const kullaniciVerisi = localStorage.getItem(`kullanici_${kullaniciId}`);
      let kaydedilmisLayoutlar = null;

      if (kullaniciVerisi) {
        try {
          const { kaydedilmisLayoutlar: savedLayouts } =
            JSON.parse(kullaniciVerisi);
          const mevcutIdler = new Set(
            secilenGostergeler.map((g) => g.gostergeId || "")
          );
          const tumGostergelerMevcut = Object.values(savedLayouts).every(
            (breakpointLayout: any) =>
              breakpointLayout.every((layout: Layout) =>
                mevcutIdler.has(layout.i)
              )
          );

          kaydedilmisLayoutlar = tumGostergelerMevcut ? savedLayouts : null;
        } catch (error) {
          console.error(
            "Kaydedilen layoutları ayrıştırırken hata oluştu:",
            error
          );
        }
      }

      const varsayilanLayoutlar =
        kaydedilmisLayoutlar || varsayilanLayoutOlustur(varsayilanLayout);
      setLayouts(varsayilanLayoutlar);
    };

    const varsayilanLayoutOlustur = (defaultLayout: Layout[]): Layouts => {
      return ["lg", "md", "sm", "xs", "xxs"].reduce((acc, size) => {
        acc[size] = defaultLayout;
        return acc;
      }, {} as Layouts);
    };

    layoutlarıYukle();
    const timer = setTimeout(() => setYukleniyor(false), 250);
    return () => clearTimeout(timer);
  }, [secilenGostergeler, kullaniciId]);

  if (yukleniyor || !layouts) {
    return <Spin size="large" className="spin-layout" />;
  }

  return (
      <>
        <>
        {secilenGostergeler.length === 0 ? (
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
                <FaPlus size={12} />
                Gösterge Ekle
              </Button>
            </Empty>
          </div>
        ):(
      <>
        <Button
          type="primary"
          onClick={() => setModalGorunurluk(true)}
          style={{ margin: "16px 16px 0px 10px" }}
        >
          <IoSettingsSharp size={12} />
          Gösterge Ayarlar
        </Button>

        <div className="grid-linechart">
          <ResponsiveGridLayout
            className="layout"
            onLayoutChange={onLayoutChange}
            layouts={layouts}
            draggableHandle={`.${dragHandleSinifAdi}`}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
            rowHeight={150}
            autoSize={true}
            resizeHandles={["se", "ne"]}
          >
            {secilenGostergeler.map((gosterge, indis) => (
              <div
                key={gosterge.gostergeId || `${indis}`}
                className={gosterge.gostergeId || `${indis}`}
              >
                <GostergeKonteyner
                  gosterge={gosterge}
                  dragHandleSinifAdi={dragHandleSinifAdi}
                  kullaniciId={kullaniciId}
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      </>
      )}
      </>

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
                  type={
                    secilenGostergeler.some(
                      (selected) => selected.gostergeId === gosterge.gostergeId
                    )
                      ? "dashed"
                      : "primary"
                  }
                  onClick={() => gostergeToggle(gosterge)}
                >
                  {secilenGostergeler.some(
                    (selected) => selected.gostergeId === gosterge.gostergeId
                  )
                    ? "Kaldır"
                    : "Ekle"}
                </Button>
              </div>
            </Card>
          ))}
        </Space>
      </Modal>

    </>
  );
};

export default GostergePaneli;
