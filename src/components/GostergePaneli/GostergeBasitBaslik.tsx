import { Typography } from "antd";
import { ReactNode } from "react";

type Props = { children: ReactNode };

const GostergeBasitBaslik = ({ children }: Props) => {

  return (
    <Typography.Text strong type="secondary">
      {children}
    </Typography.Text>
  );
};

export default GostergeBasitBaslik;
