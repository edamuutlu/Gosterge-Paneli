import GostergeBasitBaslik from "./GostergeBasitBaslik";
import { IGosterge } from "./IGosterge";
import GostergeDuzenle from "./GostergeDuzenle"; 
import { ReactNode, useEffect, useMemo, useState } from "react";
import { GostergeDurum, GostergeIcerikOlustur } from "./GostergeIcerikOlustur";

type Ulkeler = {
  ulkeIsmi: string;
  nufus: number;
};

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


type GostergeNufusSayisiDurumString = GostergeDurum & {
  gosterilenUlkeler?: string;
};

const getUlkeNufusStringAsync = async (
  filtre: GostergeNufusSayisiDurumString
) => {
  return "Türkiye";
};


type GostergeNufusSayisiDurumNumber = GostergeDurum & {
  gosterilenNufus?: number;
}
const getUlkeNufusNumberAsync = async (
  filtre: GostergeNufusSayisiDurumNumber
) => {
  return 10000000;
};


type GostergeNufusSayisiDurumGrafik = GostergeDurum & {
  gosterilenUlkeler?: Ulkeler[];
};

const getUlkeNufusGrafikAsync = async (filtre: GostergeNufusSayisiDurumGrafik) => {
  return [
    { ulke: "Türkiye", nufus: 100000000 },
    { ulke: "Suriye", nufus: 24000000 },
  ];
};


const gostergeNufusSayisiString: IGosterge<GostergeNufusSayisiDurumString> = {
  gostergeId: "3",
  getBaslik: (durum) => (
    <GostergeBasitBaslik gostergeIsim={durum.isim ? durum.isim : "Gosterge"} />
  ),
  varsayilanDurum: { gosterilenUlkeler: undefined },
  getNode: (durum) => (
    <GostergeDataYukleyici
      dataYukleAsync={() => getUlkeNufusStringAsync(durum)}
      getNode={(data) => <GostergeIcerikOlustur data={data} durum={durum} />}
    />
  ),
  getDuzenle: ({ durum, setDurum }) => (
    <GostergeDuzenle durum={durum} setDurum={setDurum} /> 
  ),
};

const gostergeNufusSayisiNumber: IGosterge<GostergeNufusSayisiDurumNumber> = {
  gostergeId: "4",
  getBaslik: (durum) => (
    <GostergeBasitBaslik gostergeIsim={durum.isim ? durum.isim : "Gosterge"} />
  ),
  varsayilanDurum: { gosterilenNufus: undefined },
  getNode: (durum) => (
    <GostergeDataYukleyici
      dataYukleAsync={() => getUlkeNufusNumberAsync(durum)}
      getNode={(data) => <GostergeIcerikOlustur data={data} durum={durum} />}
    />
  ),
  getDuzenle: ({ durum, setDurum }) => (
    <GostergeDuzenle durum={durum} setDurum={setDurum} />
  ),
};

const gostergeNufusSayisiGrafik: IGosterge<GostergeNufusSayisiDurumGrafik> = {
  gostergeId: "5",
  getBaslik: (durum) => (
    <GostergeBasitBaslik gostergeIsim={durum.isim ? durum.isim : "Gosterge"} />
  ),
  varsayilanDurum: { gosterilenUlkeler: undefined, grafikTipi: "bar" },
  getNode: (durum) => (
    <GostergeDataYukleyici
      dataYukleAsync={() => getUlkeNufusGrafikAsync(durum)}
      getNode={(data) => <GostergeIcerikOlustur data={data} durum={durum} />}
    />
  ),
  getDuzenle: ({ durum, setDurum }) => (
    <GostergeDuzenle durum={durum} setDurum={setDurum} />
  ),
};

export const GostergeleriYukle = () => {
  const gostergeler = useMemo<IGosterge<any>[]>(() => {
    return [
      gostergeNufusSayisiString,
      gostergeNufusSayisiNumber,
      gostergeNufusSayisiGrafik,
    ];
  }, []);

  return { gostergeler };
};
