import { useState, useEffect, ReactElement, ReactNode } from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, Bar, Area,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import { AiOutlineLineChart } from 'react-icons/ai';
import { Alert, Select } from 'antd';
import { IGosterge, IGostergeDuzenleProps } from './IGosterge';

type GrafikTipi = 'line' | 'bar' | 'area' | 'composed' | 'yok';

interface GostergeDurum {
  isim: string;
  grafikTipi: GrafikTipi;
  degerler?: Record<string, string | number>[];
  grafikCizimTipi?: Record<string, GrafikTipi>;
}

const grafikSecenekleri = [
  { value: 'line', label: 'Çizgi Grafik' },
  { value: 'bar', label: 'Çubuk Grafik' },
  { value: 'area', label: 'Alan Grafik' }
] as const;

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

const GostergeDuzenle = <T extends GostergeDurum>({ durum, setDurum }: IGostergeDuzenleProps<T>): ReactNode => {
  if (durum.grafikTipi === 'yok' || !Array.isArray(durum.degerler)) return null;

  const dataKeys = Object.keys(durum.degerler[0] || {}).filter(key => key !== 'isim');
  const bilesikGrafikMi = durum.grafikTipi === 'composed' && durum.degerler.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {bilesikGrafikMi ? (
        dataKeys.map(key => (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} key={key}>
            <label style={{ fontSize: 16, fontWeight: 500 }}>{key} Grafik Tipi:</label>
            <Select
              value={durum.grafikCizimTipi?.[key] || 'line'}
              onChange={(value: GrafikTipi) => 
                setDurum(prev => ({
                  ...prev,
                  grafikCizimTipi: { ...prev.grafikCizimTipi, [key]: value }
                } as T))
              }
            >
              {grafikSecenekleri.map(option => (
                <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
              ))}
            </Select>
          </div>
        ))
      ) : (
        <>
          <label style={{ fontSize: 16, fontWeight: 500 }}>Grafik Tipi:</label>
          <Select
            value={durum.grafikTipi}
            onChange={(value: GrafikTipi) => setDurum(prev => ({ ...prev, grafikTipi: value } as T))}
          >
            {grafikSecenekleri.map(option => (
              <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>
            ))}
            {dataKeys.length > 1 && <Select.Option value="composed">Karma Grafik</Select.Option>}
          </Select>
        </>
      )}
    </div>
  );
};

export const useGosterge = <T extends GostergeDurum>() => {
  const [gostergeler, setGostergeler] = useState<IGosterge<T>[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/data.json');
        const jsonData = (await response.json()) as GostergeDurum[];

        const yeniGostergeler: IGosterge<T>[] = jsonData.map((gosterge, index) => ({
          gostergeId: `gosterge-${index + 1}`,
          isim: gosterge.isim,
          getNode: (durum: T) => <GostergeOlustur durum={{ ...durum, degerler: gosterge.degerler }} />,
          varsayilanDurum: {
            isim: gosterge.isim,
            grafikTipi: Array.isArray(gosterge.degerler) ? gosterge.grafikTipi : 'yok',
            degerler: gosterge.degerler,
            grafikCizimTipi: {},
          } as T,
          varsayilanBaslik: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <AiOutlineLineChart style={{ marginRight: 8 }} />
              {gosterge.isim}
            </div>
          ),
          varsayilanLayout: { w: 6, h: 4, x: 0, y: 0, i: `gosterge-${index + 1}` },
          getDuzenle: GostergeDuzenle
        }));

        setGostergeler(yeniGostergeler);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setYukleniyor(false);
      }
    })();
  }, []);

  return { gostergeler, yukleniyor };
};