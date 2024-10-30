import { Form, Input, Select, Space } from 'antd';
import { GostergeDurum } from './GostergeIcerikOlustur';

interface GostergeDuzenleProps<T extends GostergeDurum> {
  durum: T;
  setDurum: (yeniDurum: T) => void;
}

const GostergeDuzenle = <T extends GostergeDurum>({ 
  durum, 
  setDurum 
}: GostergeDuzenleProps<T>) => {
  let isGrafikDurum: boolean = 'grafikTipi' in durum && durum.grafikTipi !== "yok";

  const handleBaslikDegisim = (yeniBaslik: string) => {
    setDurum({
      ...durum,
      isim: yeniBaslik
    });
  };

  const handleGrafikTipiDegisim = (yeniTip: string) => {
    if (isGrafikDurum) {
      setDurum({
        ...durum,
        grafikTipi: yeniTip
      });
    }
  };

  return (
    <Space direction="vertical" className="w-full p-4">
      <Form layout="vertical" className="w-full">
        <Form.Item 
          label="Gösterge Başlığı" 
          className="mb-4"
        >
          <Input
            value={durum.isim || ''}
            onChange={(e) => handleBaslikDegisim(e.target.value)}
            placeholder="Gösterge başlığını giriniz"
            className="w-full"
          />
        </Form.Item>

        {isGrafikDurum && (
          <Form.Item 
            label="Grafik Tipi" 
            className="mb-4"
          >
            <Select
              value={durum.grafikTipi}
              onChange={handleGrafikTipiDegisim}
              className="w-full"
            >
              <Select.Option value="bar">Bar Grafik</Select.Option>
              <Select.Option value="line">Çizgi Grafik</Select.Option>
              <Select.Option value="area">Alan Grafik</Select.Option>
            </Select>
          </Form.Item>
        )}
      </Form>
    </Space>
  );
};

export default GostergeDuzenle;