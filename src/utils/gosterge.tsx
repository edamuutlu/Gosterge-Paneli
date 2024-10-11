import { Input, Typography, Select } from "antd";
import { LineChart, BarChart, AreaChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AiOutlineLineChart, AiOutlineBarChart, AiOutlineAreaChart } from "react-icons/ai";
import { IGosterge, IGostergeDuzenleProps, varsayilanGostergeLayout } from "../components/gosterge/IGosterge";

const { Title } = Typography;
const { Option } = Select;

const generateRandomData = (count: number) => 
  Array.from({ length: count }, (_, index) => ({
    name: `Gün ${index + 1}`,
    deger: Math.floor(Math.random() * 100),
    deger2: Math.floor(Math.random() * 100),
  }));

type ChartType = 'line' | 'bar' | 'area';

const ChartComponents = {
  line: LineChart,
  bar: BarChart,
  area: AreaChart,
} as const;

const getChart = (type: ChartType, data: any[], dataKey: string, color: string) => {
  const ChartComponent = ChartComponents[type];
  
  // Ensure correct component usage
  const renderDataComponent = () => {
    switch (type) {
      case 'line':
        return <Line type="monotone" dataKey={dataKey} stroke={color} />;
      case 'bar':
        return <Bar dataKey={dataKey} fill={color} />;
      case 'area':
        return <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} />;
      default:
        return null;
    }
  };

  return (
    <ChartComponent data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      {renderDataComponent()}
    </ChartComponent>
  );
};

interface GaugeDurum {
  gunSayisi: number;
  grafikTipi: ChartType;
  veriAnahtari: string;
}

const defaultGaugeConfig = {
  getNode: (durum: GaugeDurum, oncekiDurum?: any, yukseklik?: number) => (
    <ResponsiveContainer width="95%" height={(yukseklik || 0) - 200}>
      {getChart(durum.grafikTipi, generateRandomData(durum.gunSayisi), durum.veriAnahtari, "#82ca9d")}
    </ResponsiveContainer>
  ),
  varsayilanDurum: { gunSayisi: 7, grafikTipi: "line" as ChartType, veriAnahtari: "deger" },
  varsayilanBaslik: (isim: string) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <AiOutlineLineChart style={{ marginRight: 8 }} /> {isim}
    </div>
  ),
  varsayilanLayout: { ...varsayilanGostergeLayout, w: 6, h: 4 },
  getDuzenle: ({ durum, setDurum }: IGostergeDuzenleProps<GaugeDurum>) => (
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
          onChange={(value: ChartType) => setDurum({ ...durum, grafikTipi: value })}
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
  getBaslik: (isim: string, durum: GaugeDurum) => {
    const Icon = durum.grafikTipi === "bar" ? AiOutlineBarChart : 
                 durum.grafikTipi === "area" ? AiOutlineAreaChart : AiOutlineLineChart;
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Icon style={{ marginRight: 8 }} /> {isim} ({durum.gunSayisi} gün, {durum.grafikTipi})
      </div>
    );
  },
};

const createGauge = (id: string, isim: string, x: number, y: number, config: Partial<typeof defaultGaugeConfig> = {}): IGosterge<GaugeDurum> => ({
  gostergeId: id,
  isim,
  ...{ ...defaultGaugeConfig, ...config },
  varsayilanBaslik: defaultGaugeConfig.varsayilanBaslik(isim),
  varsayilanLayout: { ...defaultGaugeConfig.varsayilanLayout, ...config.varsayilanLayout, i: id, x, y },
  getBaslik: (durum: GaugeDurum) => defaultGaugeConfig.getBaslik(isim, durum),
});

export const gosterge: IGosterge<GaugeDurum>[] = Array.from({ length: 100 }, (_, index) => {
  const row = Math.floor(index / 5);
  const col = index % 5;
  return createGauge(
    `gosterge${index + 1}`,
    `Gösterge ${index + 1}`,
    col * 6,
    row * 4,
    {
      varsayilanDurum: { 
        gunSayisi: 7 + (index % 8), 
        grafikTipi: ["line", "bar", "area"][index % 3] as ChartType, 
        veriAnahtari: index % 2 === 0 ? "deger" : "deger2" 
      },
    }
  );
});