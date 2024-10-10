import { Spin } from "antd";
import { useEffect, useState, useRef, useCallback } from "react";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";
import GostergeKonteyner from "./GostergeKonteyner";
import { IGosterge } from "./IGosterge";

const ResponsiveGridLayout = WidthProvider(Responsive);

const dragHandleSinifAdi = "gosterge-drag-handle";

interface Props {
  gostergeler: IGosterge<any>[];
}

const useGostergeYukseklikleri = (gostergeler: IGosterge<any>[], layouts: Layouts | undefined) => {
  const [yukseklikler, setYukseklikler] = useState<(number | null)[]>([]);
  const observerRef = useRef<ResizeObserver | null>(null);

  const calculateHeights = useCallback(() => {
    const newYukseklikler = gostergeler.map(gosterge => {
      const element = document.getElementsByClassName(gosterge.gostergeId || '')[0] as HTMLElement;
      return element ? parseFloat(getComputedStyle(element).height) : null;
    });
    setYukseklikler(newYukseklikler);
  }, [gostergeler]);

  useEffect(() => {
    const timeoutId = setTimeout(calculateHeights, 500);

    observerRef.current = new ResizeObserver(calculateHeights);

    gostergeler.forEach(gosterge => {
      const element = document.getElementsByClassName(gosterge.gostergeId || '')[0];
      if (element) observerRef.current?.observe(element);
    });

    return () => {
      clearTimeout(timeoutId);
      observerRef.current?.disconnect();
    };
  }, [gostergeler, calculateHeights]);

  useEffect(() => {
    if (layouts) {
      calculateHeights();
    }
  }, [layouts, calculateHeights]);

  return yukseklikler;
};

const GostergePaneli = ({ gostergeler }: Props) => {
  const [layouts, setLayouts] = useState<Layouts>();

  const onLayoutChange = useCallback((_: Layout[], layouts: Layouts) => {
    setLayouts(layouts);
    localStorage.setItem("savedLayouts", JSON.stringify(layouts));
  }, []);

  useEffect(() => {
    const savedLayouts = localStorage.getItem("savedLayouts");
    if (savedLayouts) {
      setLayouts(JSON.parse(savedLayouts));
    } else {
      const defaultLayouts: Layouts = {
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
      setLayouts(defaultLayouts);
    }
  }, [gostergeler]);

  const yukseklikler = useGostergeYukseklikleri(gostergeler, layouts);

  if (layouts === undefined) return <Spin size="large" className="spin" />;

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