import GostergeBasitBaslik from "./GostergeBasitBaslik";
import { IGosterge, IGostergeDuzenleProps } from "./IGosterge";
import { ReactNode, useEffect, useState } from "react";
import { GostergeGrafikIcerikOlustur } from "./GostergeGrafikIcerikOlustur";
import { GostergeMetinIcerikOlustur } from "./GostergeMetinIcerikOlustur";
import GostergeMetinDuzenle from "./GostergeMetinDuzenle";
import GostergeGrafikDuzenle from "./GostergeGrafikDuzenle";

export interface GostergeMetinDurum {
  isim?: string;
  metin?: string;
}

export interface GostergeSayiDurum {
  isim?: string;
  sayi?: number;
}

export interface GostergeGrafikDurum {
  isim?: string;
  data?: any;
  grafikTipi?: string;
  grafikCizimTipi?: Record<string, string>;
  xEkseniVeriAnahtari?: string;
}

const GostergeDataYukleyici = <TData,>({
  dataYukleAsync,
  getNode,
}: {
  dataYukleAsync: () => Promise<TData>;
  getNode: (data: TData) => ReactNode;
}) => {
  const [data, setData] = useState<TData>();
  useEffect(() => {
    const loadData = async () => {
      const d = await dataYukleAsync();
      setData(d);
    };

    loadData();

    return () => {
      // cancel token iptal işlemleri buraya gelebilir
    };
  }, [dataYukleAsync]);

  return <>{data ? getNode(data) : <></>}</>;
};

const getUlkeNufusMetinAsync = async (filtre: GostergeMetinDurum) => {
  return "Türkiye";
};

const getUlkeNufusSayiAsync = async (filtre: GostergeSayiDurum) => {
  return 10000000;
};

const getUlkeNufusGrafikAsync = async (filtre: GostergeGrafikDurum) => {
  return [
    { ulke: "Türkiye", kita: "Avrupa", dogum: 5000, olum: 2020 },
    { ulke: "Suriye", kita: "Asya", dogum: 2500, olum: 1900 },
  ];
};

export const gostergeMetin: IGosterge<GostergeMetinDurum> = {
  gostergeId: "3",
  getBaslik: (durum) => <GostergeBasitBaslik>{durum.isim || "Gösterge"}</GostergeBasitBaslik>,
  varsayilanDurum: { metin: undefined },
  getNode: (durum) => (
    <GostergeDataYukleyici
      dataYukleAsync={() => getUlkeNufusMetinAsync(durum)}
      getNode={(data) => (
        <GostergeMetinIcerikOlustur data={data} durum={durum} />
      )}
    />
  ),
  getDuzenle: function (gdp: IGostergeDuzenleProps<GostergeMetinDurum>): ReactNode {
    return <GostergeMetinDuzenle {...gdp} />;
  },
};

export const gostergeSayi: IGosterge<GostergeSayiDurum> = {
  gostergeId: "4",
  getBaslik: (durum) => <GostergeBasitBaslik>{durum.isim || "Gösterge"}</GostergeBasitBaslik>,
  varsayilanDurum: { sayi: undefined },
  getNode: (durum) => (
    <GostergeDataYukleyici
      dataYukleAsync={() => getUlkeNufusSayiAsync(durum)}
      getNode={(data) => (
        <GostergeMetinIcerikOlustur data={data} durum={durum} />
      )}
    />
  ),
  getDuzenle: function (gdp: IGostergeDuzenleProps<GostergeMetinDurum>): ReactNode {
    return <GostergeMetinDuzenle {...gdp} />;
  },
};

export const gostergeGrafik: IGosterge<GostergeGrafikDurum> = {
  gostergeId: "5",
  getBaslik: (durum) => <GostergeBasitBaslik>{durum.isim || "Gösterge"}</GostergeBasitBaslik>,
  varsayilanDurum: { grafikTipi: "bar", xEkseniVeriAnahtari: "ulke" },
  getNode: (durum) => (
    <GostergeDataYukleyici
      dataYukleAsync={() => getUlkeNufusGrafikAsync(durum)}
      getNode={(data) => (
        <GostergeGrafikIcerikOlustur data={data} durum={durum} />
      )}
    />
  ),
  getDuzenle: ({ durum, setDurum }) => (
    <GostergeDataYukleyici
      dataYukleAsync={() => getUlkeNufusGrafikAsync(durum)}
      getNode={(data) => (
        <GostergeGrafikDuzenle durum={durum} setDurum={setDurum} data={data} />
      )}
    />
  ),
  /* getDuzenle: function (gdp: IGostergeDuzenleProps<GostergeGrafikDurum>): ReactNode {
    return <GostergeGrafikDuzenle data={gdp.durum.data || []} {...gdp} />;
  }, */
};
