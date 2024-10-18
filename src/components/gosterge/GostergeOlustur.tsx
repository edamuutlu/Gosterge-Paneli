import React, { useState, useEffect, ReactElement } from 'react';
import { ResponsiveContainer, ComposedChart, Line, Bar, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Layout } from 'react-grid-layout';
import { AiOutlineLineChart, AiOutlineBarChart, AiOutlineAreaChart } from 'react-icons/ai';
import { Select, Typography } from 'antd';

const { Title } = Typography;

type GrafikTipi = 'line' | 'bar' | 'area';

interface GostergeDurum {
  isim: string;
  grafikTipi: GrafikTipi;
  veriAnahtari: string;
  tur: 'object' | 'number' | 'string';
  degerler: any[];
}

export interface IGostergeDuzenleProps<TDurum> {
  durum: TDurum;
  setDurum: React.Dispatch<React.SetStateAction<TDurum>>;
}

export interface IGosterge<TDurum> {
  isim?: string;
  gostergeId?: string;
  getNode: (durum: TDurum, oncekiDurum?: TDurum) => ReactElement;
  varsayilanDurum: TDurum;
  varsayilanBaslik?: ReactElement;
  varsayilanLayout?: Layout;
  getDuzenle?: (gdp: IGostergeDuzenleProps<TDurum>) => ReactElement;
  getBaslik?: (durum: TDurum) => ReactElement;
}

const getDataAsync = async (): Promise<GostergeDurum[]> => {
  try {
    const response = await fetch('/data.json');
    if (!response.ok) {
      throw new Error('Veri yüklenirken bir hata oluştu');
    }
    return await response.json();
  } catch (error) {
    console.error('Veri yükleme hatası:', error);
    return [];
  }
};

export const GostergeOlustur :/* = <T,>({
getDataAsync,
getChildren,
}:{
  getDataAsync: () => Promise<T[]>;
} & (getChildren: (data: T[]) => ReactNode)} => { */
  React.FC<GostergeDurum> = ({ grafikTipi, veriAnahtari, degerler, tur }) => {
  const formatData = (data: any[]): any[] => {
    if (tur === 'object') return data;
    return data.map((value, index) => ({ isim: `Veri ${index + 1}`, [veriAnahtari]: value }));
  };

  const formattedData = formatData(degerler);

  const getChildren = (): ReactElement => {
    switch (grafikTipi) {
      case 'line':
        return <Line type="monotone" dataKey={veriAnahtari} stroke="#8884d8" />;
      case 'bar':
        return <Bar dataKey={veriAnahtari} fill="#82ca9d" />;
      case 'area':
        return <Area type="monotone" dataKey={veriAnahtari} fill="#ffc658" stroke="#8884d8" />;
      default:
        return <></>;
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={400}
        data={formattedData}
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

export const useGosterge = () => {
  const [gostergeler, setGostergeler] = useState<IGosterge<GostergeDurum>[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setYukleniyor(true);
        setHata(null);
        const data = await getDataAsync();
        if (data.length === 0) {
          throw new Error('Veri bulunamadı');
        }
        const formattedData: IGosterge<GostergeDurum>[] = data.map((item, index) => ({
          gostergeId: `gosterge-${index}`,
          isim: item.isim,
          getNode: (durum: GostergeDurum) => (
            <GostergeOlustur {...durum} />
          ),
          varsayilanDurum: item,
          varsayilanBaslik: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <AiOutlineLineChart style={{ marginRight: 8 }} /> {item.isim}
            </div>
          ),
          varsayilanLayout: { w: 6, h: 4, x: 0, y: 0, i: `gosterge-${index}` },
          getDuzenle: ({ durum, setDurum }: IGostergeDuzenleProps<GostergeDurum>) => (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Title level={4}>Düzenle: {durum.isim}</Title>
              <Select
                value={durum.grafikTipi}
                onChange={(value: GrafikTipi) => setDurum({ ...durum, grafikTipi: value })}
              >
                <Select.Option value="line">Çizgi Grafik</Select.Option>
                <Select.Option value="bar">Çubuk Grafik</Select.Option>
                <Select.Option value="area">Alan Grafik</Select.Option>
              </Select>
            </div>
          ),
          getBaslik: (durum: GostergeDurum): React.ReactElement => {
            const Ikon = durum.grafikTipi === "bar"
              ? AiOutlineBarChart
              : durum.grafikTipi === "area"
              ? AiOutlineAreaChart
              : AiOutlineLineChart;
        
            return (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Ikon style={{ width: 18, height: 18, marginRight: 6 }} /> {durum.isim} ({durum.degerler.length} gün, {durum.grafikTipi})
              </div>
            );
          },
        }));
        
        setGostergeler(formattedData);
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