import { ReactElement, useState } from "react";
import { ResponsiveContainer, ComposedChart, Line, Bar, Area, CartesianGrid, XAxis, YAxis, Tooltip, 
  Legend, TooltipProps, DefaultTooltipContent} from "recharts";
import { Alert, Button, Modal, Typography } from "antd";

export type GrafikTipi = "line" | "bar" | "area" | "composed" | "yok";

export interface GostergeDurum {
  isim?: string;
  grafikTipi?: GrafikTipi;
  grafikCizimTipi?: Record<string, GrafikTipi>;
  xAxisDataKey?: string;
}

const grafikKomponentleri = {
  line: (key: string, index: number) => (
    <Line
      key={key}
      dataKey={key}
      type="monotone"
      strokeWidth={3}
      stroke={defaultColors[index % defaultColors.length]}
    />
  ),
  bar: (key: string, index: number) => (
    <Bar
      key={key}
      dataKey={key}
      barSize={50}
      fill={defaultColors[index % defaultColors.length]}
    />
  ),
  area: (key: string, index: number) => (
    <Area
      key={key}
      dataKey={key}
      type="monotone"
      fill={defaultColors[index % defaultColors.length]}
      stroke={defaultColors[(index + 1) % defaultColors.length]}
      fillOpacity={0.3}
    />
  ),
};

const defaultColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#387908"];

const CustomToolTip = ({
  active,
  payload,
  label,
  setIsModalVisible,
  ...props
}: TooltipProps<any, any> & {
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  return (
    <div className="custom-tooltip">
      <DefaultTooltipContent
        {...props}
        contentStyle={{ border: "none" }}
        payload={payload}
        label={label}
      />
      <Button type="primary" onClick={showModal}>
        Detayları Gör
      </Button>
    </div>
  );
};

export const GostergeIcerikOlustur = <T extends GostergeDurum, TData>({
  durum,
  data,
}: {
  durum: T;
  data: TData;
}): ReactElement => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const xAxisKey = durum.xAxisDataKey || "ulke";

  if (!durum.isim) {
    durum.isim = "Gosterge";
  }

  if (!data) {
    return (
      <Alert
        message="Veri Yok"
        description={`${durum.isim} için gösterilecek veri bulunamadı.`}
        type="warning"
        showIcon
      />
    );
  }

  if (!durum.grafikTipi) {
    durum.grafikTipi = "yok";
  }

  if (durum.grafikTipi === "yok") {
    return (
      <div>
        <Typography>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Typography>
      </div>
    );
  }

  const dataKeys =
  data && Array.isArray(data) && data.length > 0
    ? Object.keys(data[0]).filter((key) => key !== xAxisKey && typeof data[0][key] !== 'string')
    : [];

  const children =
    durum.grafikTipi === "composed"
      ? dataKeys.map((key, index) => {
          const grafikTipi = durum.grafikCizimTipi?.[key] || "line"; 
          const grafikComponent =
            grafikKomponentleri[grafikTipi as keyof typeof grafikKomponentleri];
          return grafikComponent ? grafikComponent(key, index) : null;
        })
      : dataKeys.map((key, index) => {
          const grafikComponent =
            grafikKomponentleri[
              durum.grafikTipi as keyof typeof grafikKomponentleri
            ];
          return grafikComponent ? grafikComponent(key, index) : null;
        });

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data as any}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip
            content={<CustomToolTip setIsModalVisible={setIsModalVisible} />}
            position={{ y: 20 }}
          />
          <Legend
            onClick={(event) => {
              console.log(event.dataKey);
            }}
          />
          {children}
        </ComposedChart>
      </ResponsiveContainer>

      <Modal
        title="Detayları Gör"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Typography>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Typography>
      </Modal>
    </>
  );
};
