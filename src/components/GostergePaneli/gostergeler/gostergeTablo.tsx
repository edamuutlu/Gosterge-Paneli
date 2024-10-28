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

interface GostergeTabloProps {
  durum: Lotlar;
}

export const GostergeTablo: React.FC<GostergeTabloProps> = ({ durum }) => {
  return (
    <div style={{ height: '100%', width: '100%', position: 'absolute' }}>
      <Table
        className="p-0 me-3"
        style={{ maxHeight: 200 }}
        rowKey={(r: Lotlar) => r.lotId ?? ''}
        dataSource={[durum]}
        columns={[
          { title: 'Lot ID', dataIndex: 'lotId', key: 'lotId' },
          { title: 'Lot Name', dataIndex: 'lotName', key: 'lotName' },
          { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
          { title: 'Status', dataIndex: 'status', key: 'status' },
          { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
        ]}
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
  getNode: (durum, oncekiDurum) => <GostergeTablo durum={durum} />,
  varsayilanDurum: varsayilanSorguParam[0], // Sadece ilk Lot objesini kullanmak için
  varsayilanLayout,
  getDuzenle: (gdp: IGostergeDuzenleProps<Lotlar>) => <GostergeTabloDuzenle {...gdp} />,
};
