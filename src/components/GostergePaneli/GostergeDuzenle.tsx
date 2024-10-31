import { ReactElement } from "react";
import { Form, Input, Select, Card, Space } from "antd";
import { GostergeDurum } from "./GostergeIcerikOlustur";

const { Option } = Select;

interface GostergeDuzenleProps<T extends GostergeDurum> {
  durum: T;
  setDurum: (yeniDurum: T) => void;
  data?: any;
}

const GostergeDuzenle = <T extends GostergeDurum>({
  durum,
  setDurum,
  data,
}: GostergeDuzenleProps<T>): ReactElement => {
  const grafikVarMi = "grafikTipi" in durum && durum.grafikTipi !== "yok";
  const sayisalAnahtarlar = data?.length > 0 ? Object.keys(data[0]).filter(key => typeof data[0][key] === "number") : [];
  const karmaGrafikMi = sayisalAnahtarlar.length >= 2;
  const xEkseniAnahtarlar = data?.length > 0 ? Object.keys(data[0]).filter(key => typeof data[0][key] === "string") : [];

  const grafikTipiDegistir = (yeniTip: string) => {
    if (!grafikVarMi) return;
    
    // Geçerli x ekseni anahtarı yoksa, ilk string anahtarı kullan
    const yeniXAxisDataKey = xEkseniAnahtarlar.includes(durum.xEkseniVeriAnahtari!) 
      ? durum.xEkseniVeriAnahtari 
      : xEkseniAnahtarlar[0] || "";

    setDurum({ 
      ...durum, 
      grafikTipi: yeniTip as any,
      grafikCizimTipi: yeniTip === "composed" ? {} : undefined,
      xEkseniVeriAnahtari: yeniXAxisDataKey 
    });
  };

  return (
    <Card>
      <Form layout="vertical">
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Form.Item label="Gösterge Başlığı" required>
            <Input
              value={durum.isim || ""}
              onChange={(e) => setDurum({ ...durum, isim: e.target.value })} 
              placeholder="Gösterge başlığını giriniz"
            />
          </Form.Item>

          {grafikVarMi && (
            <>
              <Form.Item label="X Ekseni Değeri" required>
                <Select
                  value={durum.xEkseniVeriAnahtari}
                  onChange={(yeniKey) => setDurum({ ...durum, xEkseniVeriAnahtari: yeniKey })}
                  style={{ width: "100%" }}
                >
                  {xEkseniAnahtarlar.map((key) => (
                    <Option key={key} value={key}>{key}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item label="Grafik Tipi" required>
                <Select
                  value={durum.grafikTipi}
                  onChange={grafikTipiDegistir}
                  style={{ width: "100%" }}
                >
                  <Option value="bar">Bar Grafik</Option>
                  <Option value="line">Çizgi Grafik</Option>
                  <Option value="area">Alan Grafik</Option>
                  {karmaGrafikMi && <Option value="composed">Karma Grafik</Option>}
                </Select>
              </Form.Item>

              {durum.grafikTipi === "composed" && (
                <Card size="small" title="Grafik Bileşenleri" style={{ marginTop: 16 }}>
                  <Space direction="vertical" style={{ width: "100%" }} size="middle">
                    {sayisalAnahtarlar.map((key) => (
                      <Form.Item key={key} label={`${key} için Grafik Tipi`} required>
                        <Select
                          value={durum.grafikCizimTipi?.[key] || "line"}
                          onChange={(value) => setDurum({
                            ...durum,
                            grafikCizimTipi: { ...(durum.grafikCizimTipi || {}), [key]: value }
                          })}
                          style={{ width: "100%" }}
                        >
                          <Option value="bar">Bar Grafik</Option>
                          <Option value="line">Çizgi Grafik</Option>
                          <Option value="area">Alan Grafik</Option>
                        </Select>
                      </Form.Item>
                    ))}
                  </Space>
                </Card>
              )}
            </>
          )}
        </Space>
      </Form>
    </Card>
  );
};

export default GostergeDuzenle;