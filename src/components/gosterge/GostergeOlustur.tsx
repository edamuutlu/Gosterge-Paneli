import React, { useState, useEffect, ReactElement } from 'react';
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
} from 'recharts';
import { AiOutlineLineChart, AiOutlineBarChart, AiOutlineAreaChart } from 'react-icons/ai';
import { MdAreaChart } from 'react-icons/md';
import { Select } from 'antd';
import { IGosterge } from './IGosterge';

type GrafikTipi = 'line' | 'bar' | 'area' | 'composed' | 'yok';

export interface IGostergeDuzenleProps<TDurum extends BaseGostergeDurum> {
  durum: TDurum;
  setDurum: React.Dispatch<React.SetStateAction<TDurum>>;
}

interface BaseGostergeDurum {
  isim: string;
  grafikTipi: GrafikTipi;
  degerler?: { [key: string]: string | number }[];
}

export const GostergeOlustur = <TDurum extends BaseGostergeDurum>({
  durum,
}: {
  durum: TDurum;
}): ReactElement => {
  if (durum.grafikTipi === 'yok' || !durum.degerler) {
    return (
      <div>
        {durum.isim}: {durum.degerler?.toString() ?? 'Veri yok'}
      </div>
    );
  }

  const getChildren = () => {
    if (!Array.isArray(durum.degerler) || durum.degerler.length === 0) {
      return [];
    }

    switch (durum.grafikTipi) {
      case 'line':
        return [<Line key="line" dataKey={durum.isim} type="monotone" stroke="#8884d8" />];
      case 'bar':
        return [<Bar key="bar" dataKey={durum.isim} fill="#82ca9d" />];
      case 'area':
        return [<Area key="area" dataKey={durum.isim} type="monotone" fill="#ffc658" stroke="#8884d8" />];
      case 'composed':
        const keys = Object.keys(durum.degerler[0]).filter(key => key !== 'isim');
        return [
          <Bar key="bar" dataKey={keys[0]} fill="#8884d8" />,
          <Line key="line" dataKey={keys[1]} type="monotone" stroke="#82ca9d" strokeWidth={3} />,
          <Area key="area" dataKey={keys[2]} type="monotone" fill="#ffc658" stroke="#8884d8" />
        ];
      default:
        return [];
    }
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={400}
        data={durum.degerler}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="isim" />
        <YAxis />
        <Tooltip />
        <Legend />
        {getChildren()}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export const useGosterge = <TDurum extends BaseGostergeDurum>() => {
  const [gostergeler, setGostergeler] = useState<IGosterge<TDurum>[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setYukleniyor(true);
        setHata(null);

        const response = await fetch('/data.json');
        const jsonData = await response.json();

        const gostergeler: IGosterge<TDurum>[] = jsonData.map((gosterge: any, index: number) => ({
          gostergeId: `gosterge-${index + 1}`,
          isim: gosterge.isim,
          getNode: (durum: TDurum) => (
            <GostergeOlustur
              durum={{
                ...durum,
                degerler: gosterge.degerler
              }}
            />
          ),
          varsayilanDurum: {
            isim: gosterge.isim,
            grafikTipi: gosterge.grafikTipi,
            degerler: gosterge.degerler,
          } as TDurum,
          varsayilanBaslik: (
            <div style={{ display: "flex", alignItems: "center" }}>
              {gosterge.grafikTipi === 'bar' ? (
                <AiOutlineBarChart style={{ marginRight: 8 }} />
              ) : gosterge.grafikTipi === 'area' ? (
                <AiOutlineAreaChart style={{ marginRight: 8 }} />
              ) : gosterge.grafikTipi === 'composed' ? (
                <MdAreaChart style={{ marginRight: 8 }} />
              ) : (
                <AiOutlineLineChart style={{ marginRight: 8 }} />
              )}
              {gosterge.isim}
            </div>
          ),
          varsayilanLayout: { w: 6, h: 4, x: 0, y: 0, i: `gosterge-${index + 1}` },
          getDuzenle: ({ durum, setDurum }: IGostergeDuzenleProps<BaseGostergeDurum>) => (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{fontSize: 16, fontWeight: 500}}>Grafik Tipi:</label>
              <Select
                value={durum.grafikTipi}
                onChange={(value: GrafikTipi) => setDurum({ ...durum, grafikTipi: value })}
              >
                <Select.Option value="line">Çizgi Grafik</Select.Option>
                <Select.Option value="bar">Çubuk Grafik</Select.Option>
                <Select.Option value="area">Alan Grafik</Select.Option>
                <Select.Option value="composed">Açılır Grafik</Select.Option>
              </Select>
            </div>
          ),
        }));

        setGostergeler(gostergeler);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
        setHata('Veri yüklenirken bir hata oluştu.');
      } finally {
        setYukleniyor(false);
      }
    };

    fetchData();
  }, []);

  return { gostergeler, yukleniyor, hata };
};