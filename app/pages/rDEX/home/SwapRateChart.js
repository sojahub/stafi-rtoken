import React from 'react';
import { AreaSeries, HorizontalGridLines, makeWidthFlexible, XAxis, XYPlot } from 'react-vis';

const FlexibleWidthXYPlot = makeWidthFlexible(XYPlot);

export default function SwapRateChart() {
  return (
    <div>
      <FlexibleWidthXYPlot height={370}>
        <HorizontalGridLines />
        <XAxis />
        <AreaSeries
          color={'#00F3AB'}
          className='area-series-example'
          curve='curveNatural'
          data={[
            { x: 1, y: 10, style: { color: '#A5A5A5' } },
            { x: 2, y: 12 },
            { x: 3, y: 13 },
            { x: 4, y: 17 },
            { x: 5, y: 15 },
          ]}
        />
      </FlexibleWidthXYPlot>
    </div>
  );
}
