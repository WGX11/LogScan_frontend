import React, { useState } from 'react';
import './BreathingLight.css';
import { Row, Col, Pagination } from 'antd';

const BreathingLight = () => {
  return (
    <div className='app'>
     <Display />
    </div>
  );
}

const Display = () => {
  const horizontalGutter = 6;  // 水平间距
  const verticalGutter = 10;    // 垂直间距
  const totalNum = 120;
  const pageSize = 30; 
  const [currentPage, setCurrentPage] = useState(1);


  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentItems = Array.from({ length: totalNum }).slice(indexOfFirstItem, indexOfLastItem);

  const cols = currentItems.map((item, index) => {
    const keyIndex = index + indexOfFirstItem; // 确保key的唯一性
    return (
      <Col key={keyIndex.toString()}  span={4}>
        <div className='light green'><ArtisticText name={`host${keyIndex + 1}`}/></div>
      </Col>
    );
  });

  const handleChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className='right-half  display-pagination-container' >
      <Pagination 
        current={currentPage}
        onChange={handleChange}
        total={totalNum}
        pageSize={pageSize}
        style={{marginRight: '30px'}}
        showSizeChanger={false}  // 可以设置为true以允许用户改变每页数量
      />
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

export default BreathingLight;
