import { Spin } from "antd";
import { useEffect, useState, useCallback } from "react";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";
import GostergeKonteyner from "./GostergeKonteyner";
import { IGosterge } from "./IGosterge";

const ResponsiveGridLayout = WidthProvider(Responsive);

const dragHandleSinifAdi = "gosterge-drag-handle";

interface Props {
  gostergeler: IGosterge<any>[];
}

const useGostergeYukseklikleri = (
  gostergeler: IGosterge<any>[],
  layouts?: Layouts
) => {
  const [yukseklikler, setYukseklikler] = useState<(number | null)[]>([]);

  const yukseklikHesapla = useCallback(() => {
    const yeniYukseklikler = gostergeler.map((gosterge) => {
      const element = document.querySelector(
        `.${gosterge.gostergeId}`
      ) as HTMLElement;
      return element ? parseFloat(getComputedStyle(element).height) : null;
    });
    setYukseklikler(yeniYukseklikler);
  }, [gostergeler]);

  useEffect(() => {
    const observer = new ResizeObserver(yukseklikHesapla);
    const elements = gostergeler
      .map((g) => document.querySelector(`.${g.gostergeId}`))
      .filter(Boolean);

    const delayRender = setTimeout(() => {
      elements.forEach((el) => observer.observe(el as Element));
      yukseklikHesapla();
    }, 500); 

    if (layouts) yukseklikHesapla();

    return () => {
      clearTimeout(delayRender);
      observer.disconnect();
    };
  }, [gostergeler, yukseklikHesapla, layouts]);

  return yukseklikler;
};

const GostergePaneli = ({ gostergeler }: Props) => {
  const [layouts, setLayouts] = useState<Layouts>();
  const [yukleniyor, setYukleniyor] = useState(true);

  const onLayoutChange = useCallback((_: Layout[], newLayouts: Layouts) => {
    setLayouts(newLayouts);
    localStorage.setItem("savedLayouts", JSON.stringify(newLayouts));
  }, []);

  useEffect(() => {
    const savedLayouts = localStorage.getItem("savedLayouts");
    const initialLayouts = savedLayouts
      ? JSON.parse(savedLayouts)
      : {
          lg: gostergeler.map((gosterge, index) => ({
            i: gosterge.gostergeId || `gosterge${index}`,
            x: gosterge.varsayilanLayout?.x ?? 0,
            y: gosterge.varsayilanLayout?.y ?? 0,
            w: gosterge.varsayilanLayout?.w ?? 3,
            h: gosterge.varsayilanLayout?.h ?? 2,
            minW: gosterge.varsayilanLayout?.minW ?? 2,
            maxW: gosterge.varsayilanLayout?.maxW ?? 4,
            minH: gosterge.varsayilanLayout?.minH ?? 2,
            maxH: gosterge.varsayilanLayout?.maxH ?? 4,
            static: gosterge.varsayilanLayout?.static ?? false,
          })),
          md: [],
          sm: [],
          xs: [],
          xxs: [],
        };

    setLayouts(initialLayouts);

    const timer = setTimeout(() => setYukleniyor(false), 100);
    return () => clearTimeout(timer);
  }, [gostergeler]);

  const yukseklikler = useGostergeYukseklikleri(gostergeler, layouts);

  if (yukleniyor || !layouts) {
    return <Spin size="large" className="spin-layout" />;
  }

  return (
    <div className="grid-linechart">
      <ResponsiveGridLayout
        className="layout"
        compactType="vertical"
        onLayoutChange={onLayoutChange}
        layouts={layouts}
        draggableHandle={`.${dragHandleSinifAdi}`}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
        rowHeight={150}
      >
        {gostergeler.map((x, indis) => (
          <div
            key={x.gostergeId || `gosterge${indis}`}
            className={x.gostergeId || `gosterge${indis}`}
          >
            <GostergeKonteyner
              gosterge={x}
              dragHandleSinifAdi={dragHandleSinifAdi}
              yukseklik={yukseklikler[indis] ?? undefined}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default GostergePaneli;
