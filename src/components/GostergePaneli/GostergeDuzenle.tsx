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
  const isGrafikDurum = "grafikTipi" in durum && durum.grafikTipi !== "yok";
  const numericKeys = data?.length > 0 ? Object.keys(data[0]).filter(key => typeof data[0][key] === "number") : [];
  const allowComposedOption = numericKeys.length >= 2;
  const xAxisDataKeys = data?.length > 0 ? Object.keys(data[0]).filter(key => typeof data[0][key] === "string") : [];

  const handleBaslikDegisim = (yeniBaslik: string) => {
    setDurum({ ...durum, isim: yeniBaslik });
  };

  const handleGrafikTipiDegisim = (yeniTip: string) => {
    if (isGrafikDurum) {
      let yeniXAxisDataKey = durum.xAxisDataKey;
      if (!xAxisDataKeys.includes(durum.xAxisDataKey!)) {
        yeniXAxisDataKey = xAxisDataKeys[0] || "";
      }
      setDurum({ ...durum, grafikTipi: yeniTip as any, grafikCizimTipi: yeniTip === "composed" ? {} : undefined, xAxisDataKey: yeniXAxisDataKey });
    }
  };

  const handleXAxisDataKeyDegisim = (yeniKey: string) => {
    setDurum({ ...durum, xAxisDataKey: yeniKey });
  };

  const handleTekGrafikTipiDegisim = (key: string, yeniTip: string) => {
    if (durum.grafikTipi === "composed") {
      setDurum({ ...durum, grafikCizimTipi: { ...(durum.grafikCizimTipi || {}), [key]: yeniTip as any } });
    }
  };

  return (
    <Card>
      <Form layout="vertical">
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Form.Item label="Gösterge Başlığı" required>
            <Input
              value={durum.isim || ""}
              onChange={(e) => handleBaslikDegisim(e.target.value)}
              placeholder="Gösterge başlığını giriniz"
            />
          </Form.Item>

          {isGrafikDurum && (
            <Form.Item label="Grafik Tipi" required>
              <Select
                value={durum.grafikTipi}
                onChange={handleGrafikTipiDegisim}
                style={{ width: "100%" }}
              >
                <Option value="bar">Bar Grafik</Option>
                <Option value="line">Çizgi Grafik</Option>
                <Option value="area">Alan Grafik</Option>
                {allowComposedOption && (
                  <Option value="composed">Karma Grafik</Option>
                )}
              </Select>
            </Form.Item>
          )}

          {isGrafikDurum && (
            <Form.Item label="X Ekseni Değeri" required>
              <Select
                value={durum.xAxisDataKey}
                onChange={handleXAxisDataKeyDegisim}
                style={{ width: "100%" }}
              >
                {xAxisDataKeys.map((key) => (
                  <Option key={key} value={key}>
                    {key}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {isGrafikDurum && durum.grafikTipi === "composed" && (
            <Card
              size="small"
              title="Grafik Bileşenleri"
              style={{ marginTop: 16 }}
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                {numericKeys.map((key) => (
                  <Form.Item
                    key={key}
                    label={`${key} için Grafik Tipi`}
                    required
                  >
                    <Select
                      value={durum.grafikCizimTipi?.[key] || "line"}
                      onChange={(value) =>
                        handleTekGrafikTipiDegisim(key, value)
                      }
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
        </Space>
      </Form>
    </Card>
  );
};

export default GostergeDuzenle;
