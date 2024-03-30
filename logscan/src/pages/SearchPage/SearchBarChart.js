import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import axios from 'axios';
import {differenceInDays, format, addDays, addHours, addMinutes} from 'date-fns';
import { useContext } from 'react';
import LogContext from './LogContext'; 
import dayjs from 'dayjs';
import { formatISO } from 'date-fns';


const SearchBarChart = () => {
  const chartRef = useRef(null);
  const [normalData, setNormalData] = useState([])
  const [anomalyData, setAnomalData] = useState([])
  const {startTime, endTime, luceneString} = useContext(LogContext)
  const [timeLabel, setTimeLabel] = useState([])
  useEffect(() => {
    const timeLabel = getTimeLabel(startTime, endTime);
    setTimeLabel(timeLabel)
    const fetchData = async () => {
      try{
        const data  = await fetchChartData(startTime, endTime, luceneString);
        const { normalRes, anomalyRes }= geneDataByLabel(data, timeLabel)
        setNormalData(normalRes)
        setAnomalData(anomalyRes)
      } catch(error){
        console.error('Error fetching chart data:', error);
      }
    }
    fetchData()
  }, [startTime, endTime, luceneString]);
  
  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);
      const option = {
        title: {
          text: '正常日志数量与异常日志数量对比'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {            
            type: 'shadow'        
          }
        },
        legend: {
          data: ['正常日志数量', '异常数据数量']
        },
        xAxis: {
          type: 'category',
          data: timeLabel
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '正常日志数量',
            type: 'bar',
            stack: '总量',
            large: true,
            // 当数据量超过此阈值时启用大数据量优化
            largeThreshold: 1000,
            // 数据抽稀，取平均值，减少渲染的数据点数量
            sampling: 'average',
            data: normalData
            
          },
          {
            name: '异常数据数量',
            type: 'bar',
            stack: '总量',
            large: true,
            // 当数据量超过此阈值时启用大数据量优化
            largeThreshold: 1000,
            // 数据抽稀，取平均值，减少渲染的数据点数量
            sampling: 'average',
            data: anomalyData
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            start: 0,
            end: 100,
            throttle: 1000
          }
        ]
      };

      myChart.setOption(option, true);
      return () => myChart.dispose();
    }
  }, [normalData, anomalyData, startTime, endTime]);
  return <div ref={chartRef} style={{ width: '2000px', height: '400px' }}></div>;
};

async function fetchChartData(startTime, endTime, lucene) {
  try {
    const response = await axios.get('http://localhost:9031/chartData', {
      params: {
        start: formatISO(startTime),
        end: formatISO(endTime),
        lucene: lucene
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
}

//生成以分钟为间隔的时间标签
function getTimeLabel(startTime, endTime) {
  let timeLabel = [];
  let start = new Date(startTime);
  let end = new Date(endTime);
  start = addMinutes(start, -1)
  
  //判断时间是否超过一年，如果超过一年就按照半个月成时间标签
  if (differenceInDays(end, start) > 365) {
    while (start < end) {
      let middle = addDays(start, 7)
      timeLabel.push(format(middle, 'yyyy-MM-dd'))
      start = addDays(start, 16)
    }
    timeLabel.push(format(end, 'yyyy-MM-dd'))
  } else if (differenceInDays(end, start) > 180) {
    //判断时间是否超过半年，如果超过就按照每周生成时间标签
    while (start < end) {
      let middle = addDays(start + 3)
      timeLabel.push(format(middle, 'yyyy-MM-dd'))
      start = addDays(start, 7)
    }
    timeLabel.push(format(end, 'yyyy-MM-dd'))
  } else if (differenceInDays(end, start) > 30) {
    //判断时间是否超过一个月，如果超过一个月就按照每天生成时间标签
    while (start < end) {
      let middle = addHours(start, 12)
      timeLabel.push(format(middle, 'yyyy-MM-dd'));
      start = addDays(start, 1)
    } 
    timeLabel.push(format(end, 'yyyy-MM-dd'))
  } else if (differenceInDays(end, start) > 7) {
    //判断时间是否超过一周，如果超过一周就按照每12时生成时间标签
    while (start < end) {
      let middle = addHours(start, 6)
      timeLabel.push(format(middle, 'yyyy-MM-dd HH'));
      start = addHours(start, 12)
    }
    timeLabel.push(format(end, 'yyyy-MM-dd HH'))
  } else if (differenceInDays(end, start) > 3) {
    //判断时间是否超过3天，如果超过3天就按照每小时生成时间标签
    while (start < end) {
      let middle = addMinutes(start, 30)
      timeLabel.push(format(middle, 'yyyy-MM-dd HH'));
      start = addHours(start, 1)
    }
    timeLabel.push(format(end, 'yyyy-MM-dd HH'))
  } else if (differenceInDays(end, start) > 1){
    //判断时间是否超过1天，如果超过1天就按照每5分钟生成时间标签
    while (start < end) {
      let middle = addMinutes(start, 2)
      timeLabel.push(format(middle, 'yyyy-MM-dd HH:mm'));
      start = addMinutes(start, 5)
    }
    timeLabel.push(format(end, 'yyyy-MM-dd HH:mm'))
  } else {
    //如果时间小于1天，按照每分钟生成时间标签
    while (start < end) {
      timeLabel.push(format(start, 'yyyy-MM-dd HH:mm'));
      start = addMinutes(start, 1)
    }
    timeLabel.push(format(end, 'yyyy-MM-dd HH:mm'))
  }
  return timeLabel;
}

//根据生成的时间标签生成数据
function geneDataByLabel(data, timeLabel) {
  const dataArray = [...data]
  const normalData = dataArray.map(item => {
    return ({
      date: item.Aggregations.key_as_string,
      count: item.Aggregations.normal.buckets[0].doc_count
    })
  })
  const anomalyData = dataArray.map(item => {
    return ({
      date: item.Aggregations.key_as_string,
      count: item.Aggregations.anomaly.buckets[0].doc_count
    })
  })
  const labelLen = timeLabel.length
  const dataLen = dataArray.length
  let dataIndex = 0
  let tmpDate = new Date(normalData[dataIndex].date)
  const normalRes = []
  const anomalyRes = []
  for (let i = 0; i < labelLen - 1; i++) {
    let startTime = new Date(dayjs(timeLabel[i]).format('YYYY-MM-DD HH:mm:ss'))
    while (tmpDate < startTime) {
      dataIndex++
      if (dataIndex >= dataLen){
        break
      }
      tmpDate = new Date(normalData[dataIndex].date)
    }
    let endTime = new Date(dayjs(timeLabel[i + 1]).format('YYYY-MM-DD HH:mm:ss'))
    let normalCount = 0
    let anomalyCount = 0
    while (tmpDate <= endTime) {
      if (dataIndex >= dataLen){
        break
      }
      tmpDate = new Date(normalData[dataIndex].date)
      normalCount += normalData[dataIndex].count
      anomalyCount += anomalyData[dataIndex].count
      dataIndex++
    }
    normalRes.push(normalCount)
    anomalyRes.push(anomalyCount)
  }
  return {
    normalRes: normalRes,
    anomalyRes: anomalyRes
  }
}

export default SearchBarChart;
