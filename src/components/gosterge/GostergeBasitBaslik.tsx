import { theme, Typography } from "antd";
import { AiOutlineLineChart } from "react-icons/ai";

type Props = { gosterge: String };

const GostergeBasitBaslik = ({ gosterge }: Props) => {
  const { useToken } = theme;
  const { token } = useToken();

  return (
    <Typography.Text strong type="secondary">
      <div style={{ display: "flex", alignItems: "center", fontSize: 14}}>
        <AiOutlineLineChart size={18} style={{ marginRight: 8 }} />
        {gosterge}
      </div>
    </Typography.Text>
  );
};

export default GostergeBasitBaslik;
