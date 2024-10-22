import React, { useState, useEffect, ReactElement, ReactNode } from 'react';
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
import { AiOutlineLineChart } from 'react-icons/ai';
import { Alert, Select } from 'antd';
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
  grafikCizimTipi?: { [key: string]: GrafikTipi };
}

export const GostergeOlustur = <TDurum extends BaseGostergeDurum>({
  durum,
}: {
  durum: TDurum;
}): ReactElement => {
  if (!durum.degerler || durum.degerler.length === 0) {
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
    return (
      <div>
        {durum.isim}: {typeof durum.degerler === 'object' ? JSON.stringify(durum.degerler) : durum.degerler ?? 'Veri yok'}
      </div>
    );
  }

  const getChildren = () => {
    if (!durum.degerler || durum.degerler.length === 0) {
      return [];
    }

    if (durum.grafikTipi === 'composed') {
      const keys = Object.keys(durum.degerler[0]).filter(key => key !== 'isim');
      return keys.map(key => {
        const type = durum.grafikCizimTipi?.[key] || 'line';
        switch (type) {
          case 'bar':
            return <Bar key={key} dataKey={key} fill="#82ca9d" />;
          case 'area':
            return <Area key={key} dataKey={key} type="monotone" fill="#ffc658" stroke="#8884d8" />;
          default:
            return <Line key={key} dataKey={key} type="monotone" stroke="#8884d8" />;
        }
      });
    }

    const dataKey = Object.keys(durum.degerler[0]).find(key => key !== 'isim');
    if (!dataKey) return [];

    switch (durum.grafikTipi) {
      case 'line':
        return [<Line key="line" dataKey={dataKey} type="monotone" stroke="#8884d8" />];
      case 'bar':
        return [<Bar key="bar" dataKey={dataKey} fill="#82ca9d" />];
      case 'area':
        return [<Area key="area" dataKey={dataKey} type="monotone" fill="#ffc658" stroke="#8884d8" />];
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setYukleniyor(true);

        const response = await fetch('/data.json');
        const jsonData = await response.json();

        const gostergeler = jsonData.map((gosterge: any, index: number) => {
          const baslangicGrafikCizimTipi: { [key: string]: GrafikTipi } = {};
          if (Array.isArray(gosterge.degerler) && gosterge.degerler.length > 0) {
            Object.keys(gosterge.degerler[0])
              .filter(key => key !== 'isim')
              .forEach(key => {
                baslangicGrafikCizimTipi[key] = 'line';
              });
          }

          return {
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
              grafikTipi: Array.isArray(gosterge.degerler) ? 'line' : 'yok',
              degerler: gosterge.degerler,
              grafikCizimTipi: baslangicGrafikCizimTipi,
            } as TDurum,
            varsayilanBaslik: (
              <div style={{ display: "flex", alignItems: "center" }}>
                <AiOutlineLineChart style={{ marginRight: 8 }} />
                {gosterge.isim}
              </div>
            ),
            varsayilanLayout: { w: 6, h: 4, x: 0, y: 0, i: `gosterge-${index + 1}` },
            getDuzenle: (props: IGostergeDuzenleProps<TDurum>): ReactNode => {
              const { durum, setDurum } = props;
              
              if (durum.grafikTipi === 'yok' || !durum.degerler || !Array.isArray(durum.degerler)) {
                return null;
              }

              if (durum.grafikTipi === 'composed' && durum.degerler.length > 0) {
                const keys = Object.keys(durum.degerler[0]).filter(key => key !== 'isim');
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {keys.map(key => (
                      <div style={{display: "flex", flexDirection: "column", gap: 5}} key={key}>
                        <label style={{fontSize: 16, fontWeight: 500}}>{key} Grafik Tipi:</label>
                        <Select
                          value={durum.grafikCizimTipi?.[key] || 'line'}
                          onChange={(value: GrafikTipi) => {
                            setDurum({
                              ...durum,
                              grafikCizimTipi: {
                                ...durum.grafikCizimTipi,
                                [key]: value
                              }
                            } as TDurum);
                          }}
                        >
                          <Select.Option value="line">Çizgi Grafik</Select.Option>
                          <Select.Option value="bar">Çubuk Grafik</Select.Option>
                          <Select.Option value="area">Alan Grafik</Select.Option>
                        </Select>
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{fontSize: 16, fontWeight: 500}}>Grafik Tipi:</label>
                  <Select
                    value={durum.grafikTipi}
                    onChange={(value: GrafikTipi) => setDurum({ ...durum, grafikTipi: value } as TDurum)}
                  >
                    <Select.Option value="line">Çizgi Grafik</Select.Option>
                    <Select.Option value="bar">Çubuk Grafik</Select.Option>
                    <Select.Option value="area">Alan Grafik</Select.Option>
                    {Object.keys(durum.degerler[0]).filter(key => key !== 'isim').length > 1 && (
                      <Select.Option value="composed">Karma Grafik</Select.Option>
                    )}
                  </Select>
                </div>
              );
            },
          };
        });

        setGostergeler(gostergeler as IGosterge<TDurum>[]);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setYukleniyor(false);
      }
    };
    fetchData();
  }, []);

  return { gostergeler, yukleniyor };
};