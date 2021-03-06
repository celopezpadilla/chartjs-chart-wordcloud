/// <reference types="jest" />
import { WordCloudController } from './WordCloudController';
import { registry } from 'chart.js';
import { WordElement } from '../elements';
import createChart from '../__tests__/createChart';

describe('default', () => {
  beforeAll(() => {
    registry.addControllers(WordCloudController);
    registry.addElements(WordElement);
  });
  test('default', () => {
    const words = ['Hello', 'world', 'normally', 'you', 'want', 'more', 'words', 'than', 'this'];
    const data = {
      labels: words,
      datasets: [
        {
          label: '',
          data: words.map((_, i) => 10 + (i / words.length) * 90),
        },
      ],
    };
    const chart = createChart(
      {
        type: WordCloudController.id,
        data,
        options: {},
      },
      1000,
      500
    );

    return chart.toMatchImageSnapshot();
  });
});
