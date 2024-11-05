import { ReactElement } from "react";
import { Alert, Typography } from "antd";

interface GostergeDurum {
  isim?: string;
  xEkseniVeriAnahtari?: string;
}

export const GostergeMetinIcerikOlustur = <T extends GostergeDurum, TData>({
  durum,
  data,
}: {
  durum: T;
  data: TData;
}): ReactElement => {
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

  if (!durum.isim) {
    durum.isim = "Gosterge";
  }

  return (
    <Typography>
      <pre>{JSON.stringify({ isim: durum.isim, data }, null, 2)}</pre>
    </Typography>
  );
};
