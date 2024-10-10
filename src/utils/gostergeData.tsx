import { Input, Typography } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AiOutlineLineChart } from "react-icons/ai";
import {
  IGosterge,
  IGostergeDuzenleProps,
  varsayilanGostergeLayout,
} from "../components/gosterge/IGosterge";

const { Title } = Typography;

const generateRandomData = (count: number) => {
  return Array.from({ length: count }, (_, index) => ({
    name: `Gün ${index + 1}`,
    deger: Math.floor(Math.random() * 100),
  }));
};

export const gostergeData: IGosterge<any>[] = [
  {
    gostergeId: "gosterge1",
    isim: "Göstergem 1",
    getNode: (durum: any, oncekiDurum?: any, yukseklik?: number) => (
        <ResponsiveContainer width="95%" height={(yukseklik || 0) - 200}>
          <LineChart data={generateRandomData(durum.gunSayisi)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="deger"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
    ),
    varsayilanDurum: { gunSayisi: 7 },
    varsayilanBaslik: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <AiOutlineLineChart style={{ marginRight: 8 }} /> Göstergem 1
      </div>
    ),
    varsayilanLayout: {
      ...varsayilanGostergeLayout,
      i: "gosterge1",
      x: 0,
      y: 0,
      w: 6,
      h: 4,
    },
    getDuzenle: ({
      durum,
      setDurum,
    }: IGostergeDuzenleProps<{ gunSayisi: number }>) => (
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
      </div>
    ),
    getBaslik: (durum: any) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <AiOutlineLineChart style={{ marginRight: 8 }} /> Göstergem 1 (
        {durum.gunSayisi} gün)
      </div>
    ),
  },
  {
    gostergeId: "gosterge2",
    isim: "Göstergem 2",
    getNode: (durum: any, oncekiDurum?: any, yukseklik?: number) => (
      <>
        <ResponsiveContainer width="100%" height={(yukseklik || 0) - 200}>
          <LineChart data={generateRandomData(durum.gunSayisi)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="deger"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </>
    ),
    varsayilanDurum: { gunSayisi: 10 },
    varsayilanBaslik: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <AiOutlineLineChart style={{ marginRight: 8 }} /> Göstergem 2
      </div>
    ),
    varsayilanLayout: {
      ...varsayilanGostergeLayout,
      i: "gosterge2",
      x: 6,
      y: 0,
      w: 6,
      h: 4,
    },
    getDuzenle: ({
      durum,
      setDurum,
    }: IGostergeDuzenleProps<{ gunSayisi: number }>) => (
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
      </div>
    ),
    getBaslik: (durum: any) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <AiOutlineLineChart style={{ marginRight: 8 }} /> Göstergem 2 (
        {durum.gunSayisi} gün)
      </div>
    ),
  },
];
