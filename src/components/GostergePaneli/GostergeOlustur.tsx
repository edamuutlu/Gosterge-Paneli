import { ReactElement } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Alert } from "antd";

export type GrafikTipi = "line" | "bar" | "area" | "composed" | "yok";

export interface GostergeDurum {
  isim?: string;
  grafikTipi?: GrafikTipi;
  grafikCizimTipi?: Record<string, GrafikTipi>;
}

const grafikKomponentleri = {
  line: (key: string) => (
    <Line key={key} dataKey={key} type="monotone" stroke="#8884d8" />
  ),
  bar: (key: string) => <Bar key={key} dataKey={key} fill="#82ca9d" />,
  area: (key: string) => (
    <Area
      key={key}
      dataKey={key}
      type="monotone"
      fill="#ffc658"
      stroke="#8884d8"
    />
  ),
};

export const GostergeOlustur = <T extends GostergeDurum, TData>({
  durum,
  data,
}: {
  durum: T;
  data: TData;
}): ReactElement => {
  if (!durum.isim) {
    durum.isim = "Gosterge";
  }
  if (!data) {
    return (
      <Alert
        message="Veri Yok"
        description={`${durum.isim} için gösterilecek veri bulunamadı.`}
        type="warning"
        showIcon
      />
    );
  }

  if (!durum.grafikTipi) {
    durum.grafikTipi = "yok";
  }

  if (durum.grafikTipi === "yok") {
    return (
      <div>
        {durum.isim}: {JSON.stringify(data)}
      </div>
    );
  }
  const dataKeys =
    data && Array.isArray(data) && data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== "ulke")
      : [];

  const children =
    durum.grafikTipi === "composed"
      ? dataKeys.map((key) => {
          const grafikTipi = durum.grafikCizimTipi?.[key] || durum.grafikTipi;
          const grafikComponent =
            grafikKomponentleri[grafikTipi as keyof typeof grafikKomponentleri];
          return grafikComponent ? grafikComponent(key) : null;
        })
      : dataKeys.map((key) => {
          const grafikComponent =
            grafikKomponentleri[
              durum.grafikTipi as keyof typeof grafikKomponentleri
            ];
          return grafikComponent ? grafikComponent(key) : null;
        });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data as any}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="ulke" />
        <YAxis />
        <Tooltip />
        <Legend />
        {children}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
