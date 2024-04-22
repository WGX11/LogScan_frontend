import React, { useState, useEffect } from 'react';
import './BreathingLight.css';
import { Row, Col, Pagination,  Select, Tag , Switch, InputNumber } from 'antd';
import axios from 'axios';
import { formatISO } from 'date-fns';
import { useContext } from 'react';
import LogContext from '../pages/SearchPage/LogContext';
import { useNavigate } from 'react-router-dom';


const BreathingLight = () => {
  return (
    <div className='app'>
     <Display />
    </div>
  );
}

const Display = () => {
  const navigator = useNavigate()
  const horizontalGutter = 3;  // 水平间距
  const verticalGutter = 6;    // 垂直间距
  const pageSize = 40; 
  const [currentPage, setCurrentPage] = useState(1);
  const [isAutoScroll, setIsAutoScroll] = useState(true); 
  const [ isHostListUpdate, setIsHostListUpdate ] = useState(false)
  const [ hostListOptions, setHostListOptions ] = useState([])
  const [selectedHosts, setSelectedHosts] = useState([])
  const [ alertThreshold1, setAlertThreshold1 ] = useState(10)
  const [ alertThreshold2, setAlertThreshold2 ] = useState(50)
  
  const {startTime, endTime} = useContext(LogContext);
  const [hostData, setHostData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const startTime_ = formatISO(startTime)
      const endTime_ = formatISO(endTime)
      try{
          const response = await axios.get("http://localhost:9031/monitorData", {
              params: {
                  start: startTime_,
                  end: endTime_,
              }
          })
          const data = await response.data
          const oldData = {...hostData}
          const listData = {}
          for (const key in oldData) {
            if (!(key in data)) {
              data[key] = 0
            }
          }
          for (const key in data) {
            if (selectedHosts.includes(key)) {
              listData[key] = data[key]
            }
          }
          if (isHostListUpdate) {
            setHostData(data)
            setSelectedHosts(Object.keys(data))
            setHostListOptions(Object.keys(data).map((host) => ({label: host, value: host})))
          } else {
            setHostData(listData)
          }
          
      }catch (error){
          console.error(error)
      }
  }
  fetchData()
  },[startTime, endTime])
  const totalNum = Object.keys(hostData).length;
  const totalPages = Math.ceil(totalNum / pageSize);

  useEffect(() => {
    let intervalId;
    if (isAutoScroll) {
      intervalId = setInterval(() => {
        setCurrentPage((prevPage) => {
          // 如果当前页是最后一页，则返回第一页，否则返回下一页
          return prevPage >= totalPages ? 1 : prevPage + 1;
        });
      }, 30000); //
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId); 
      }
    };
  }, [totalPages, isAutoScroll]); 

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const entries = Object.entries(hostData).sort((a, b) => {
    return a[0].localeCompare(b[0]);    
  });
  const currentItems = entries.slice(indexOfFirstItem, indexOfLastItem);
  const clickHandler = (host) => {
    const tmpStartTime = formatISO(startTime)
    const tmpEndTime = formatISO(endTime)
    const queryString = new URLSearchParams({
      start: encodeURIComponent(tmpStartTime),
      end: encodeURIComponent(tmpEndTime),
      lucene: encodeURIComponent(host)
    }).toString();
    window.open(`http://localhost:3000/search?${queryString}`, '_blank')
  }
  const cols = currentItems.map((item, index) => {
    const keyIndex = index + indexOfFirstItem; // 确保key的唯一性
    let color = 'green'
    if (item[1] >= alertThreshold2) {
      color = 'red'
    } else if (item[1] >= alertThreshold1) {
      color = 'yellow'
    }
    return (
      <Col key={keyIndex.toString()}  span={3} onClick={()=>clickHandler(item[0])}>
        <div className={`light ${color}`}><ArtisticText name={item[0]}/></div>
      </Col>
    );
  });


  const handleChange = (page) => {
    setCurrentPage(page);
  };

  const handleAutoScrollChange = (checked) => {
    setIsAutoScroll(checked);
  };

  const handleAutoHostListChange = (checked) => {
    setIsHostListUpdate(checked);
  };

  const setAlert1 = (value) => {
    if (value === undefined || value === null) {
      setAlertThreshold1(1)
    } else {
    setAlertThreshold1(value)
   }
}

  const setAlert2 = (value) => {
    if (value === undefined || value === null) {
      setAlertThreshold2(2)
    } else {
    setAlertThreshold2(value)
   }
  }

  return (
    <div className='right-half  display-pagination-container' >
      <div
        style={
          {
            marginRight: '0px',
            marginLeft: '10px',
          }
        }
      >
        <Pagination 
        style={
          {marginTop: '50px'}
        }
          current={currentPage}
          onChange={handleChange}
          total={totalNum}
          pageSize={pageSize}
          showSizeChanger={false}  // 可以设置为true以允许用户改变每页数量
        />
        <Switch
          checked={isAutoScroll}
          onChange={handleAutoScrollChange}
          checkedChildren="页面滚动开启"
          unCheckedChildren="页面滚动关闭"
          style={{marginTop: '20px'}}
        />
        <Switch
          checked={isHostListUpdate}
          onChange={handleAutoHostListChange}
          checkedChildren="节点列表自动更新开启"
          unCheckedChildren="节点列表自动更新关闭"
          style={{marginTop: '20px', marginLeft: '20px'}}
        />
        <div
          style={
            {
              marginTop: '20px',
              display: 'flex',
            }
          } 
        >
        <InputNumber
          style={{marginRight: '20px', width: '120px'}}
          placeholder='黄色警报阈值'
          onChange={setAlert1}
          min={1}
          value={alertThreshold1}
          defaultValue={10}
        />
         <InputNumber
          style={{marginRight: '20px', width: '120px'}}
          placeholder='红色色警报阈值'
          onChange={setAlert2}
          min={alertThreshold1 + 1}
          value={alertThreshold2}
        />
        </div>
        <SelectHost 
          hostListOptions={hostListOptions} 
          setHostData={setHostData}
          hostData={hostData}
          selectedHosts={selectedHosts}
          setSelectedHosts={setSelectedHosts}
        />
      </div>
      <Row gutter={[horizontalGutter, verticalGutter]} wrap>{cols}</Row>
    </div>
  );
};

const ArtisticText = (props) => {
  return (
    <div className="artistic-text">
      {props.name}
    </div>
  );
};


const tagRender = (props) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={'cyan'}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{
        marginInlineEnd: 3,
      }}
    >
      {label}
    </Tag>
  );
};

const SelectHost = (props) => {
  const setHostData = props.setHostData
  const hostData = props.hostData
  const setSelectedHosts = props.setSelectedHosts
  const selectedHosts = props.selectedHosts
  const handleChange = (value)=> {
    const list = {}
    value.forEach((host) => {
      list[host] = 0
    })
    for (const key in list) {
      if (!(key in hostData)) {
        hostData[key] = 0
      }
    }
    for (const key in hostData) {
      if (!(key in list)) {
        delete hostData[key]
      }
    }
    setHostData(hostData)
    setSelectedHosts(value)
  }
  return (
    <Select
      className='breathing-light-selector'
      mode="tags"
      tagRender={tagRender}
      onChange={handleChange}
      value={selectedHosts}
      tokenSeparators={[',']}
      style={{
        minWidth: '350px',
        maxWidth: '350px',
        marginTop: '30px',
      }}
      options={props.hostListOptions}
    />
    )
};

export default BreathingLight;
