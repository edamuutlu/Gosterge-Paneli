import { Typography, Select, Alert } from "antd";
import {
  LineChart,
  BarChart,
  AreaChart,
  PieChart,
  Line,
  Bar,
  Area,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AiOutlineLineChart,
  AiOutlineBarChart,
  AiOutlineAreaChart,
  AiOutlinePieChart,
} from "react-icons/ai";
import { useEffect, useState } from "react";

const { Title } = Typography;
const { Option } = Select;

type GrafikTipi = "line" | "bar" | "area" | "pie";

interface GostergeDurum {
  isim: string;
  grafikTipi: GrafikTipi;
  veriAnahtari: string;
  tur: any;
  degerler: any;
}

interface GrafikProps {
  tip: GrafikTipi;
  veri: any[];
  veriAnahtari: string;
  renk: string;
}

const GrafikBilesenleri = {
  line: LineChart,
  bar: BarChart,
  area: AreaChart,
  pie: PieChart,
} as const;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const grafikGetir = ({ tip, veri, veriAnahtari, renk }: GrafikProps) => {
  const GrafikBileseni = GrafikBilesenleri[tip];

  const veriBileseniGetir = () => {
    switch (tip) {
      case "line":
        return <Line type="monotone" dataKey={veriAnahtari} stroke={renk} />;
      case "bar":
        return <Bar dataKey={veriAnahtari} fill={renk} />;
      case "area":
        return (
          <Area
            type="monotone"
            dataKey={veriAnahtari}
            stroke={renk}
            fill={renk}
          />
        );
      case "pie":
        return (
          <Pie
            data={veri}
            dataKey={veriAnahtari}
            nameKey="isim"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {veri.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        );
      default:
        return null;
    }
  };

  if (!veri || veri.length === 0) {
    return (
      <Alert
        message="Hata"
        description="Veri yüklenirken bir hata oluştu."
        type="error"
        showIcon
      />
    );
  }

  return (
    <GrafikBileseni data={veri}>
      {tip !== "pie" && (
        <>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="isim" />
          <YAxis />
        </>
      )}
      <Tooltip />
      <Legend />
      {veriBileseniGetir()}
    </GrafikBileseni>
  );
};

const GostergeNode = ({
  durum,
  yukseklik,
}: {
  durum: GostergeDurum;
  yukseklik?: number;
}) => {
  const veriFormatla = (degerler: any, tur: any): any[] => {
    if (!Array.isArray(degerler)) {
      degerler = [degerler];
    }

    switch (tur) {
      case "object":
        return degerler;
      case "number":
        return degerler.map((deger: number, index: number) => ({
          isim: `Değer ${index + 1}`,
          deger: deger,
        }));
      case "string":
        return degerler.map((deger: string, index: number) => ({
          isim: deger,
          deger: index + 1,
        }));
      default:
        return [];
    }
  };

  const formatliVeri = veriFormatla(durum.degerler, durum.tur);

  if (formatliVeri.length === 0) {
    return (
      <Alert
        message="Hata"
        description="Veri bulunamadı veya geçersiz veri türü."
        type="error"
        showIcon
      />
    );
  }

  return (
    <ResponsiveContainer width="95%" height={(yukseklik || 0) - 200}>
      {grafikGetir({
        tip: durum.grafikTipi,
        veri: formatliVeri,
        veriAnahtari: durum.veriAnahtari,
        renk: "#82ca9d",
      })}
    </ResponsiveContainer>
  );
};

const varsayilanGostergeAyarlar = {
  getNode: (durum: GostergeDurum, oncekiDurum?: any, yukseklik?: number) => (
    <GostergeNode durum={durum} yukseklik={yukseklik} />
  ),
  varsayilanDurum: {
    isim: "",
    grafikTipi: "line" as GrafikTipi,
    veriAnahtari: "deger",
    degerler: [],
  },
  varsayilanBaslik: (isim: string) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <AiOutlineLineChart style={{ marginRight: 8 }} /> {isim}
    </div>
  ),
  varsayilanLayout: { w: 6, h: 4 },
  getDuzenle: ({ durum, setDurum }: { durum: GostergeDurum; setDurum: (durum: GostergeDurum) => void }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <Title level={5}>Grafik Tipi</Title>
        <Select
          value={durum.grafikTipi}
          onChange={(value: GrafikTipi) =>
            setDurum({ ...durum, grafikTipi: value })
          }
        >
          <Option value="line">Çizgi Grafik</Option>
          <Option value="bar">Çubuk Grafik</Option>
          <Option value="area">Alan Grafik</Option>
          <Option value="pie">Pasta Grafik</Option>
        </Select>
      </div>
      <div>
        <Title level={5}>Veri Anahtarı</Title>
        <Select
          value={durum.veriAnahtari}
          onChange={(value) => setDurum({ ...durum, veriAnahtari: value })}
        >
          <Option value="deger">Değer</Option>
          <Option value="satisMiktari">Satış Miktarı</Option>
        </Select>
      </div>
    </div>
  ),
  getBaslik: (isim: string, durum: GostergeDurum) => {
    const Ikon =
      durum.grafikTipi === "bar"
        ? AiOutlineBarChart
        : durum.grafikTipi === "area"
        ? AiOutlineAreaChart
        : durum.grafikTipi === "pie"
        ? AiOutlinePieChart
        : AiOutlineLineChart;
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Ikon style={{ width: 18, height: 18, marginRight: 6 }} /> {isim} (
        {durum.degerler.length} gün, {durum.grafikTipi})
      </div>
    );
  },
};

const gostergeOlustur = (
  gosterge: GostergeDurum,
  index: number
) => ({
  gostergeId: `gosterge${index + 1}`,
  isim: gosterge.isim,
  ...varsayilanGostergeAyarlar,
  varsayilanBaslik: varsayilanGostergeAyarlar.varsayilanBaslik(gosterge.isim),
  varsayilanLayout: {
    ...varsayilanGostergeAyarlar.varsayilanLayout,
    i: `gosterge${index + 1}`,
    x: (index % 5) * 6,
    y: Math.floor(index / 5) * 4,
  },
  getBaslik: (durum: GostergeDurum) =>
    varsayilanGostergeAyarlar.getBaslik(gosterge.isim, durum),
  varsayilanDurum: gosterge,
  getNode: (durum: GostergeDurum, oncekiDurum?: any, yukseklik?: number) => (
    <GostergeNode durum={durum} yukseklik={yukseklik} />
  ),
});

const fetchData = async (): Promise<GostergeDurum[]> => {
  try {
    const response = await fetch("/data.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const useGosterge = () => {
  const [gosterge, setGosterge] = useState<ReturnType<typeof gostergeOlustur>[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setYukleniyor(true);
        const data: GostergeDurum[] = await fetchData();
        const yeniGosterge = data.map((item, index) => gostergeOlustur(item, index));
        setGosterge(yeniGosterge);
      } catch (error) {
        console.error("Error loading gösterge data:", error);
      } finally {
        setYukleniyor(false);
      }
    };

    loadData();
  }, []);

  return { gostergeler: gosterge, yukleniyor };
};