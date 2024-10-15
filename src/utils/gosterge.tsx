import { Typography, Select, Alert } from "antd";
import { LineChart, BarChart, AreaChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AiOutlineLineChart, AiOutlineBarChart, AiOutlineAreaChart } from "react-icons/ai";
import { useEffect, useState } from "react";
import { IGosterge, IGostergeDuzenleProps, varsayilanGostergeLayout } from "../components/gosterge/IGosterge";

const { Title } = Typography;
const { Option } = Select;

type GrafikTipi = 'line' | 'bar' | 'area';

interface GostergeDurum {
  isim: string;
  gunSayisi: number;
  grafikTipi: GrafikTipi;
  veriAnahtari: string;
  degerler: { isim: string; deger: number; deger2: number; }[];
}

const GrafikBilesenleri = {
  line: LineChart,
  bar: BarChart,
  area: AreaChart,
} as const;

const grafikGetir = (tip: GrafikTipi, veri: any[], veriAnahtari: string, renk: string) => {
  const GrafikBileseni = GrafikBilesenleri[tip];

  const veriBileseniGetir = () => {
    switch (tip) {
      case 'line':
        return <Line type="monotone" dataKey={veriAnahtari} stroke={renk} />;
      case 'bar':
        return <Bar dataKey={veriAnahtari} fill={renk} />;
      case 'area':
        return <Area type="monotone" dataKey={veriAnahtari} stroke={renk} fill={renk} />;
      default:
        return null;
    }
  };

  if (!veri || veri.length === 0 || !veri[0].isim) {
    return <Alert message="Hata" description="Veri yüklenirken bir hata oluştu." type="error" showIcon />;
  }

  return (
    <GrafikBileseni data={veri}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="isim" />
      <YAxis />
      <Tooltip />
      <Legend />
      {veriBileseniGetir()}
    </GrafikBileseni>
  );
};

const GostergeComponent = ({ durum, yukseklik }: { durum: GostergeDurum; yukseklik?: number }) => {  
  if (!durum.degerler || durum.degerler.length === 0) {
    return <Alert message="Hata" description="Veri bulunamadı." type="error" showIcon />;
  }

  return (
    <ResponsiveContainer width="95%" height={(yukseklik || 0) - 200}>
      {grafikGetir(durum.grafikTipi, durum.degerler, durum.veriAnahtari, "#82ca9d")}
    </ResponsiveContainer>
  );
};

const varsayilanGostergeAyarlar = {
  getNode: (durum: GostergeDurum, oncekiDurum?: any, yukseklik?: number) => (
    <GostergeComponent durum={durum}  yukseklik={yukseklik} />
  ),
  varsayilanDurum: { isim: "", gunSayisi: 7, grafikTipi: "line" as GrafikTipi, veriAnahtari: "deger", degerler: [] },
  varsayilanBaslik: (isim: string) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <AiOutlineLineChart style={{ marginRight: 8 }} /> {isim}
    </div>
  ),
  varsayilanLayout: { ...varsayilanGostergeLayout, w: 6, h: 4 },
  getDuzenle: ({ durum, setDurum }: IGostergeDuzenleProps<GostergeDurum>) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* <div>
        <Title level={5}>Gün Sayısı</Title>
        <Input
          type="number"
          value={durum.gunSayisi}
          onChange={(e) => setDurum({ ...durum, gunSayisi: parseInt(e.target.value) })}
        />
      </div> */}
      <div>
        <Title level={5}>Grafik Tipi</Title>
        <Select
          value={durum.grafikTipi}
          onChange={(value: GrafikTipi) => setDurum({ ...durum, grafikTipi: value })}
        >
          <Option value="line">Çizgi Grafik</Option>
          <Option value="bar">Çubuk Grafik</Option>
          <Option value="area">Alan Grafik</Option>
        </Select>
      </div>
      <div>
        <Title level={5}>Veri Anahtarı</Title>
        <Select
          value={durum.veriAnahtari}
          onChange={(value) => setDurum({ ...durum, veriAnahtari: value })}
        >
          <Option value="deger">Değer 1</Option>
          <Option value="deger2">Değer 2</Option>
        </Select>
      </div>
    </div>
  ),
  getBaslik: (isim: string, durum: GostergeDurum) => {
    const Ikon = durum.grafikTipi === "bar" ? AiOutlineBarChart : 
                 durum.grafikTipi === "area" ? AiOutlineAreaChart : AiOutlineLineChart;
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Ikon style={{ width:18, height:18, marginRight:6 }} /> {isim} ({durum.gunSayisi} gün, {durum.grafikTipi})
      </div>
    );
  },
};

const gostergeOlustur = (gosterge: GostergeDurum, index: number): IGosterge<GostergeDurum> => ({
  gostergeId: `gosterge${index + 1}`,
  isim: gosterge.isim,
  ...varsayilanGostergeAyarlar,
  varsayilanBaslik: varsayilanGostergeAyarlar.varsayilanBaslik(gosterge.isim),
  varsayilanLayout: { 
    ...varsayilanGostergeAyarlar.varsayilanLayout, 
    i: `gosterge${index + 1}`, 
    x: (index % 5) * 6, 
    y: Math.floor(index / 5) * 4 
  },
  getBaslik: (durum: GostergeDurum) => varsayilanGostergeAyarlar.getBaslik(gosterge.isim, durum),
  varsayilanDurum: gosterge,
  getNode: (durum: GostergeDurum, oncekiDurum?: any, yukseklik?: number) => (
    <GostergeComponent durum={gosterge}  yukseklik={yukseklik} />
  )
});

const fetchData = async (): Promise<GostergeDurum[]> => {
  try {
    const response = await fetch('/data.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export const useGosterge = () => {
  const [gosterge, setGosterge] = useState<IGosterge<GostergeDurum>[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setYukleniyor(true);
        const data = await fetchData();
        const newGosterge = data.map((item, index) => {
          const gostergeItem = gostergeOlustur(item, index);
          gostergeItem.varsayilanDurum = {
            ...gostergeItem.varsayilanDurum,
            degerler: item.degerler || [],
          };
          return gostergeItem;
        });
        setGosterge(newGosterge);
      } catch (error) {
        console.error('Error loading gösterge data:', error);
      } finally {
        setYukleniyor(false);
      }
    };

    loadData();
  }, []);
  return { gostergeler: gosterge, yukleniyor };
};