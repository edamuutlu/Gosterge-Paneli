import { Input, Typography, Select, Alert } from "antd";
import { LineChart, BarChart, AreaChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AiOutlineLineChart, AiOutlineBarChart, AiOutlineAreaChart } from "react-icons/ai";
import { useEffect, useState } from "react";
import { IGosterge, IGostergeDuzenleProps, varsayilanGostergeLayout } from "../components/gosterge/IGosterge";

const { Title } = Typography;
const { Option } = Select;

const rastgeleVeriUret = (adet: number) => {
  return Array.from({ length: adet }, (_, index) => ({
    isim: `Gün ${index + 1}`,
    deger: Math.floor(Math.random() * 100),
    deger2: Math.floor(Math.random() * 100),
  }));
};

type GrafikTipi = 'line' | 'bar' | 'area';

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

interface GostergeDurum {
  gunSayisi: number;
  grafikTipi: GrafikTipi;
  veriAnahtari: string;
}

const varsayilanGostergeAyarlar = {
  getNode: (durum: GostergeDurum, oncekiDurum?: any, yukseklik?: number) => (
    <GostergeComponent durum={durum} yukseklik={yukseklik} />
  ),
  varsayilanDurum: { gunSayisi: 7, grafikTipi: "line" as GrafikTipi, veriAnahtari: "deger" },
  varsayilanBaslik: (isim: string) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <AiOutlineLineChart style={{ marginRight: 8 }} /> {isim}
    </div>
  ),
  varsayilanLayout: { ...varsayilanGostergeLayout, w: 6, h: 4 },
  getDuzenle: ({ durum, setDurum }: IGostergeDuzenleProps<GostergeDurum>) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <Title level={5}>Gün Sayısı</Title>
        <Input
          type="number"
          value={durum.gunSayisi}
          onChange={(e) => setDurum({ ...durum, gunSayisi: parseInt(e.target.value) })}
        />
      </div>
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
        <Ikon style={{ marginRight: 8 }} /> {isim} ({durum.gunSayisi} gün, {durum.grafikTipi})
      </div>
    );
  },
};

const GostergeComponent = ({ durum, yukseklik }: { durum: GostergeDurum; yukseklik?: number }) => {
  const [veri, setVeri] = useState<{ isim: string; deger: number; deger2: number; }[]>([]);

  useEffect(() => {
    const initialData = rastgeleVeriUret(durum.gunSayisi);
    setVeri(initialData);
  }, [durum.gunSayisi]);

  return (
    <ResponsiveContainer width="95%" height={(yukseklik || 0) - 200}>
      {grafikGetir(durum.grafikTipi, veri, durum.veriAnahtari, "#82ca9d")}
    </ResponsiveContainer>
  );
};

const gostergeOlustur = (id: string, isim: string, x: number, y: number, ayarlar: Partial<typeof varsayilanGostergeAyarlar> = {}): IGosterge<GostergeDurum> => ({
  gostergeId: id,
  isim,
  ...{ ...varsayilanGostergeAyarlar, ...ayarlar },
  varsayilanBaslik: varsayilanGostergeAyarlar.varsayilanBaslik(isim),
  varsayilanLayout: { ...varsayilanGostergeAyarlar.varsayilanLayout, ...ayarlar.varsayilanLayout, i: id, x, y },
  getBaslik: (durum: GostergeDurum) => varsayilanGostergeAyarlar.getBaslik(isim, durum),
});

export const gosterge: IGosterge<GostergeDurum>[] = Array.from({ length: 2 }, (_, index) => {
  const satir = Math.floor(index / 5);
  const sutun = index % 5;
  return gostergeOlustur(
    `gosterge${index + 1}`,
    `Gösterge ${index + 1}`,
    sutun * 6,
    satir * 4,
    {
      varsayilanDurum: { 
        gunSayisi: 7 + (index % 8), 
        grafikTipi: ["line", "bar", "area"][index % 3] as GrafikTipi, 
        veriAnahtari: index % 2 === 0 ? "deger" : "deger2" 
      },
    }
  );
});