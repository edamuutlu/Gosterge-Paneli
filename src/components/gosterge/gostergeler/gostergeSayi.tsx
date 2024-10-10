// import { InputNumber, theme } from 'antd';
// import { ReactNode, useEffect, useState } from 'react';
// import { Layout } from 'react-grid-layout';
// import ReactTextTransition, { presets } from 'react-text-transition';
// import { IGosterge, IGostergeDuzenleProps, varsayilanGostergeLayout } from '../IGosterge';

// interface GostergeSayiDurum {
//   sayi: number;
// }

// /* -------------------------------------------------------------------------- */
// /*                                   Düzenle                                  */
// /* -------------------------------------------------------------------------- */

// export const getGostergeSayiBaslik = (sayi: number) => <>{`Sayı : ${sayi}`}</>;
// const GostergeSayiDuzenle = ({ durum, setDurum }: IGostergeDuzenleProps<GostergeSayiDurum>) => {
//   return (
//     <>
//       <InputNumber
//         value={durum.sayi}
//         onChange={e =>
//           setDurum(p => {
//             p.sayi = e!;
//             // setBaslik(getGostergeSayiBaslik(p.sayi));
//             return { ...p };
//           })
//         }
//       />
//     </>
//   );
// };

// /* -------------------------------------------------------------------------- */
// /*                                   Göster                                   */
// /* -------------------------------------------------------------------------- */
// const GostergeSayi = ({ durum, oncekiDurum }: { durum: GostergeSayiDurum; oncekiDurum?: GostergeSayiDurum }) => {
//   const [metin, setMetin] = useState(oncekiDurum?.sayi || '');

//   const { useToken } = theme;
//   const { token } = useToken();

//   useEffect(() => {
//     setMetin(durum.sayi.toString());
//   }, []);

//   return (
//     <>
//       {metin
//         .toString()
//         .split('')
//         .map((x, i) => (
//           <ReactTextTransition
//             key={i}
//             delay={0 * i}
//             inline
//             springConfig={presets.wobbly}
//             style={{ fontSize: 30, color: token.colorText }}
//           >
//             {x}
//           </ReactTextTransition>
//         ))}
//     </>
//   );
// };

// /* -------------------------------------------------------------------------- */
// /*                                 Alternatif                                 */
// /* -------------------------------------------------------------------------- */
// const varsayilanLayout: Layout = {
//   ...varsayilanGostergeLayout,
//   h: 1,
//   w: 1,
//   isResizable: false,
// };

// export const gostergeSayi: IGosterge<GostergeSayiDurum> = {
//   getNode: (durum, oncekiDurum) => <GostergeSayi durum={durum} oncekiDurum={oncekiDurum} />,
//   varsayilanDurum: { sayi: 255 },
//   varsayilanLayout,
//   getDuzenle: function (gdp: IGostergeDuzenleProps<GostergeSayiDurum>): ReactNode {
//     return <GostergeSayiDuzenle {...gdp} />;
//   },
// };

// export const gostergeSayiSabit: IGosterge<GostergeSayiDurum> = {
//   ...gostergeSayi,
//   getDuzenle: undefined,
// };
export {};
