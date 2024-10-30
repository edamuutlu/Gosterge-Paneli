import GostergeBasitBaslik from "./GostergeBasitBaslik";
import { IGosterge } from "./IGosterge";
import GostergeDuzenle from "./GostergeDuzenle";
import { ReactNode, useEffect, useState } from "react";
import { GostergeDurum, GostergeIcerikOlustur, GrafikTipi } from "./GostergeIcerikOlustur";

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
};
const getUlkeNufusNumberAsync = async (
  filtre: GostergeNufusSayisiDurumNumber
) => {
  return 10000000;
};

type GostergeNufusSayisiDurumGrafik = GostergeDurum & {
  gosterilenUlkeler?: Ulkeler[];
};

const getUlkeNufusGrafikAsync = async (
  filtre: GostergeNufusSayisiDurumGrafik
) => {
  return [
    { ulke: "Türkiye", kita: "Avrupa", nufus: 1000, yil: 2020 },
    { ulke: "Suriye", kita: "Asya", nufus: 2400, yil: 1900 },
  ];
};

const getUlkeNufusGrafikAsync2 = async (
  filtre: GostergeNufusSayisiDurumGrafik
) => {
  return [
    { ulke: "Türkiye", nufus: 1000 },
    { ulke: "Suriye", nufus: 2400 },
  ];
};

export const gostergeNufusSayisiString: IGosterge<GostergeNufusSayisiDurumString> =
  {
    gostergeId: "3",
    getBaslik: (durum) => (
      <GostergeBasitBaslik
        gostergeIsim={durum.isim ? durum.isim : "Gosterge"}
        grafikTipi={durum.grafikTipi as GrafikTipi}
      />
    ),
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
          <GostergeDuzenle 
            durum={durum} 
            setDurum={setDurum} 
            data={data} 
          />
        )}
      />
    ),
  };

export const gostergeNufusSayisiNumber: IGosterge<GostergeNufusSayisiDurumNumber> =
  {
    gostergeId: "4",
    getBaslik: (durum) => (
      <GostergeBasitBaslik
        gostergeIsim={durum.isim ? durum.isim : "Gosterge"}
        grafikTipi={durum.grafikTipi as GrafikTipi}
      />
    ),
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
          <GostergeDuzenle 
            durum={durum} 
            setDurum={setDurum} 
            data={data} 
          />
        )}
      />
    ),
  };

  export const gostergeNufusSayisiGrafik: IGosterge<GostergeNufusSayisiDurumGrafik> = {
    gostergeId: "5",
    getBaslik: (durum) => (
      <GostergeBasitBaslik gostergeIsim={durum.isim ? durum.isim : "Gosterge"} grafikTipi={durum.grafikTipi as GrafikTipi}/>
    ),
    varsayilanDurum: { gosterilenUlkeler: undefined, grafikTipi: "bar", xAxisDataKey: "ulke" },
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
          <GostergeDuzenle 
            durum={durum} 
            setDurum={setDurum} 
            data={data} 
          />
        )}
      />
    ),
  };
  
