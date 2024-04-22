import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

// 定义颜色获取函数
function getColorByQuantity(quantity) {
  if (quantity < 20) {
    return ['#67e0e3', '#53c8d1'];  
  } else if (quantity < 40) {
    return ['#ffdd57', '#e6c44c']; 
  } else {
    return ['#e25562', '#cf1322',];  
  }
}


function DashBoard({ quantity }) {
  const chartRef = useRef(null);
  useEffect(() => {
    const chartInstance = chartRef.current ? echarts.init(chartRef.current) : null;
    const [baseColor, topColor] = getColorByQuantity(quantity);

    const option = {
      series: [
        {
          // Bottom layer
          type: 'gauge',
          center: ['50%', '60%'],
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 100,
          itemStyle: {
            color: baseColor
          },
          progress: {
            show: true,
            width: 15
          },
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              width: 30,
              color: baseColor
            }
          },
          axisTick: {
            show: true,
            distance: -30,
            length: 8,
            lineStyle: {
              color: '#999',
              width: 1
            }
          },
          splitLine: {
            show: true,
            distance: -30,
            length: 20,
            lineStyle: {
              color: '#999',
              width: 2
            }
          },
          axisLabel: {
            show: true,
            distance: -10,
            color: '#999',
            fontSize: 10
          },
          detail: {
            show: true,
            offsetCenter: [0, '0%'],
            formatter: '{value}',
            fontSize: 12,  
            fontWeight: 'bolder',
            color: topColor,  
          },
          data: [
            {
              value: quantity
            }
          ]
        },
        {
          // Top layer
          type: 'gauge',
          center: ['50%', '60%'],
          startAngle: 200,
          endAngle: -20,
          min: 0,
          max: 100,
          itemStyle: {
            color: topColor
          },
          progress: {
            show: true,
            width: 5  
          },
          pointer: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          detail: {
            show: false
          },
          data: [
            {
              value: quantity
            }
          ]
        }
      ]
    };

    if (chartInstance) {
      chartInstance.setOption(option);
    }

    return () => {
      if (chartInstance) {
        chartInstance.dispose();
      }
    };
  }, [quantity]);

  return <div ref={chartRef} style={{ height: 150 , width: 190}} />;
}

export default DashBoard;
