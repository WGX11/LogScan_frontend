import { useContext, useEffect, useState } from 'react';
import React  from 'react';
import { Badge, Descriptions,  Space, Table, Tag, Checkbox, List} from 'antd';
import './InforTable.css';
import LogContext from './LogContext';




const columns = [
  {
    title: 'Message',
    dataIndex: 'message',
    key: 'message',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Time',
    dataIndex: 'timeStamps',
    key: 'timeStamps',
  },
  {
    title: 'Host',
    dataIndex: 'host',
    key: 'host',
  },
  {
    title: 'Level',
    key: 'level',
    dataIndex: 'level',
    render: (level) => {
      let color = 'green'
      if (level === 'Error') {
        color = 'red'
      }else if (level === 'Warn') {
        color = 'yellow'
      }else if (level === 'Info') {
        color = 'blue'
      }else if (level === 'Debug') {
        color = 'purple'
      }else if (level === 'Trace') {
        color = 'cyan'
      }else if (level === 'Fatal') {
        color = 'magenta'
      }
      return (
        <span>
          <Tag color={color} key={level}>
            {level.toUpperCase()}
          </Tag>
        </span>
      )
    }
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      if (status === 'Normal') {
        return <Badge status="processing" text="正常" color="green" />
      }else {
        return <Badge status="processing" text="异常" color="red" />
      }

    },
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>检查</a>
      </Space>
    ),
  },
];


const InforTable = () => {
  const  {logData}  = useContext(LogContext);
  const [datatest, setData] = useState([]);
  useEffect(() => {
    const logDataArray = Array.from(logData)
    if (logDataArray.length === 0) {
      setData([])
      return
    }
    const dataTmp = logDataArray.map((_, index) => {
      return {
        message: logDataArray[index]._source.message,
        timeStamps: logDataArray[index]._source['@timestamp'],
        host: logDataArray[index]._source.host,
        level: logDataArray[index]._source.level,
        key: logDataArray[index]._id,
        status: logDataArray[index]._source.level === 'Normal' ? 'Normal' : 'Error',
      }
    })
    setData(dataTmp)
  }, [logData])
  const [columnSelect, setColumnSelect] = useState(columns.filter(col => ['timeStamps', 'message', 'host', 'level', 'status', 'action'].includes(col.key)));
  const onSelectChange = (selectedColumnsKeys) => {
    const newColumns = columns.filter(col => selectedColumnsKeys.includes(col.key));
    setColumnSelect(newColumns);
  }
  return (
    <div className='side-by-side'>
      <FilterableTable onSelectChange={onSelectChange}/>
      <Table
        style={{minWidth: '900px', marginLeft: '80px'}} 
        columns={columnSelect} 
        dataSource={datatest}
        expandable={{
          expandedRowRender: ((record) => {
            const items = [
              {
                key: '1',
                label: '日志类别',
                children: 'ThunderBird',
              },
              {
                key: '2',
                label: '节点名称',
                children: record.host,
              },
              {
                key: '3',
                label: '日志级别',
                children: record.level,
              },
              {
                key: '4',
                label: '日志时间戳',
                children: record.timeStamps,
              },
              {
                key: '5',
                label: '采集时间',
                span: 2,
                children: record.timeStamps,
              },
              {
                key: '6',
                label: '日志状态',
                span: 1,
                children:( () => {
                  let color = 'green'
                  let text = '正常'
                  if (record.level !== 'Normal') {
                    color = 'red'
                    text = '异常'
                  }
                  return <Badge status="processing" text={text} color={color} />
                })(),
              },
              {
                key: '7',
                span: 2,
                label: '输入源',
                children: 'input',
              },
              {
                key: '8',
                span: 3,
                label: '日志内容',
                children: record.message,
              },
              {
                key: '9',
                label: '日志描述',
                children: '暂未描述',
              },
            ];
            return  <Descriptions title="日志详细信息" layout="horizontal" bordered items={items} />
          }
          )
        }} 
      />
    </div>
  )
}

let selectedColumnsKeys = ['timeStamps', 'message', 'host', 'level', 'status', 'action']
const FilterableTable = ({onSelectChange}) => {

  const handleColumnChange = (e, key) => {
    const checked = e.target.checked;
    if (checked) {
      selectedColumnsKeys.push(key);
    } else {
      selectedColumnsKeys = selectedColumnsKeys.filter(t => t !== key);
    }
    onSelectChange(selectedColumnsKeys);
  };


  return (
    <div>
      <List
        style={{width: '200px'}}
        dataSource={columns}
        renderItem={item => 
          <List.Item >
            <Checkbox 
              defaultChecked={['timeStamps', 'message', 'host', 'level', 'status', 'action'].includes(item.key)}
              onChange={(e) => handleColumnChange(e, item.key)}
            >
              {item.title}
            </Checkbox>
          </List.Item>
          }
      />
    </div>
  );
};
export default InforTable;