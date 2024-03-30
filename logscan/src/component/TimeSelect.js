import React, { useEffect, useRef, useState, useContext } from 'react';
import { Modal, DatePicker, Button, Tabs, Tooltip} from 'antd';
import { FieldTimeOutlined, ClockCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Collapse, Input, Typography, Select, Badge, Card, Space, Switch} from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import './TimeSelect.css';
import LogContext from '../pages/SearchPage/LogContext';
import { parseISO } from 'date-fns';
import { formatISO } from 'date-fns';

dayjs.locale('zh-cn');

const { Text } = Typography;
const { Option } = Select;


const TimeSelect = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    //tmptime是给输入框用的，start和end是给后端用的
    const { setStartTime, setEndTime, startTime, endTime} = useContext(LogContext);
    const [tmpEndTime, setTmpEndTime] = useState('');
    const [tmpStartTime, setTmpStartTime] = useState('');
    const cardRef = useRef(null);
    const [timeValid, setTimeValid] = useState(false);
    const showModal = () => {
      setIsModalVisible(true);
    };
  
    const handleOk = () => {
      setIsModalVisible(false);
      setStartTime(formatISO(tmpStartTime));
      setEndTime(formatISO(tmpEndTime));
    };
  
    const handleCancel = () => {
      setIsModalVisible(false);
    };

    const items = [
      {
        key: '1',
        label: '日历',
        children: <AbsolutePicker
          setTimeValid={setTimeValid}
          tmpEndTime={tmpEndTime}
          tmpStartTime={tmpStartTime}
          setTmpEndTime={setTmpEndTime}
          setTmpStartTime={setTmpStartTime}
        />,
      },
      {
        key: '2',
        label: '时间戳',
        children: <AbsoluteWrite
          setTimeValid={setTimeValid}
          tmpEndTime={tmpEndTime}
          tmpStartTime={tmpStartTime}
          setTmpEndTime={setTmpEndTime}
          setTmpStartTime={setTmpStartTime}
        />,
      },
    ] 
  
    return (
      <div>
        <div className='time-show'>
          <Button type="primary" onClick={showModal} icon={<FieldTimeOutlined />} style={{height: '50px'}}>
            选择时间
          </Button>
          <div style={{marginLeft:'50px', height:'140px', width:'400px'}} onClick={showModal}>
            <Badge.Ribbon text="Time">
              <Card title="时间范围" size="small" >
                <div className='time-select-write' >
                  <div className='time-select-write'>
                    <Text strong >开始时间：</Text>
                    <div className='text-box'>
                      <Text>{dayjs(startTime).format('YYYY-MM-DD HH:mm')}</Text>
                    </div>
                  </div>
                  <div>
                  <div className='time-select-write' style={{margin:'10px'}}>
                    <Text strong>结束时间：</Text>
                    <div className='text-box'>
                      <Text>{dayjs(endTime).format('YYYY-MM-DD HH:mm')}</Text>
                    </div>
                  </div>
                  </div>
                </div>
              </Card>
            </Badge.Ribbon>
          </div>
          <div style={{marginLeft:'400px'}}>
            <Update/>
          </div>
        </div>
        <Modal title="配置时间" open={isModalVisible} onOk={handleOk} onCancel={handleCancel} okButtonProps={{disabled:!timeValid}}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="绝对时间" key="1">
              <Collapse accordion items={items} size='small' ghost/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="相对时间" key="2">
              <div>
                <RelativePicker
                setTimeValid={setTimeValid}
                setTmpEndTime={setTmpEndTime}
                setTmpStartTime={setTmpStartTime}
                />
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      </div>
    );
  };

const AbsolutePicker = (props) => {
    const { RangePicker } = DatePicker;
    const { setTmpStartTime, setTmpEndTime, setTimeValid } = props
    const [selectDate, setSelectDate] = useState([dayjs().subtract(15, 'minute'), dayjs()])
    const handleRangeChange = (date) => {
      setSelectDate(date);
      let start = date[0].format('YYYY-MM-DD HH:mm:ss');
      let end = date[1].format('YYYY-MM-DD HH:mm:ss');
      setTmpStartTime(start);
      setTmpEndTime(end);
      setTimeValid(true);
      console.log(start)
    }
    return (
      <RangePicker 
      showTime={true}
      format='YYYY-MM-DD HH:mm'
      onOk={handleRangeChange}
      value={selectDate}
      />
    )
}

const AbsoluteWrite = (props) => {
    const { tmpStartTime, tmpEndTime, setTmpStartTime, setTmpEndTime } = props;
    const setTimeValid = props.setTimeValid;
    const setEndTime = () => {
      setTmpEndTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
      checkTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
      if (checkTime(tmpStartTime)) {
        setTimeValid(true);
        setInputValid(true);
      } else {
        setTimeValid(false);
        setInputValid(false);
      }
    }
    const setStartTime = () => {
      setTmpStartTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
      checkTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
      if (checkTime(tmpEndTime)) {
        setTimeValid(true);
        setInputValid(true);
      } else {
        setTimeValid(false);
        setInputValid(false);
      }
    } 
    const changeStartTime = (e) => {
      setTmpStartTime(e.target.value);
      if (checkTime(e.target.value) && checkTime(tmpEndTime)) {
        setTimeValid(true);
        setInputValid(true);
      } else {
        setInputValid(false);
        setInputValid(false); 
      }
    }
    const changeEndTime = (e) => {
      setTmpEndTime(e.target.value);
      if (checkTime(e.target.value) && checkTime(tmpStartTime)) {
        setTimeValid(true);
        setInputValid(true);
      } else {
        setInputValid(false);
        setInputValid(false);
      }
    }
    const checkTime = (time) => {
      if (dayjs(time, 'YYYY-MM-DD HH:mm:ss', true).isValid() || dayjs(time, 'YYYY-MM-DD', true).isValid()) {
        return true
      } else {
        return false
      }
    }
    
    const [inputValid, setInputValid] = useState(false);
    return (
      <div>
        <div style={{marginBottom:'15px'}}>
          <Text>输入时间戳的格式应该为 </Text>
          <Text type='warning'>YYYY-MM-DD [HH:mm:ss] </Text>
          <Text>[ ]内为可选部分</Text>
        </div>
        <div className='time-select-write'>
          <div className='time-select-write'>
            <Input placeholder="请输入开始时间戳" value={tmpStartTime} onChange={changeStartTime} /> 
            <Tooltip title="获取当前时间">
              <Button type="primary" onClick={setStartTime} icon={<ClockCircleOutlined />}/>
            </Tooltip>
          </div>
          <ArrowRightOutlined style={{color: 'blue', margin: '5px'}}/>
          <div className='time-select-write'>
            <Input placeholder="请输入结束时间戳" value={tmpEndTime} onChange={changeEndTime} /> 
            <Tooltip title="获取当前时间">
              <Button type="primary" onClick={setEndTime} icon={<ClockCircleOutlined />}/>
            </Tooltip>
          </div>
        </div>
        <div style={{marginTop:'10px'}}>
          {!inputValid && <Text type='danger' visible='false'>注意：时间戳格式不正确，请检查并修改</Text>}
        </div>
      </div>
    )
}

const RelativePicker = (props) => {
  const { setTmpStartTime, setTmpEndTime, setTimeValid } = props;
  const handleChange = (value) => {
    setTmpEndTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    if (value === 'all') {
      setTmpStartTime(dayjs().subtract(30, 'year').format('YYYY-MM-DD HH:mm:ss'));
    } else if (value === '30d') {
      setTmpStartTime(dayjs().subtract(30, 'day').format('YYYY-MM-DD HH:mm:ss'));
    } else if (value === '14d') {
      setTmpStartTime(dayjs().subtract(14, 'day').format('YYYY-MM-DD HH:mm:ss'));
    } else if (value === '7d') {
      setTmpStartTime(dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'));
    } else if (value === '3d') {
      setTmpStartTime(dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'));
    } else if (value === '1d') {
      setTmpStartTime(dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'));
    } else if (value === '12h') {
      setTmpStartTime(dayjs().subtract(12, 'hour').format('YYYY-MM-DD HH:mm:ss'));
    } else if (value === '6h') {
      setTmpStartTime(dayjs().subtract(6, 'hour').format('YYYY-MM-DD HH:mm:ss'));
    } else if (value === '3h') {
      setTmpStartTime(dayjs().subtract(3, 'hour').format('YYYY-MM-DD HH:mm:ss'));
    } else if (value === '1h') {
      setTmpStartTime(dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'));
    } else if (value === '30m') {
      setTmpStartTime(dayjs().subtract(30, 'minute').format('YYYY-MM-DD HH:mm:ss'));
    } else if (value === '15m') {
      setTmpStartTime(dayjs().subtract(15, 'minute').format('YYYY-MM-DD HH:mm:ss'));
    } else if (value === '5m') {
      setTmpStartTime(dayjs().subtract(5, 'minute').format('YYYY-MM-DD HH:mm:ss'));
    } 
    setTimeValid(true)
  };

  return (
    <Select defaultValue="5m" style={{ width: 400 }} onChange={handleChange} 
    dropdownRender={menu => (
      <>
        <div style={{ padding: 8, textAlign: 'center' }}>距离现在时间</div>
        {menu}
      </>
    )}>
    <Option value="5m">5 分钟</Option>
    <Option value="15m">15 分钟</Option>
    <Option value="30m">30 分钟</Option>
    <Option value="1h">1 小时</Option>
    <Option value="3h">3 小时</Option>
    <Option value="6h">6 小时</Option>
    <Option value="12h">12 小时</Option>
    <Option value="1d">1 天</Option>
    <Option value="3d">3 天</Option>
    <Option value="7d">7 天</Option>
    <Option value="14d">14 天</Option>
    <Option value="30d">30 天</Option>
    <Option value="all">全部</Option>
    </Select>
  );
};

const Update = () => {
  const [show, setShow] = useState(true);
  return (
    <Space>
      <Switch 
      checked={show}
      onChange={() => setShow(!show)}
      checkedChildren="更新"
      unCheckedChildren="不更新"
       />
      <Badge count={show ? 11 : 0} showZero color="#faad14" />
      <Badge count={show ? 25 : 0} />
      <Badge
        count={
          show ? (
            <ClockCircleOutlined
              style={{
                color: '#f5222d',
              }}
            />
          ) : (
            0
          )
        }
      />
      <Badge
        className="site-badge-count-109"
        count={show ? 109 : 0}
        style={{
          backgroundColor: '#52c41a',
        }}
      />
    </Space>
  );
};
  
  export default TimeSelect;
  
