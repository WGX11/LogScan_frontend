import React, { useEffect, useMemo } from 'react';
import { Button, notification, Space } from 'antd';
import axios from 'axios';
import { useContext } from 'react';
import LogContext from './LogContext';
import dayjs from 'dayjs';
import { formatISO } from 'date-fns';


//用于实时报警异常数据
const AnomalyNotification = () => {
    const [api, contextHolder] = notification.useNotification();
    let {startTime, endTime, setStartTime, setEndTime, luceneString, 
         notificationData, setNotificationData, setUpdateTimeErrorCount,
        setUpdateTimeWarnCount, updateTimeErrorCount, updateTimeWarnCount,
        updateTimeNormalCount, setUpdateTimeNormalCount, updateTime} = useContext(LogContext)
    useEffect(() => {
        // 用于实时报警异常数据
        setUpdateTimeNormalCount(0)
        setUpdateTimeErrorCount(0)
        setUpdateTimeWarnCount(0)
        async function fetchData() {
            const newStartTime = dayjs().subtract(updateTime, 'millisecond').format('YYYY-MM-DD HH:mm:ss');
            const newEndTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
            // 立即更新状态
            setStartTime(newStartTime);
            setEndTime(newEndTime);
            let notificationDataTmp = []
            try{
                const response = await axios.get("http://localhost:9031/anomalyData", {
                    params: {
                        start: formatISO(newStartTime),
                        end: formatISO(newEndTime),
                        lucene: luceneString
                    }
                })
                const data = await response.data
                notificationDataTmp = data
                setNotificationData(data)
                notificationDataTmp.forEach((item, index) => {
                    const logTime = dayjs(item._source['@timestamp']).format('YYYY-MM-DD HH:mm:ss')
                    if (index > 200)
                        return
                    const key = `open${item._id}_${index}`;
                    const btn = (
                        <Space>
                            <Button type="link" size="small" onClick={() => api.destroy()}>
                            全部关闭
                            </Button>
                            <Button type="primary" size="small" onClick={() => api.destroy(key)}>
                            详情
                            </Button>
                        </Space>
                    );
                    const duration = (updateTime - 2000) / 1000
                    if (1 > 0) {
                        setUpdateTimeErrorCount(updateTimeErrorCount => updateTimeErrorCount + 1)
                        setUpdateTimeWarnCount(updateTimeWarnCount =>  updateTimeWarnCount + 1)
                        api.warning({
                            message: `时间: ${logTime}`,
                            description:
                            `主机[${item._source.host}]收到异常日志，日志内容: ${item._source.message}`,
                            placement:'topLeft',
                            btn,
                            key,
                            duration: duration
                        });
                    }
                })
            }catch (error){
                console.error(error)
            }
        } 
        fetchData()
        const intervalId = setInterval(fetchData , updateTime)

        return () => {
            clearInterval(intervalId)
        }
    }, [luceneString, updateTime]);
    return contextHolder
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
export default AnomalyNotification;