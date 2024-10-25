import { Select } from "antd";
import GostergeBasitBaslik from "./GostergeBasitBaslik";
import { GostergeDurum, GostergeOlustur, GrafikTipi } from "./GostergeOlustur";
import { IGosterge, IGostergeDuzenleProps } from "./IGosterge";
import { ReactNode, useEffect, useState } from "react";

type GrafikData<T = any> = {
  isim: string;
  degerler: T;
};

const grafikSecenekleri = [
  { value: "line", label: "Çizgi Grafik" },
  { value: "bar", label: "Çubuk Grafik" },
  { value: "area", label: "Alan Grafik" },
] as const;

const GostergeDuzenle = <T extends GostergeDurum>({
  durum,
  setDurum,
}: IGostergeDuzenleProps<T>): ReactNode => {
  if (durum.grafikTipi === "yok" || !Array.isArray(durum.degerler)) return null;

  const dataKeys = Object.keys(durum.degerler[0] || {}).filter(
    (key) => key !== "isim"
  );
  const bilesikGrafikMi =
    durum.grafikTipi === "composed" && durum.degerler.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {bilesikGrafikMi ? (
        dataKeys.map((key) => (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            key={key}
          >
            <label style={{ fontSize: 16, fontWeight: 500 }}>
              {key} Grafik Tipi:
            </label>
            <Select
              value={durum.grafikCizimTipi?.[key] || "line"}
              onChange={(value: GrafikTipi) =>
                setDurum(
                  (prev) =>
                    ({
                      ...prev,
                      grafikCizimTipi: {
                        ...prev.grafikCizimTipi,
                        [key]: value,
                      },
                    } as T)
                )
              }
            >
              {grafikSecenekleri.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        ))
      ) : (
        <>
          <label style={{ fontSize: 16, fontWeight: 500 }}>Grafik Tipi:</label>
          <Select
            value={durum.grafikTipi}
            onChange={(value: GrafikTipi) =>
              setDurum((prev) => ({ ...prev, grafikTipi: value } as T))
            }
          >
            {grafikSecenekleri.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
            {dataKeys.length > 1 && (
              <Select.Option value="composed">Karma Grafik</Select.Option>
            )}
          </Select>
        </>
      )}
    </div>
  );
};

const grafikAData = async (): Promise<GrafikData[]> => {
  return [
    {
      isim: "Aylık Satışlar",
      degerler: [
        { isim: "Ocak", "Aylık Satışlar": 4000 },
        { isim: "Şubat", "Aylık Satışlar": 3000 },
        { isim: "Mart", "Aylık Satışlar": 5000 },
        { isim: "Nisan", "Aylık Satışlar": 4500 },
        { isim: "Mayıs", "Aylık Satışlar": 6000 },
        { isim: "Haziran", "Aylık Satışlar": 5500 },
      ],
    },
    {
      isim: "Genel İstatistikler",
      degerler: [
        {
          isim: "Ocak",
          "Aylık Satışlar": 4000,
          "Haftalık Ziyaretçi Sayısı": 1500,
          "Günlük Sipariş Adedi": 1200,
        },
        {
          isim: "Şubat",
          "Aylık Satışlar": 3000,
          "Haftalık Ziyaretçi Sayısı": 1800,
          "Günlük Sipariş Adedi": 1500,
        },
        {
          isim: "Mart",
          "Aylık Satışlar": 5000,
          "Haftalık Ziyaretçi Sayısı": 2000,
          "Günlük Sipariş Adedi": 1800,
        },
      ],
    },
    {
      isim: "Aylık Ziyaretçi Sayısı",
      degerler: [
        { isim: "Ocak", "Aylık Ziyaretçi Sayısı": 4000 },
        { isim: "Şubat", "Aylık Ziyaretçi Sayısı": 4500 },
        { isim: "Mart", "Aylık Ziyaretçi Sayısı": 5000 },
      ],
    },
    {
      isim: "Günlük Sipariş Adedi",
      degerler: 120,
    },
    {
      isim: "Günlük Sipariş Adedi",
      degerler: "Yok",
    },
  ];
};

const varsayilanSorguParam: GostergeDurum[] = [
  {
    isim: "Aylık Satışlar",
    grafikTipi: "line",
    degerler: [
      { isim: "Ocak", "Aylık Satışlar": 4000 },
      { isim: "Şubat", "Aylık Satışlar": 3000 },
      { isim: "Mart", "Aylık Satışlar": 5000 },
      { isim: "Nisan", "Aylık Satışlar": 4500 },
      { isim: "Mayıs", "Aylık Satışlar": 6000 },
      { isim: "Haziran", "Aylık Satışlar": 5500 },
      { isim: "Temmuz", "Aylık Satışlar": 4000 },
      { isim: "Ağustos", "Aylık Satışlar": 3000 },
    ],
  },
  {
    isim: "Aylık Satışlar",
    grafikTipi: "bar",
    degerler: [
      { isim: "Ocak", "Aylık Satışlar": 4000 },
      { isim: "Şubat", "Aylık Satışlar": 3000 },
      { isim: "Mart", "Aylık Satışlar": 5000 },
      { isim: "Nisan", "Aylık Satışlar": 4500 },
      { isim: "Mayıs", "Aylık Satışlar": 6000 },
      { isim: "Haziran", "Aylık Satışlar": 5500 },
    ],
  },
];

export const useGosterge = <T extends GostergeDurum>() => {
  const [gostergeler, setGostergeler] = useState<IGosterge<T>[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await grafikAData();

        const yeniGostergeler: IGosterge<T>[] = response.map(
          (gosterge, index) => ({
            gostergeId: `gosterge-${index + 1}`,
            isim: gosterge.isim,
            getNode: (durum: T) => (
              <GostergeOlustur
                durum={{ ...durum}}
              />
            ),
            varsayilanDurum: varsayilanSorguParam[1] as T,
            varsayilanBaslik: <GostergeBasitBaslik gostergeIsim={gosterge.isim} />,
            varsayilanLayout: {
              w: 2,
              h: 3,
              x: 0,
              y: 0,
              i: `gosterge-${index + 1}`,
            },
            getDuzenle: GostergeDuzenle,
          })
        );

        setGostergeler(yeniGostergeler);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setYukleniyor(false);
      }
    })();
  }, []);

  return { gostergeler, yukleniyor };
};
