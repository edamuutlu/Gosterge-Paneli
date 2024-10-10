import { Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { loremIpsum } from 'lorem-ipsum';
import { ReactNode } from 'react';
import { Layout } from 'react-grid-layout';
import { IGosterge, IGostergeDuzenleProps, varsayilanGostergeLayout } from '../IGosterge';

interface GostergeMetinDurum {
  metin: string;
}

/* -------------------------------------------------------------------------- */
/*                                   Düzenle                                  */
/* -------------------------------------------------------------------------- */
const GostergeMetinDuzenle = ({ durum, setDurum }: IGostergeDuzenleProps<GostergeMetinDurum>) => {
  return (
    <>
      <TextArea
        value={durum.metin}
        onChange={e =>
          setDurum(p => {
            p.metin = e.target.value;
            return { ...p };
          })
        }
      />
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 Alternatif                                 */
/* -------------------------------------------------------------------------- */
const varsayilanLayout: Layout = {
  ...varsayilanGostergeLayout,
  h: 1,
  w: 2,
  minH: 1,
  maxH: 2,
  minW: 2,
  maxW: 5,
};

export const gostergeMetin: IGosterge<GostergeMetinDurum> = {
  getNode: durum => <Typography.Text>{durum.metin}</Typography.Text>,
  varsayilanDurum: { metin: loremIpsum({ count: 200 }) },
  varsayilanLayout,
  getDuzenle: function (gdp: IGostergeDuzenleProps<GostergeMetinDurum>): ReactNode {
    return <GostergeMetinDuzenle {...gdp} />;
  },
};

export const gostergeMetinSabit: IGosterge<GostergeMetinDurum> = {
  ...gostergeMetin,
  getDuzenle: undefined,
};
