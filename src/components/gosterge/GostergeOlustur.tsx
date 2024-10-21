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
import { Layout } from 'react-grid-layout';
import { AiOutlineLineChart, AiOutlineBarChart, AiOutlineAreaChart } from 'react-icons/ai';
import { MdAreaChart } from 'react-icons/md';
import { Select } from 'antd';

type GrafikTipi = 'line' | 'bar' | 'area' | 'composed';


export interface IGostergeDuzenleProps<TDurum extends BaseGostergeDurum> {
  durum: TDurum;
  setDurum: React.Dispatch<React.SetStateAction<TDurum>>;
}

export interface IGosterge<TDurum extends BaseGostergeDurum> {
  isim?: string;
  gostergeId?: string;
  getNode: (durum: TDurum, oncekiDurum?: TDurum) => ReactElement;
  varsayilanDurum: TDurum;
  varsayilanBaslik?: ReactElement;
  varsayilanLayout?: Layout;
  getDuzenle?: (gdp: IGostergeDuzenleProps<TDurum>) => ReactElement;
  getBaslik?: (durum: TDurum) => ReactElement;
  getDataAsync: () => Promise<any[]>;
}

const formatData = (data: any[], type: 'object' | 'number', isim: string) => {
  if (type === 'object') return data;

  return data.map((value, index) => ({ 
    isim: `Veri ${index + 1}`,
    [isim]: value 
  }));
}

interface BaseGostergeDurum {
  isim: string;
  grafikTipi: GrafikTipi;
  degerler?: { [key: string]: string }[];
}

export const GostergeOlustur = <TDurum extends BaseGostergeDurum>({
  durum,
  getDataAsync,
}: {
  durum: TDurum;
  getDataAsync: () => Promise<any[]>;
}): ReactElement => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await getDataAsync();
        setData(fetchedData);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
        setData([]);
      }
    };

    fetchData();
  }, [getDataAsync]);

  const getChildren = (): ReactElement[] => {
    if (data.length === 0 || !data[0]) {
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
        const keys = Object.keys(data[0]).filter(key => key !== 'isim');
  
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
        data={data}
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
              durum={durum}
              getDataAsync={async () => formatData(gosterge.degerler, gosterge.tur, gosterge.isim)}
            />
          ),
          varsayilanDurum: {
            isim: gosterge.isim,
            grafikTipi: gosterge.grafikTipi,
          } as TDurum,
          varsayilanBaslik: (
            <div style={{ display: "flex", alignItems: "center" }}>
              {gosterge.grafikTipi === 'bar' ? (
                <AiOutlineBarChart style={{ marginRight: 8 }} />
              ) : gosterge.grafikTipi === 'area' ? (
                <AiOutlineAreaChart style={{ marginRight: 8 }} />
              ) : gosterge.grafikTipi === 'composed' ? (
                <>
                  <MdAreaChart style={{ marginRight: 8 }} />
                </>
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
          getDataAsync: async () => formatData(gosterge.degerler, gosterge.tur, gosterge.isim),
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