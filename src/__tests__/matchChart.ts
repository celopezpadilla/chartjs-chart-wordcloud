/// <reference types="jest" />
/// <reference types="node" />

import { Chart, IChartConfiguration, defaults } from '@sgratzl/chartjs-esm-facade';
import { toMatchImageSnapshot, MatchImageSnapshotOptions } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

function toBuffer(canvas: HTMLCanvasElement) {
  return new Promise((resolve) => {
    canvas.toBlob((b) => {
      const file = new FileReader();
      file.onload = () => resolve(Buffer.from(file.result as ArrayBuffer));
      file.readAsArrayBuffer(b!);
    });
  });
}

export async function expectMatchSnapshot(canvas: HTMLCanvasElement) {
  const image = await toBuffer(canvas);
  expect(image).toMatchImageSnapshot();
}

export default function matchChart<
  T = number,
  L = string,
  C extends IChartConfiguration<string, T, L> = IChartConfiguration<string, T, L>
>(config: C, width = 300, height = 300) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  defaults.font.family = 'Courier New';
  // defaults.font.color = 'transparent';
  config.options = Object.assign(
    {
      responsive: false,
      animation: false,
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    config.options || {}
  );
  const ctx = canvas.getContext('2d')!;

  const chart = new Chart<T, L, C>(ctx, config);

  return {
    chart,
    ctx,
    toMatchImageSnapshot: async (matchOptions: MatchImageSnapshotOptions = {}) => {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const image = await toBuffer(canvas);
      expect(image).toMatchImageSnapshot(matchOptions);
    },
  };
}
