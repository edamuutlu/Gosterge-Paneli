import GostergeBasitBaslik from "./GostergeBasitBaslik";
import { IGosterge } from "./IGosterge";
import GostergeDuzenle from "./GostergeDuzenle";
import { ReactNode, useEffect, useState } from "react";
import { GostergeDurum, GostergeIcerikOlustur } from "./GostergeIcerikOlustur";

type Ulke = {
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
};
const getUlkeNufusNumberAsync = async (
  filtre: GostergeNufusSayisiDurumNumber
) => {
  return 10000000;
};

type GostergeNufusSayisiDurumGrafik = GostergeDurum & {
  gosterilenUlkeler?: Ulke[];
};

const getUlkeNufusGrafikAsync = async (
  filtre: GostergeNufusSayisiDurumGrafik
) => {
  return [
    { ulke: "Türkiye", kita: "Avrupa", dogum: 5000, olum: 2020 },
    { ulke: "Suriye", kita: "Asya", dogum: 2500, olum: 1900 },
  ];
};

export const gostergeNufusSayisiString: IGosterge<GostergeNufusSayisiDurumString> =
  {
    gostergeId: "3",
    getBaslik: (durum) => <GostergeBasitBaslik durum={durum} />,
    varsayilanDurum: { gosterilenUlkeler: undefined },
    getNode: (durum) => (
      <GostergeDataYukleyici
        dataYukleAsync={() => getUlkeNufusStringAsync(durum)}
        getNode={(data) => <GostergeIcerikOlustur data={data} durum={durum} />}
      />
    ),
    getDuzenle: ({ durum, setDurum }) => (
      <GostergeDataYukleyici
        dataYukleAsync={() => getUlkeNufusStringAsync(durum)}
        getNode={(data) => (
          <GostergeDuzenle durum={durum} setDurum={setDurum} data={data} />
        )}
      />
    ),
  };

export const gostergeNufusSayisiNumber: IGosterge<GostergeNufusSayisiDurumNumber> =
  {
    gostergeId: "4",
    getBaslik: (durum) => <GostergeBasitBaslik durum={durum} />,
    varsayilanDurum: { gosterilenNufus: undefined },
    getNode: (durum) => (
      <GostergeDataYukleyici
        dataYukleAsync={() => getUlkeNufusNumberAsync(durum)}
        getNode={(data) => <GostergeIcerikOlustur data={data} durum={durum} />}
      />
    ),
    getDuzenle: ({ durum, setDurum }) => (
      <GostergeDataYukleyici
        dataYukleAsync={() => getUlkeNufusNumberAsync(durum)}
        getNode={(data) => (
          <GostergeDuzenle durum={durum} setDurum={setDurum} data={data} />
        )}
      />
    ),
  };

export const gostergeNufusSayisiGrafik: IGosterge<GostergeNufusSayisiDurumGrafik> =
  {
    gostergeId: "5",
    getBaslik: (durum) => <GostergeBasitBaslik durum={durum} />,
    varsayilanDurum: {
      gosterilenUlkeler: undefined,
      grafikTipi: "bar",
      xEkseniVeriAnahtari: "ulke",
    },
    getNode: (durum) => (
      <GostergeDataYukleyici
        dataYukleAsync={() => getUlkeNufusGrafikAsync(durum)}
        getNode={(data) => <GostergeIcerikOlustur data={data} durum={durum} />}
      />
    ),
    getDuzenle: ({ durum, setDurum }) => (
      <GostergeDataYukleyici
        dataYukleAsync={() => getUlkeNufusGrafikAsync(durum)}
        getNode={(data) => (
          <GostergeDuzenle durum={durum} setDurum={setDurum} data={data} />
        )}
      />
    ),
  };
