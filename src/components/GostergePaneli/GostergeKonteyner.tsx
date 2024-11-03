import { ReactNode, useEffect, useRef, useState } from "react";
import GostergeYukleyici from "./GostergeYukleyici";
import { App, Button, Card } from "antd";
import { IGosterge } from "./IGosterge";
import { BiArrowBack } from "react-icons/bi";
import { MdSave } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import ButtonGroup from "antd/es/button/button-group";

const GostergeKonteyner = ({
  gosterge,
  dragHandleSinifAdi,
  kullaniciId,
}: {
  panelId?: string;
  gosterge: IGosterge<any>;
  dragHandleSinifAdi: string;
  kullaniciId: number;
}) => {
  const { message } = App.useApp();
  const suAnkiDurum = useRef(gosterge.varsayilanDurum);

  const [baslik, setBaslik] = useState(
    gosterge.getBaslik
      ? gosterge.getBaslik(suAnkiDurum.current)
      : gosterge.varsayilanBaslik
  );
  const [duzenleniyor, setDuzenleniyor] = useState(false);

  const [gostergeNode, setGostergeNode] = useState<ReactNode>(null);
  const [duzenlenenDurum, setDuzenlenenDurum] = useState<any>();

  useEffect(() => {
    const getDurum = async () => {
      if (gosterge.gostergeId && gosterge.getDuzenle && kullaniciId) {
        try {
          const kullaniciVerisi = localStorage.getItem(`kullanici_${kullaniciId}`);
          if (kullaniciVerisi) {
            const parsedVeri = JSON.parse(kullaniciVerisi);
            const gostergeAyari = parsedVeri[`panel_1_gosterge_${gosterge.gostergeId}`];
            
            if (gostergeAyari) {
              suAnkiDurum.current = gostergeAyari;
              setGostergeNode(gosterge.getNode(suAnkiDurum.current, null));
              setDuzenlenenDurum(suAnkiDurum.current);
              
              if (gosterge.getBaslik) {
                setBaslik(gosterge.getBaslik(gostergeAyari));
              }
            } else {
              setGostergeNode(gosterge.getNode(gosterge.varsayilanDurum, null));
            }
          }
        } catch (error) {
          console.error('Gösterge ayarları yüklenirken hata:', error);
          setGostergeNode(gosterge.getNode(gosterge.varsayilanDurum, null));
        }
      }
    };
    getDurum();
  }, [gosterge, kullaniciId, message]);

  const kaydetGostergeAyarlari = (yeniDurum: any) => {
    if (gosterge.gostergeId && kullaniciId) {
      try {
        const kullaniciVerisi = localStorage.getItem(`kullanici_${kullaniciId}`);
        const mevcutVeri = kullaniciVerisi ? JSON.parse(kullaniciVerisi) : {};
        
        const yeniVeri = {
          ...mevcutVeri,
          [`panel_1_gosterge_${gosterge.gostergeId}`]: yeniDurum
        };

        localStorage.setItem(`kullanici_${kullaniciId}`, JSON.stringify(yeniVeri));
      } catch (error) {
        console.error('Gösterge ayarları kaydedilirken hata:', error);
      }
    }
  };

  const ustKisim = (
    <div className="ust-container">
      <div className={`${dragHandleSinifAdi} ust-baslik`}>{baslik}</div>
      <div className="gosterge-butonlar">
        {gosterge.getDuzenle && (
          <>
            {!duzenleniyor ? (
              <Button
                onClick={() => {
                  setDuzenlenenDurum({ ...suAnkiDurum.current });
                  setDuzenleniyor(true);
                }}
                type="link"
                icon={<FiEdit size={24} />}
              />
            ) : (
              <ButtonGroup>
                <Button
                  title="İptal"
                  onClick={() => setDuzenleniyor(false)}
                  type="link"
                  icon={<BiArrowBack size={24} />}
                />
                <Button
                  title="Kaydet"
                  onClick={() => {
                    setDuzenleniyor(false);
                    setGostergeNode(gosterge.getNode(duzenlenenDurum, suAnkiDurum.current));
                    suAnkiDurum.current = duzenlenenDurum;
                    if (gosterge.getBaslik) {
                      setBaslik(gosterge.getBaslik(suAnkiDurum.current));
                    }
                    kaydetGostergeAyarlari(duzenlenenDurum);
                  }}
                  type="link"
                  icon={<MdSave size={24} />}
                />
              </ButtonGroup>
            )}
          </>
        )}
      </div>
    </div>
  );

  let node: ReactNode = gostergeNode || <GostergeYukleyici />;
  if (duzenleniyor && gosterge.getDuzenle) {
    node = gosterge.getDuzenle({
      durum: duzenlenenDurum,
      setDurum: setDuzenlenenDurum,
    });
  }

  return (
    <div className="gosterge-container">
      <div className="gosterge-ust">{ustKisim}</div>
      <div className="gosterge-icerik">
        <div className="gosterge-icerik-item">
          <Card style={{ height: "100%", border: "none" }}>{node}</Card>
        </div>
      </div>
    </div>
  );
};

export default GostergeKonteyner;
