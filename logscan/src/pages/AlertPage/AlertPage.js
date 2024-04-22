import DashBoard from "./DashBorad";
import React, { useEffect } from 'react';
import { Button, Card, Col, Row } from 'antd';
import { CheckCircleTwoTone, ExclamationCircleTwoTone } from '@ant-design/icons';
import './AlertPage.css'
import MultiLineChart from "./AlertLineChart";
import AlertList from "./AlertList";
import { Layout } from "antd";
import { Navigate, useNavigate} from "react-router-dom";
import axios from "axios";
const { Content } = Layout;

const AlertPage = () =>{
  const navigator = useNavigate()
  const [dashBoardData, setDashBoardData] = React.useState([])
  const [listData, setListData] = React.useState([])

  useEffect(() => {
    const getDashBoardData = async () => {
      const respones = await axios.get('http://localhost:9031/alarmDashBoard')
      console.log('respones:', respones)
      setDashBoardData(respones.data)
    }
    getDashBoardData()
  }, [listData])
  return (
    <Layout>
      <Content>
        <Row>
          <Col span={18}>
            <Card 
              title='警报条目'
              className="scrollable-area"
            >
              <Row gutter={16}>
                {
                  dashBoardData.map((item) => {
                    var icon = <ExclamationCircleTwoTone twoToneColor="#eb2f96" />
                    if (item.alarm_num < 10) {
                      icon = <CheckCircleTwoTone twoToneColor="#52c41a" />
                    }
                    return(
                      <Col key={item.alarm_id} span={6}>
                        <Card title={item.alarm_name} bordered={false} extra={icon}>
                          <DashBoard quantity={item.alarm_num}/>
                        </Card>
                      </Col>
                    )
                  })
                }
              </Row>
            </Card>
            <MultiLineChart />
          </Col>
          <Col span={6}>
            <div 
              style={{
                margin:20,
                marginTop: 30,
                backgroundColor:'white',
                borderRadius: '10px',
              }}
            >
              <Button 
                type="primary" 
                block
                onClick={() => {navigator('/alert/add')}}
              >
                新建警报
              </Button>
              <div
                style={{overflow: 'auto', maxHeight: '880px'}}
              >
              <AlertList setListData={setListData}/>
              </div>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
export default AlertPage;