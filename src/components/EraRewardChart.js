import ReactEcharts from 'echarts-for-react';
import React from 'react';
import { graphic } from 'echarts';

export default function EraRewardChart(props) {
  const getChartOption = () => {
    return {
      animation: false,
      color: ['#40CB92'],
      lenend: {
        height: '300px',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
        // formatter:(params:any)=>{
        //     console.log(params,"======params");
        //     return
        // }
      },
      xAxis: [
        {
          type: 'category',
          data: props.xData,
          boundaryGap: false,
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          axisLabel: {
            // padding: [0, 100, 0, 100],
            interval: 0,
            // rotate: -40,
            color: '#A5A5A5',
            formatter: (value) => {
              if (value && value.length >= 8) {
                return value.substring(value.length - 4);
              }
              return value;
            },
          },
        },
      ],
      grid: {
        left: '3%',
        right: '3%',
      },
      yAxis: [
        {
          show: false,
          type: 'value',
          min: function (value) {
            return Math.max(0, value.min - (value.max - value.min));
          },
          max: 'dataMax',
          axisLabel: {
            formatter: (value) => {
              return value;
            },
            color: '#FFFFFF',
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#444755',
              width: 2,
            },
          },
        },
      ],
      series: [
        {
          name: 'value',
          type: 'line',
          showSymbol: false,
          areaStyle: {
            // color: '#40CB92',
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(73,255,200,0.3)',
              },
              {
                offset: 1,
                color: 'rgba(226,255,246,0.3)',
              },
            ]),
          },
          barWidth: '60%',
          data: props.data,
        },
      ],
    };
  };

  return (
    <div style={{ width: '515px', maxWidth: '515px', height: '300px' }}>
      {/* <FlexibleWidthXYPlot height={370}>
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
      </FlexibleWidthXYPlot> */}

      <ReactEcharts option={getChartOption()}></ReactEcharts>
    </div>
  );
}
