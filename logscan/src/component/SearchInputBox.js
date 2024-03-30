import React, { useState } from 'react';
import { AutoComplete, Input, Tooltip, Button } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import '../index.css';
import LogContext from '../pages/SearchPage/LogContext';
import { useContext } from 'react';
import './SearchInputBox.css';

const SearchInputBox = () => {
  // 维护一个状态来存储查询历史
  const [queryHistory, setQueryHistory] = useState([]);
  const [options, setOptions] = useState([]);
  const {setLuceneString} = useContext(LogContext);

  const handleSearch = (value) => {
    // 更新查询历史
    if (value && !queryHistory.includes(value)) {
      setQueryHistory(prevHistory => [...prevHistory, value]);
    }
    setLuceneString(value);
  };

    const handleInput = (value) => {
        // 基于当前输入更新自动完成选项
        if (!value) {
            setOptions(queryHistory.map(item => ({
                value: item,
                label: item,
            })));
        } else {
        const filteredHistory = queryHistory.filter(item => item.includes(value));
        const newOptions = filteredHistory.map(item => ({
            value: item,
            label: item,
        }));
        setOptions(newOptions);
        }
    }   

  return (
    <div>
        <AutoComplete
        popupMatchSelectWidth={800}
        style={{ width: 1050 }}
        options={options}
        onSearch={handleInput}
        >
        <Input.Search
            className='search-input-box'
            size="large"
            placeholder="输入Lucene表达式"
            enterButton
            style={{ width: '1000px', paddingLeft: '10px' }}
            onSearch={handleSearch}
        />
        </AutoComplete>
        <Tooltip title="如何使用Lucene表达式？">
            <Button shape="circle" icon={<BulbOutlined />}/>
        </Tooltip>
        
    </div>
  );
};

export default SearchInputBox;
