import { theme, Typography } from 'antd';
import { ReactNode } from 'react';

type Props = { children: ReactNode };

const GostergeBasitBaslik = ({ children }: Props) => {
  const { useToken } = theme;
  const { token } = useToken();

  return (
    <Typography.Text strong type="secondary">
      {children}
    </Typography.Text>
  );
};

export default GostergeBasitBaslik;
