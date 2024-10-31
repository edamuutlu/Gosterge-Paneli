import { ReactElement, useState } from "react";
import { ResponsiveContainer, ComposedChart, Line, Bar, Area, CartesianGrid, XAxis, YAxis, Tooltip, 
  Legend, TooltipProps, DefaultTooltipContent} from "recharts";
import { Alert, Button, message, Modal, Typography } from "antd";

export type GrafikTipi = "line" | "bar" | "area" | "composed" | "yok";

export interface GostergeDurum {
  isim?: string;
  grafikTipi?: GrafikTipi;
  grafikCizimTipi?: Record<string, GrafikTipi>;
  xEkseniVeriAnahtari ?: string;
}

const varsayilanRenkler  = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#387908"];

const grafikKomponentleri = {
  line: (key: string, index: number) => (
    <Line
      key={key}
      dataKey={key}
      type="monotone"
      strokeWidth={3}
      stroke={varsayilanRenkler[index % varsayilanRenkler.length]}
    />
  ),
  bar: (key: string, index: number) => (
    <Bar
      key={key}
      dataKey={key}
      barSize={50}
      fill={varsayilanRenkler[index % varsayilanRenkler.length]}
    />
  ),
  area: (key: string, index: number) => (
    <Area
      key={key}
      dataKey={key}
      type="monotone"
      fill={varsayilanRenkler[index % varsayilanRenkler.length]}
      stroke={varsayilanRenkler[(index + 1) % varsayilanRenkler.length]}
      fillOpacity={0.3}
    />
  ),
};

const CustomToolTip = ({
  active,
  payload,
  label,
  setModalGorunurluk,
  ...props
}: TooltipProps<any, any> & {
  setModalGorunurluk: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const modalGoster = () => {
    setModalGorunurluk(true);
  };

  return (
    <div className="custom-tooltip">
      <DefaultTooltipContent
        {...props}
        contentStyle={{ border: "none" }}
        payload={payload}
        label={label}
      />
      <Button type="primary" onClick={modalGoster}>
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
  const [modalGorunurluk, setModalGorunurluk] = useState(false);

  const modalKapat = () => {
    setModalGorunurluk(false);
  };

  const xEkseniAnahtar  = durum.xEkseniVeriAnahtari  || "ulke";

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
    ? Object.keys(data[0]).filter((key) => key !== xEkseniAnahtar  && typeof data[0][key] !== 'string')
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
          <XAxis dataKey={xEkseniAnahtar } />
          <YAxis />
          <Tooltip
            content={<CustomToolTip setModalGorunurluk={setModalGorunurluk} />}
            position={{ y: 20 }}
          />
          <Legend
            onClick={(event) => {
              message.info(String(event.dataKey ?? "No data key available"));
            }}
          />
          {children}
        </ComposedChart>
      </ResponsiveContainer>

      <Modal
        title="Detayları Gör"
        open={modalGorunurluk}
        onCancel={modalKapat}
      >
        <Typography>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Typography>
      </Modal>
    </>
  );
};
