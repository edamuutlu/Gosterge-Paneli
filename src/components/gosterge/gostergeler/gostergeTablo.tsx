/* import { Lotlar } from '@/kodOlusturucu/modeller'; */
import { Table } from 'antd';
import { Layout } from 'react-grid-layout';
import { IGosterge, IGostergeDuzenleProps, varsayilanGostergeLayout } from '../IGosterge';

export interface Lotlar {
  lotId?: string;
  lotName?: string;
  quantity?: number;
  status?: string;
  createdAt?: string;
}

/* -------------------------------------------------------------------------- */
/*                                   Düzenle                                  */
/* -------------------------------------------------------------------------- */

const GostergeTabloDuzenle = ({ durum, setDurum }: IGostergeDuzenleProps<Lotlar>) => {
  return <>Düzenle</>;
};

/* -------------------------------------------------------------------------- */
/*                                   Göster                                   */
/* -------------------------------------------------------------------------- */

const varsayilanSorguParam: Lotlar[] = [
  { lotId: '1', lotName: 'Lot 1', quantity: 100, status: 'active', createdAt: '2024-01-01' },
  { lotId: '2', lotName: 'Lot 2', quantity: 50, status: 'inactive', createdAt: '2024-02-15' },
];

const GostergeTablo = (durum: Lotlar) => {
  return (
    <div style={{ height: '100%', width: '100%', position: 'absolute' }}>
      <Table
        className="p-0 me-3"
        style={{ maxHeight: 200 }}
        // {...tablo.tabloProps}
        rowKey={r => r.lotId}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 Alternatif                                 */
/* -------------------------------------------------------------------------- */
const varsayilanLayout: Layout = {
  ...varsayilanGostergeLayout,
  w: 3,
  h: 2,
  minH: 2,
  maxH: 4,
  minW: 3,
  maxW: 5,
};

export const gostergeTablo: IGosterge<Lotlar> = {
  isim: 'Lotlar',
  getNode: (durum, oncekiDurum) => <GostergeTablo {...durum} />,
  varsayilanDurum: varsayilanSorguParam[0], // Sadece ilk Lot objesini kullanmak için
  varsayilanLayout,
  getDuzenle: (gdp: IGostergeDuzenleProps<Lotlar>) => <GostergeTabloDuzenle {...gdp} />,
};
