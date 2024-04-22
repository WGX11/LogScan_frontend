import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Card } from 'antd';

const MultiLineChart = () => {
  const chartRef = useRef(null);
  let myChart = null;

  const getOption = () => {
    return {
      title: {
        text: 'Multi-Line Chart Example'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Product A', 'Product B', 'Product C']
      },
      dataZoom: [
        {
          type: 'slider',  
          start: 0,        
          end: 100         
        }
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%', 
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Product A',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: 'Product B',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: 'Product C',
          type: 'line',
          data: [150, 232, 201, 154, 190, 330, 410]
        }
      ]
    };
  };

  useEffect(() => {
    myChart = echarts.init(chartRef.current);
    myChart.setOption(getOption());

    return () => {
      myChart && myChart.dispose();
    };
  }, []); 

  return (
    <Card title="警报概览" style={{ margin: '20px' }}>
      <div ref={chartRef} style={{ height: 400 }}></div>
    </Card>
  );
};

export default MultiLineChart;
