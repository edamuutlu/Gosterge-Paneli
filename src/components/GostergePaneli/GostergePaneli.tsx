import React, { useEffect, useState, useCallback } from "react";
import { Spin } from "antd";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";
import GostergeKonteyner from "./GostergeKonteyner";
import { IGosterge } from "./IGosterge";

const ResponsiveGridLayout = WidthProvider(Responsive);

const dragHandleSinifAdi = "gosterge-drag-handle";

interface Props {
  gostergeler: IGosterge<any>[];
}

const GostergePaneli: React.FC<Props> = ({ gostergeler }) => {
  const [layouts, setLayouts] = useState<Layouts>();
  const [yukleniyor, setYukleniyor] = useState(true);

  const onLayoutChange = useCallback(
    (currentLayout: Layout[], tumLayoutlar: Layouts) => {
      setLayouts((oncekiLayout) => {
        const guncellenmisLayoutlar = { ...oncekiLayout };

        Object.keys(tumLayoutlar).forEach((breakpoint) => {
          guncellenmisLayoutlar[breakpoint] = tumLayoutlar[breakpoint].map(
            (item) => ({
              ...item,
              x: item.x || 0,
              y: item.y || 0,
              w: Math.min(
                Math.max(item.w || 3, item.minW || 2),
                item.maxW || 6
              ),
              h: Math.min(
                Math.max(item.h || 2, item.minH || 3),
                item.maxH || 6
              ),
              minW: item.minW || 2,
              maxW: item.maxW || 6,
              minH: item.minH || 3,
              maxH: item.maxH || 6,
              static: item.static || false,
            })
          );
        });

        localStorage.setItem(
          "kaydedilmisLayoutlar",
          JSON.stringify(guncellenmisLayoutlar)
        );
        return guncellenmisLayoutlar;
      });
    },
    []
  );

  useEffect(() => {
    const kaydedilmisLayoutlar = localStorage.getItem("kaydedilmisLayoutlar");

    const varsayilanLayout: Layout[] = gostergeler.map((gosterge, index) => ({
      i: gosterge.gostergeId || `${index}`,
      x: gosterge.varsayilanLayout?.x ?? 0,
      y: gosterge.varsayilanLayout?.y ?? 0,
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

    const baslangicLayout: Layouts = kaydedilmisLayoutlar
      ? JSON.parse(kaydedilmisLayoutlar)
      : ["lg", "md", "sm", "xs", "xxs"].reduce((acc, size) => {
          acc[size] = varsayilanLayout;
          return acc;
        }, {} as Layouts);

    setLayouts(baslangicLayout);

    const zamanlayici = setTimeout(() => setYukleniyor(false), 250);
    return () => clearTimeout(zamanlayici);
  }, [gostergeler]);

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
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default GostergePaneli;
