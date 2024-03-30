import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import Navigation from "../../component/Navigation";
import TimeSelect from "../../component/TimeSelect";
import "../../index.css";
import DragDropDemo from "./DraggableBox";
import LogContext from "./LogContext";
import axios from "axios";
import { formatISO } from "date-fns";
import dayjs from "dayjs";
import SerarchInputBox from "../../component/SearchInputBox";


const { Header, Content, Footer} = Layout;

// 状态提升共享查询到的日志数据

const SearchPage = () => {
    const [logData, setLogData] = useState({})
    const [luceneString, setLuceneString] = useState('')
    const [startTime, setStartTime] = useState(dayjs().subtract(15, 'minute').format('YYYY-MM-DD HH:mm:ss') )
    const [endTime, setEndTime] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss') )
    useEffect(() => {
        const fetchData = async () => {
            const startTime_ = formatISO(startTime)
            const endTime_ = formatISO(endTime)
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
                <Header style={{backgroundColor:'aliceblue'}}>
                    <Navigation/>
                </Header>
                <LogContext.Provider value={{logData, setStartTime, setEndTime, startTime, endTime, luceneString, setLuceneString}}>
                    <Content style={{padding: '0 20px'}}>
                        <div className='content-box-vertical' style={{height:'320px'}}>
                            <div className='content-box-no-bg' style={{height:'200px', marginTop:'0px'}}>
                                <TimeSelect/>
                            </div>
                            <div style={{marginLeft:'120px', }}>
                                <SerarchInputBox/>
                            </div>
                        </div>
                        <DragDropDemo/>
                    </Content>
                </LogContext.Provider>
            </Layout>
        </div>
    );
}

export default SearchPage;