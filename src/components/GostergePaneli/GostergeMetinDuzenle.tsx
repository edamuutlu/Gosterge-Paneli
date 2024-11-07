import { Card, Form, Input, Space } from "antd";
import { IGostergeDuzenleProps } from "./IGosterge";
import { GostergeMetinDurum } from "./useGostergeleriYukle";

const GostergeMetinDuzenle = ({ durum, setDurum }: IGostergeDuzenleProps<GostergeMetinDurum>) => {
  return (
    <Card>
      <Form layout="vertical">
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Form.Item label="Gösterge Başlığı" required>
            <Input
              value={durum.isim || ""}
              onChange={e =>
                setDurum(p => {
                  p.isim = e.target.value;
                  return { ...p };
                })
              }
              placeholder="Gösterge başlığını giriniz"
            />
          </Form.Item>
        </Space>
      </Form>
    </Card>
  );
};

export default GostergeMetinDuzenle;
