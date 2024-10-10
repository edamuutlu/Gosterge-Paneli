import { Input, Typography, Select } from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { AiOutlineLineChart, AiOutlineBarChart, AiOutlineAreaChart } from "react-icons/ai";
import {
  IGosterge,
  IGostergeDuzenleProps,
  varsayilanGostergeLayout,
} from "../components/gosterge/IGosterge";

const { Title } = Typography;
const { Option } = Select;

const generateRandomData = (count: number) => {
  const data = Array.from({ length: count }, (_, index) => ({
    name: `Gün ${index + 1}`,
    deger: Math.floor(Math.random() * 100),
    deger2: Math.floor(Math.random() * 100),
  }));
  return data;
};

// Farklı grafik tipleri için fonksiyonlar
const getLineChart = (data: any[], dataKey: string, stroke: string) => {
  console.log('Rendering LineChart with data:', data);
  return (
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey={dataKey} stroke={stroke} activeDot={{ r: 8 }} />
    </LineChart>
  );
};

const getBarChart = (data: any[], dataKey: string, fill: string) => {
  console.log('Rendering BarChart with data:', data);
  return (
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={dataKey} fill={fill} />
    </BarChart>
  );
};

const getAreaChart = (data: any[], dataKey: string, fill: string, stroke: string) => {
  console.log('Rendering AreaChart with data:', data);
  return (
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area type="monotone" dataKey={dataKey} fill={fill} stroke={stroke} />
    </AreaChart>
  );
};

// Varsayılan gösterge yapılandırması
const defaultGaugeConfig = {
  getNode: (durum: any, oncekiDurum?: any, yukseklik?: number) => {
    const data = generateRandomData(durum.gunSayisi);
    return (
      <ResponsiveContainer width="95%" height={(yukseklik || 0) - 200}>
        {durum.grafikTipi === 'bar'
          ? getBarChart(data, durum.veriAnahtari, "#82ca9d")
          : durum.grafikTipi === 'area'
          ? getAreaChart(data, durum.veriAnahtari, "#82ca9d", "#82ca9d")
          : getLineChart(data, durum.veriAnahtari, "#82ca9d")}
      </ResponsiveContainer>
    );
  },
  varsayilanDurum: { gunSayisi: 7, grafikTipi: 'line', veriAnahtari: 'deger' },
  varsayilanBaslik: (isim: string) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <AiOutlineLineChart style={{ marginRight: 8 }} /> {isim}
    </div>
  ),
  varsayilanLayout: {
    ...varsayilanGostergeLayout,
    w: 6,
    h: 4,
  },
  getDuzenle: ({
    durum,
    setDurum,
  }: IGostergeDuzenleProps<{ gunSayisi: number, grafikTipi: string, veriAnahtari: string }>) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <Title level={5}>Gün Sayısı</Title>
        <Input
          type="number"
          value={durum.gunSayisi}
          onChange={(e) =>
            setDurum({ ...durum, gunSayisi: parseInt(e.target.value) })
          }
        />
      </div>
      <div>
        <Title level={5}>Grafik Tipi</Title>
        <Select
          value={durum.grafikTipi}
          onChange={(value) => setDurum({ ...durum, grafikTipi: value })}
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
  getBaslik: (isim: string, durum: any) => {
    let Icon;
    switch (durum.grafikTipi) {
      case 'bar':
        Icon = AiOutlineBarChart;
        break;
      case 'area':
        Icon = AiOutlineAreaChart;
        break;
      default:
        Icon = AiOutlineLineChart;
    }
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Icon style={{ marginRight: 8 }} /> {isim} ({durum.gunSayisi} gün, {durum.grafikTipi})
      </div>
    );
  },
};

// Gösterge oluşturucu fonksiyon
const createGauge = (
  id: string,
  isim: string,
  x: number,
  y: number,
  config: Partial<typeof defaultGaugeConfig> = {}
): IGosterge<any> => {
  const mergedConfig = { ...defaultGaugeConfig, ...config };

  return {
    gostergeId: id,
    isim: isim,
    getNode: mergedConfig.getNode,
    varsayilanDurum: mergedConfig.varsayilanDurum,
    varsayilanBaslik: mergedConfig.varsayilanBaslik(isim),
    varsayilanLayout: {
      ...mergedConfig.varsayilanLayout,
      i: id,
      x: x,
      y: y,
    },
    getDuzenle: mergedConfig.getDuzenle,
    getBaslik: (durum: any) => mergedConfig.getBaslik(isim, durum),
  };
};

// 100 adet gösterge oluşturma
export const gosterge: IGosterge<any>[] = Array.from({ length: 100 }, (_, index) => {
  const row = Math.floor(index / 5);
  const col = index % 5;
  const grafikTipi = ['line', 'bar', 'area'][index % 3];
  const veriAnahtari = index % 2 === 0 ? 'deger' : 'deger2';
  const gunSayisi = 7 + (index % 8); // 7 ile 14 arasında değişen gün sayısı

  return createGauge(
    `gosterge${index + 1}`,
    `Gösterge ${index + 1}`,
    col * 6,
    row * 4,
    {
      varsayilanDurum: { gunSayisi, grafikTipi, veriAnahtari },
    }
  );
});

