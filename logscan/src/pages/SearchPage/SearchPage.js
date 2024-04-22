import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import TimeSelect from "../../component/TimeSelect";
import "../../index.css";
import DragDropDemo from "./DraggableBox";
import LogContext from "./LogContext";
import axios from "axios";
import { formatISO, parseISO } from "date-fns";
import dayjs from "dayjs";
import SerarchInputBox from "../../component/SearchInputBox";
import AnomalyNotification from "./AnomalyNotification";
import {useLocation} from 'react-router-dom';

const { Content } = Layout;

// 状态提升共享查询到的日志数据

const SearchPage = () => {
    const location = useLocation()
    let queryParams = new URLSearchParams(location.search);
    let defaultStartTime = dayjs().subtract(15, 'minute').format('YYYY-MM-DD HH:mm:ss')
    let defaultEndTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    let defaultLucene = ''
    let st = queryParams.get('start') || defaultStartTime
    let et = queryParams.get('end') || defaultEndTime
    let lu = queryParams.get('lucene') || defaultLucene
    if (st) {
        st = decodeURIComponent(st) 
    }
    if (et) {
        et = decodeURIComponent(et)
    }
    if (lu) {
        lu = decodeURIComponent(lu)
    }
    //日志详情数据
    const [logData, setLogData] = useState({})
    //Lucene表达式
    const [luceneString, setLuceneString] = useState(lu)
    //查询时间
    const [startTime, setStartTime] = useState(st)
    const [endTime, setEndTime] = useState(et)
    //报警数据
    const [notificationData, setNotificationData] = useState([{}])
    //是否显示报警
    const [notification, setNotification] = useState(false)
    //更新的时间间隔
    const [updateTime, setUpdateTime] = useState(5000)
    //更新时间段收到的异常日志数量
    const [updateTimeErrorCount, setUpdateTimeErrorCount] = useState(0)
    //更新时间段收到的警告日志数量
    const [updateTimeWarnCount, setUpdateTimeWarnCount] = useState(0)
    //更新时间段收到的正常日志数量
    const [updateTimeNormalCount, setUpdateTimeNormalCount] = useState(0)
    useEffect(() => {
        const fetchData = async () => {
            let startTime_ = startTime
            let endTime_ = endTime
            try{
                startTime_ = formatISO(startTime)
            } catch (error) {
                return
            }
            try{
                endTime_ = formatISO(endTime)
            }catch (error){
                return 
            }
            try{
                const response = await axios.get("http://localhost:9031/searchData", {
                    params: {
                        start: startTime_,
                        end: endTime_,
                        lucene: luceneString
                    }
                })
                const data = await response.data
                setLogData(data)
            }catch (error){
                console.error(error)
            }
        }
        fetchData()
    },[startTime, endTime, luceneString])
    return (
        <div>
            <Layout>
                <LogContext.Provider value={{logData, setStartTime, setEndTime, startTime,
                     endTime, luceneString, setLuceneString, setNotification, notification, 
                     setNotificationData, notificationData, updateTimeErrorCount, 
                     setUpdateTimeErrorCount, updateTimeNormalCount, setUpdateTimeNormalCount, 
                     updateTimeWarnCount, setUpdateTimeWarnCount, updateTime, setUpdateTime }}>
                    <Content style={{padding: '0 20px'}}>
                        <div className='content-box-vertical' style={{height:'320px'}}>
                            <div className='content-box-no-bg' style={{height:'200px', marginTop:'0px'}}>
                                <TimeSelect/>
                            </div>
                            <div style={{marginLeft:'120px', }}>
                                <SerarchInputBox/>
                            </div>
                        </div>
                        {notification && <AnomalyNotification/>}
                        <DragDropDemo/>
                    </Content>
                </LogContext.Provider>
            </Layout>
        </div>
    );
}

export default SearchPage;