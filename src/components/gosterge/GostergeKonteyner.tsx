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
}: {
  panelId?: string;
  gosterge: IGosterge<any>;
  dragHandleSinifAdi: string;
}) => {
  const { message } = App.useApp();
  const suAnkiDurum = useRef(gosterge.varsayilanDurum);

  const [baslik, setBaslik] = useState(gosterge.getBaslik ? gosterge.getBaslik(suAnkiDurum.current) : gosterge.varsayilanBaslik);
  const [duzenleniyor, setDuzenleniyor] = useState(false);
  
  const [gostergeNode, setGostergeNode] = useState<ReactNode>(null);
  const [duzenlenenDurum, setDuzenlenenDurum] = useState<any>();
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const getDurum = async () => {
      if (gosterge.gostergeId) {
        try {
          setYukleniyor(true);
          
          const r = localStorage.getItem(`panel_${1}_gosterge_${gosterge.gostergeId}`);
          
          if (r) {
            suAnkiDurum.current = JSON.parse(r);
          } else {
            suAnkiDurum.current = gosterge.varsayilanDurum;
          }
  
          localStorage.removeItem(`panel_${1}_gosterge_${gosterge.gostergeId}`);
  
          setGostergeNode(gosterge.getNode(suAnkiDurum.current, null));
          setDuzenlenenDurum(suAnkiDurum.current);
        } catch (error) {
          console.error('Gösterge ayar yüklenemedi:', error);
          message.error('Gösterge ayar yüklenemedi');
          suAnkiDurum.current = gosterge.varsayilanDurum;
          setGostergeNode(gosterge.getNode(gosterge.varsayilanDurum, null));
        } finally {
          setYukleniyor(false);
        }
      }
    };
    
    getDurum();
  }, [gosterge, message]);
  

  useEffect(() => {
    if (!yukleniyor) {
      setGostergeNode(gosterge.getNode(duzenleniyor ? duzenlenenDurum : suAnkiDurum.current, null));
    }
  }, [duzenlenenDurum, duzenleniyor, gosterge, yukleniyor]);

  useEffect(() => {
    if (duzenleniyor) {
      setGostergeNode(gosterge.getNode(duzenlenenDurum, null));
    }
  }, [duzenlenenDurum, duzenleniyor, gosterge]);

  const ustKisim = (
    <div className="ust-container">
      <div className={`${dragHandleSinifAdi} ust-baslik`}>
          {baslik}
      </div>
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
                icon={<FiEdit size={24}/>}
              />
            ) : (
                <ButtonGroup>
                  <Button
                    title="İptal"
                    onClick={() => setDuzenleniyor(false)}
                    type="link"
                    icon={<BiArrowBack size={24}/>}
                  />
                  <Button
                    title="Kaydet"
                    onClick={() => {
                      setDuzenleniyor(false);
                      setGostergeNode(gosterge.getNode(duzenlenenDurum, suAnkiDurum.current));
                      suAnkiDurum.current = duzenlenenDurum;
                      if (gosterge.getBaslik) setBaslik(gosterge.getBaslik(suAnkiDurum.current));
                     
                      if (gosterge.gostergeId) {
                        localStorage.setItem(
                          `panel_${1}_gosterge_${gosterge.gostergeId}`,
                          JSON.stringify(suAnkiDurum.current)
                        );
                      }
                    }}
                    type="link"
                    icon={<MdSave size={24}/>}
                  />
                </ButtonGroup>
            )}
          </>
        )}
      </div>
    </div>
  );

  let node: ReactNode = yukleniyor ? <GostergeYukleyici /> : gostergeNode;
  if (duzenleniyor && gosterge.getDuzenle) {
    node = gosterge.getDuzenle({
      durum: duzenlenenDurum,
      setDurum: setDuzenlenenDurum,
    });
  }
  return (
    <div className="gosterge-container">
      <div className="gosterge-ust">{ustKisim}</div>
      <div className={"gosterge-icerik"}>
        <div className="gosterge-icerik-item">
          <Card
            style={{ height: "100%", border: "none" }}
          >
            {node}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GostergeKonteyner;
