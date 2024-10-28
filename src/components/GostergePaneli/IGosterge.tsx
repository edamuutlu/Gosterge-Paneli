import React, { ReactNode } from 'react';
import { Layout } from 'react-grid-layout';

export interface IGostergeDuzenleProps<TDurum> {
  durum: TDurum;
  setDurum: React.Dispatch<React.SetStateAction<TDurum>>;
}

export interface IGosterge<TDurum> {
  isim?: string;
  gostergeId?: string;
  getNode: (durum: TDurum, oncekiDurum?: TDurum) => ReactNode;
  varsayilanDurum: TDurum;
  varsayilanBaslik?: ReactNode;
  varsayilanLayout?: Layout;
  getDuzenle?: (gdp: IGostergeDuzenleProps<TDurum>) => ReactNode;
  getBaslik?: (durum: TDurum) => ReactNode;
}

export const varsayilanGostergeLayout: Layout = {
  i: '',
  x: 0,
  y: 0,
  w: 3,
  h: 1,
  minH: 1,
  maxH: 5,
  minW: 1,
  maxW: 5,
  isResizable: true,
  isDraggable: true,
};
