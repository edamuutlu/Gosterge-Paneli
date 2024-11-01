import { useEffect, useState } from "react";
import { IGosterge } from "./IGosterge";

export const useKullaniciVerisiYukleyici = (
    kullaniciId: number | null,
    varsayilanGostergeler: Array<{ gosterge: IGosterge<any> }>
  ) => {
    const [secilenGostergeler, setSecilenGostergeler] = useState<IGosterge<any>[]>([]);
    const [yukleniyor, setYukleniyor] = useState(false);
    const [hata, setHata] = useState<Error | null>(null);
  
    useEffect(() => {
      const veriyiYukle = async () => {
        if (kullaniciId === null) return;
  
        setYukleniyor(true);
        setHata(null);
  
        try {
          // Asenkron veri yükleme işlemi
          const kullaniciVerisi = await new Promise<string | null>((resolve) => {
            setTimeout(() => {
              resolve(localStorage.getItem(`kullanici_${kullaniciId}`));
            }, 0);
          });
  
          if (kullaniciVerisi) {
            const { seciliGostergeler } = JSON.parse(kullaniciVerisi);
            
            if (seciliGostergeler) {
              const yuklenenGostergeler = varsayilanGostergeler
                .map(item => item.gosterge)
                .filter(gosterge => seciliGostergeler.includes(gosterge.gostergeId));
              
              setSecilenGostergeler(yuklenenGostergeler);
            }
          }
        } catch (error) {
          console.error('Kullanıcı verisi yüklenirken hata oluştu:', error);
          setHata(error instanceof Error ? error : new Error('Bilinmeyen hata oluştu'));
        } finally {
          setYukleniyor(false);
        }
      };
  
      veriyiYukle();
    }, [kullaniciId, varsayilanGostergeler]);
  
    return { secilenGostergeler, setSecilenGostergeler, yukleniyor, hata };
  };