import ReactEcharts from 'echarts-for-react';
import React from 'react';

export default function SwapRateChart(props) {
  const getChartOption = () => {
    return {
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
          min: 'dataMin',
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
          areaStyle: {
            color: '#40CB92',
          },
          barWidth: '60%',
          data: props.data,
        },
      ],
    };
  };

  return (
    <div style={{ width: '607px', maxWidth: '607px', height: '370px' }}>
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
