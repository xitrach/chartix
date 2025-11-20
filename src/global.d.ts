import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare namespace JSX {
  interface IntrinsicElements {
    'spline-viewer': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
      url?: string;
    };
  }
}
