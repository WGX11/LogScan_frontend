import BreathingLight from "../../component/BreathingLight";
import TimeSelect from "../../component/TimeSelect";
import LogContext from "../SearchPage/LogContext";
import "./MonitorPage.css"
import dayjs from "dayjs";
import { useState } from "react";
import { Layout } from "antd";

const { Content } = Layout;
const MonitorPage = () => {
    //查询时间
    const [startTime, setStartTime] = useState(dayjs().subtract(15, 'minute').format('YYYY-MM-DD HH:mm:ss') )
    const [endTime, setEndTime] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'))
    //更新时间段收到的异常日志数量
    const [updateTimeErrorCount, setUpdateTimeErrorCount] = useState(0)
    //更新时间段收到的警告日志数量
    const [updateTimeWarnCount, setUpdateTimeWarnCount] = useState(0)
    //更新时间段收到的正常日志数量
    const [updateTimeNormalCount, setUpdateTimeNormalCount] = useState(0)
    const [notification, setNotification] = useState(false)
    return (
        <div className="dark-gradient-background">
            <LogContext.Provider value={{setStartTime, setEndTime, startTime, endTime, 
                setUpdateTimeErrorCount, setUpdateTimeWarnCount, setUpdateTimeNormalCount,
                setNotification}}>
                <Content style={{padding: '0 20px'}}>
                <div className="content-box-monitor">
                    <TimeSelect />
                </div>
                <BreathingLight />
                </Content>
            </LogContext.Provider>
        </div>
    );
}

export default MonitorPage