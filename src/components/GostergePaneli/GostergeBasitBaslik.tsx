import { theme, Typography } from "antd";
import { AiOutlineLineChart, AiOutlineBarChart, AiOutlineAreaChart } from "react-icons/ai"; 
import { GostergeDurum } from "./GostergeIcerikOlustur";
import { MdMultilineChart } from "react-icons/md";
import { IoDocumentTextSharp } from "react-icons/io5";

type Props<T extends GostergeDurum> = {
  durum: T;
};

const PANEL_PREFIX = 'panel_1_gosterge_';

const GostergeBasitBaslik = <T extends GostergeDurum>({ durum }: Props<T>) => {
  const { useToken } = theme;
  const { token } = useToken();

  // Function to retrieve custom name from localStorage
  const gostergeIsminiGetir = () => {
    if (durum.gostergeId) {
      const savedPanelSettings = localStorage.getItem(`${PANEL_PREFIX}${durum.gostergeId}`);
      if (savedPanelSettings) {
        try {
          const parsedSettings = JSON.parse(savedPanelSettings);
          return parsedSettings.isim || durum.isim || "Gösterge";
        } catch (error) {
          console.error('Error parsing panel settings:', error);
        }
      }
    }
    return durum.isim || "Gösterge";
  };

  const ikonGoster  = () => {
    switch (durum.grafikTipi) {
      case 'line':
        return <AiOutlineLineChart size={18} style={{ marginRight: 8 }} />;
      case 'bar':
        return <AiOutlineBarChart size={18} style={{ marginRight: 8 }} />;
      case 'area':
        return <AiOutlineAreaChart size={18} style={{ marginRight: 8 }} />;
      case 'composed':
        return <MdMultilineChart size={18} style={{ marginRight: 8 }} />; 
      default:
        return <IoDocumentTextSharp size={18} style={{ marginRight: 8 }} />;
    }
  };

  return (
    <Typography.Text strong type="secondary">
      <div style={{ display: "flex", alignItems: "center", fontSize: 14 }}>
        {ikonGoster ()}
        {gostergeIsminiGetir()}
      </div>
    </Typography.Text>
  );
};

export default GostergeBasitBaslik;
