import { theme, Typography } from "antd";
import { AiOutlineLineChart } from "react-icons/ai";

type Props = { gostergeIsim: String };

const GostergeBasitBaslik = ({ gostergeIsim }: Props) => {
  const { useToken } = theme;
  const { token } = useToken();

  return (
    <Typography.Text strong type="secondary">
      <div style={{ display: "flex", alignItems: "center", fontSize: 14}}>
        <AiOutlineLineChart size={18} style={{ marginRight: 8 }} />
        {gostergeIsim}
      </div>
    </Typography.Text>
  );
};

export default GostergeBasitBaslik;
