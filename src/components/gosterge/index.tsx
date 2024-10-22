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

  const onLayoutChange = useCallback((currentLayout: Layout[], allLayouts: Layouts) => {
    setLayouts((prevLayouts) => {
      const updatedLayouts = { ...prevLayouts };
      Object.keys(allLayouts).forEach((breakpoint) => {
        updatedLayouts[breakpoint] = allLayouts[breakpoint].map((item) => ({
          ...item,
          minW: item.minW || 2,
          maxW: item.maxW || 6,
          minH: item.minH || 2,
          maxH: item.maxH || 6,
        }));
      });
      localStorage.setItem("savedLayouts", JSON.stringify(updatedLayouts));
      return updatedLayouts;
    });
  }, []);

  useEffect(() => {
    const savedLayouts = localStorage.getItem("savedLayouts");

    const defaultLayout: Layout[] = gostergeler.map((gosterge, index) => ({
      i: gosterge.gostergeId || `${index}`,
      x: gosterge.varsayilanLayout?.x ?? 0,
      y: gosterge.varsayilanLayout?.y ?? 0,
      w: Math.min(Math.max(gosterge.varsayilanLayout?.w ?? 3, gosterge.varsayilanLayout?.minW ?? 2), gosterge.varsayilanLayout?.maxW ?? 6),
      h: Math.min(Math.max(gosterge.varsayilanLayout?.h ?? 2, gosterge.varsayilanLayout?.minH ?? 2), gosterge.varsayilanLayout?.maxH ?? 6),
      minW: gosterge.varsayilanLayout?.minW ?? 2,
      maxW: gosterge.varsayilanLayout?.maxW ?? 6,
      minH: gosterge.varsayilanLayout?.minH ?? 2,
      maxH: gosterge.varsayilanLayout?.maxH ?? 6,
      static: gosterge.varsayilanLayout?.static ?? false,
    }));

    const initialLayouts: Layouts = savedLayouts
      ? JSON.parse(savedLayouts)
      : ['lg', 'md', 'sm', 'xs', 'xxs'].reduce((acc, size) => {
          acc[size] = defaultLayout;
          return acc;
        }, {} as Layouts);

    setLayouts(initialLayouts);

    const timer = setTimeout(() => setYukleniyor(false), 250);
    return () => clearTimeout(timer);
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
        resizeHandles={['se', 'ne']}
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