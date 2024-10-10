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

  useEffect(() => {
    const getDurum = async () => {
      if (gosterge.gostergeId && gosterge.getDuzenle) {
        try {
          const r = localStorage.getItem(
            `panel_${1}_gosterge_${gosterge.gostergeId}`
          );
          if (r) {
            const parsedDurum = JSON.parse(r);
            suAnkiDurum.current = parsedDurum;
            if (gosterge.getBaslik) {
              setBaslik(gosterge.getBaslik(parsedDurum));
            }
            setGostergeNode(
              gosterge.getNode(suAnkiDurum.current, null, yukseklik)
            );
            setDuzenlenenDurum(suAnkiDurum.current);
          } else {
            setGostergeNode(
              gosterge.getNode(gosterge.varsayilanDurum, null, yukseklik)
            );
          }
        } catch (error) {
          message.error('Gösterge ayar yüklenemedi');
          setGostergeNode(
            gosterge.getNode(gosterge.varsayilanDurum, null, yukseklik)
          );
        }
      }
    };
    getDurum();
  }, [gosterge, message, yukseklik]);

  useEffect(() => {
    if (duzenleniyor) {
      setGostergeNode(gosterge.getNode(duzenlenenDurum, null, yukseklik));
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
                      suAnkiDurum.current = duzenlenenDurum;
                      if (gosterge.getBaslik)
                        setBaslik(gosterge.getBaslik(suAnkiDurum.current));
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
      <div className="gosterge-icerik">
        <div className="gosterge-icerik-item">
          <Card
            style={{ height: (yukseklik ?? 0) - 100 }}
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