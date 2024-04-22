import BreathingLight from "../../component/BreathingLight";
import TimeSelect from "../../component/TimeSelect";
import LogContext from "../SearchPage/LogContext";
import AnomalyNotification from "../SearchPage/AnomalyNotification";
import "./MonitorPage.css"
import dayjs from "dayjs";
import { useState } from "react";
import { Layout } from "antd";
import backgroundImage from "../../assets/Background.webp"

const { Content } = Layout;
const MonitorPage = () => {
    //查询时间
    const [startTime, setStartTime] = useState(dayjs().subtract(15, 'minute').format('YYYY-MM-DD HH:mm:ss') )
    const [endTime, setEndTime] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'))
    const [notification, setNotification] = useState(false)
    const [notificationData, setNotificationData] = useState([{}])
    const [updateTime, setUpdateTime] = useState(5000)
    //更新时间段收到的异常日志数量
    const [updateTimeErrorCount, setUpdateTimeErrorCount] = useState(0)
    //更新时间段收到的警告日志数量
    const [updateTimeWarnCount, setUpdateTimeWarnCount] = useState(0)
    //更新时间段收到的正常日志数量
    const [updateTimeNormalCount, setUpdateTimeNormalCount] = useState(0)
    //更新的时间间隔
    return (
        <div className="dark-gradient-background"
            // style={{backgroundImage:`url(${backgroundImage})`}}
        >
            <LogContext.Provider value={{setStartTime, setEndTime, startTime, endTime,
                setNotification, updateTime, setUpdateTime, setNotificationData,
                setNotificationData, setUpdateTimeNormalCount, setUpdateTimeErrorCount, 
                setUpdateTimeWarnCount}}>
                <Content style={{padding: '0 20px'}}>
                <div className="content-box-monitor">
                    <TimeSelect />
                </div>
                <BreathingLight />
                {notification && <AnomalyNotification/>}
                </Content>
            </LogContext.Provider>
        </div>
    );
}

export default MonitorPage