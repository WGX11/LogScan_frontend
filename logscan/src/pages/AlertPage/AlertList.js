import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Skeleton } from 'antd';
import axios from 'axios';

const count = 10;

const AlertList = (props) => {
  const [initLoading, setInitLoading] = useState(true);
  const [data, setData] = useState([]);
  const setListData = props.setListData;
  const deleteAlarm = (id) => {
    const tmpData = data.filter((item) => item.alarm_id !== id);
    deleteAlarmFromDB(id);
    setListData(tmpData) 
    setData(tmpData);
  }

  const deleteAlarmFromDB = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:9031/alarmDelete/${id}`)
      console.log('response:', response)
      if (response.status !== 200) {
        return 
      }
    }catch (error) {
      console.log('error:', error)
    }
  }

  useEffect(() => {
    const getAlarmList = async () => {
      try {
        const response = await axios.get('http://localhost:9031/alarmList')
        setInitLoading(false);
        const res = response.data
        setData(res);
      }
      catch (error) {
        console.log('error:', error)
      }
  }
  getAlarmList()
  }, []);


  return (
    <List
      className="demo-loadmore-list"
      loading={initLoading}
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item
          actions={[<Button type="link" onClick={()=> deleteAlarm(item.alarm_id)}>删除</Button>]}
          style={{margin: '10px'}}
          key={item.alarm_id}
        >
          <Skeleton avatar title={false} loading={item.loading} active>
            <List.Item.Meta
              title={<a>{item.alarm_name}</a>}
              description={item.alarm_description}
            />
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default AlertList;
