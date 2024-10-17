import { ReactNode, useEffect, useRef, useState } from "react";
import GostergeYukleyici from "./GostergeYukleyici";
import GostergeBasitBaslik from "./GostergeBasitBaslik";
import { App, Button, Card, Divider, Tag } from "antd";
import { IGosterge } from "./IGosterge";
import { BiArrowBack } from "react-icons/bi";
import { MdEdit, MdSave } from "react-icons/md";
import ButtonGroup from "antd/es/button/button-group";

const GostergeKonteyner = ({
  gosterge,
  dragHandleSinifAdi,
  yukseklik,
}: {
  panelId?: string;
  gosterge: IGosterge<any>;
  dragHandleSinifAdi: string;
  yukseklik?: number;
}) => {

  const { message } = App.useApp();
  const suAnkiDurum = useRef(gosterge.varsayilanDurum);

  const [baslik, setBaslik] = useState(gosterge.getBaslik ? gosterge.getBaslik(suAnkiDurum.current) : gosterge.varsayilanBaslik);
  const [duzenleniyor, setDuzenleniyor] = useState(false);
  
  const [gostergeNode, setGostergeNode] = useState<ReactNode>(<GostergeYukleyici />);
  const [duzenlenenDurum, setDuzenlenenDurum] = useState<any>();

  const MINIMUM_YUKSEKLIK = 300; 

  useEffect(() => {
    const getDurum = async () => {
      if (gosterge.gostergeId && gosterge.getDuzenle) {
        try {
          const r = localStorage.getItem(
            `panel_${1}_gosterge_${gosterge.gostergeId}`
          );
          if (r) {
            suAnkiDurum.current = JSON.parse(r);
            setGostergeNode(
              gosterge.getNode(suAnkiDurum.current, null, Math.max(yukseklik || 0, MINIMUM_YUKSEKLIK))
            );
            setDuzenlenenDurum(suAnkiDurum.current);
          } else {
            setGostergeNode(
              gosterge.getNode(gosterge.varsayilanDurum, null, Math.max(yukseklik || 0, MINIMUM_YUKSEKLIK))
            );
          }
        } catch (error) {
          message.error('Gösterge ayar yüklenemedi');
          setGostergeNode(
            gosterge.getNode(gosterge.varsayilanDurum, null, Math.max(yukseklik || 0, MINIMUM_YUKSEKLIK))
          );
        }
      }
    };
    getDurum();
  }, [gosterge, message, yukseklik]);

  useEffect(() => {
    if (duzenleniyor) {
      setGostergeNode(gosterge.getNode(duzenlenenDurum, null, Math.max(yukseklik || 0, MINIMUM_YUKSEKLIK)));
    }
  }, [yukseklik, duzenlenenDurum, duzenleniyor, gosterge]);

  const ustKisim = (
    <div className="ust-container">
      <div className={`${dragHandleSinifAdi} ust-baslik`}>
        <GostergeBasitBaslik>{baslik}</GostergeBasitBaslik>
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
                icon={<MdEdit size={20}/>}
              />
            ) : (
              <div className="flex">
                <ButtonGroup>
                  <Button
                    title="İptal"
                    onClick={() => setDuzenleniyor(false)}
                    type="link"
                    icon={<BiArrowBack size={20}/>}
                  />
                  <Button
                    title="Kaydet"
                    onClick={() => {
                      setDuzenleniyor(false);
                      setGostergeNode(gosterge.getNode(duzenlenenDurum, null, suAnkiDurum.current));
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
                    icon={<MdSave size={20}/>}
                  />
                </ButtonGroup>
              </div>
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
      {gosterge.isim && (
        <span className="gosterge-baslik">
          <Tag color="#108ee9">{gosterge.isim}</Tag>
        </span>
      )}
      <div className="gosterge-ust">{ustKisim}</div>
      <Divider style={{margin:0}}/>
      <div className={(yukseklik ?? 0) > 650 ? "gosterge-icerik-hidden":"gosterge-icerik"}>
        <div className="gosterge-icerik-item">
          <Card
            style={{ height: Math.max((yukseklik ?? 0) - 100, MINIMUM_YUKSEKLIK - 100) }}
            title={gosterge.isim}
          >
            {node}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GostergeKonteyner;
