import { ReactElement } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Bar, Area,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import { Alert } from 'antd';

export type GrafikTipi = 'line' | 'bar' | 'area' | 'composed' | 'yok';

export interface GostergeDurum {
  isim: string;
  grafikTipi: GrafikTipi;
  degerler?: Record<string, string | number>[];
  grafikCizimTipi?: Record<string, GrafikTipi>;
}

const grafikKomponentleri = {
  line: (key: string) => <Line key={key} dataKey={key} type="monotone" stroke="#8884d8" />,
  bar: (key: string) => <Bar key={key} dataKey={key} fill="#82ca9d" />,
  area: (key: string) => <Area key={key} dataKey={key} type="monotone" fill="#ffc658" stroke="#8884d8" />
};

export const GostergeOlustur = <T extends GostergeDurum>({ durum }: { durum: T }): ReactElement => {
  if (!durum.degerler?.length) {
    return (
      <Alert
        message="Veri Yok"
        description={`${durum.isim} için gösterilecek veri bulunamadı.`}
        type="warning"
        showIcon
      />
    );
  }

  if (durum.grafikTipi === 'yok') {
    return <div>{durum.isim}: {JSON.stringify(durum.degerler)}</div>;
  }

  const dataKeys = Object.keys(durum.degerler[0]).filter(key => key !== 'isim');
  const children = durum.grafikTipi === 'composed'
    ? dataKeys.map(key => {
        const type = (durum.grafikCizimTipi?.[key] || 'line') as keyof typeof grafikKomponentleri;
        return grafikKomponentleri[type](key);
      })
    : dataKeys[0] ? [grafikKomponentleri[durum.grafikTipi as keyof typeof grafikKomponentleri](dataKeys[0])] : [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={durum.degerler}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="isim" />
        <YAxis />
        <Tooltip />
        <Legend />
        {children}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

