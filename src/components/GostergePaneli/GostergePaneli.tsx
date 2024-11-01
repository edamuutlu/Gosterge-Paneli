import React, { useEffect, useState, useCallback } from "react";
import { Spin } from "antd";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";
import GostergeKonteyner from "./GostergeKonteyner";
import { IGosterge } from "./IGosterge";

const ResponsiveGridLayout = WidthProvider(Responsive);
const dragHandleSinifAdi = "gosterge-drag-handle";

interface Props {
  gostergeler: IGosterge<any>[];
  kullaniciId: number;
}

const GostergePaneli: React.FC<Props> = ({ gostergeler, kullaniciId }) => {
  const [layouts, setLayouts] = useState<Layouts>();
  const [yukleniyor, setYukleniyor] = useState(true);

  const onLayoutChange = useCallback(
    (currentLayout: Layout[], tumLayoutlar: Layouts) => {
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
          kaydedilmisLayoutlar: guncellenmisLayoutlar
        };

        localStorage.setItem(`kullanici_${kullaniciId}`, JSON.stringify(yeniVeri));

        return guncellenmisLayoutlar;
      });
    },
    [kullaniciId]
  );

  useEffect(() => {
    const layoutlarıYukle = () => {
      if (!kullaniciId) return;

      const varsayilanLayout: Layout[] = gostergeler.map((gosterge, index) => ({
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
      }));

      const kullaniciVerisi = localStorage.getItem(`kullanici_${kullaniciId}`);
      let kaydedilmisLayoutlar = null;
      
      if (kullaniciVerisi) {
        try {
          const { kaydedilmisLayoutlar: savedLayouts } = JSON.parse(kullaniciVerisi);
          const mevcutIdler = new Set(gostergeler.map(g => g.gostergeId || ''));
          const tumGostergelerMevcut = Object.values(savedLayouts).every(
            (breakpointLayout: any) =>
              breakpointLayout.every((layout: Layout) => mevcutIdler.has(layout.i))
          );

          kaydedilmisLayoutlar = tumGostergelerMevcut ? savedLayouts : null;
        } catch (error) {
          console.error('Kaydedilen layoutları ayrıştırırken hata oluştu:', error);
        }
      }

      const varsayilanLayoutlar = kaydedilmisLayoutlar || varsayilanLayoutOlustur(varsayilanLayout);
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
  }, [gostergeler, kullaniciId]);

  if (yukleniyor || !layouts) {
    return <Spin size="large" className="spin-layout" />;
  }

  return (
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
        {gostergeler.map((gosterge, indis) => (
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
  );
};

export default GostergePaneli;