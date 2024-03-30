import React, { useState } from 'react';
import { DragOutlined } from '@ant-design/icons';
import SearchBarChart from './SearchBarChart';
import InforTable from './InforTable';
import '../../index.css'

const DragDropDemo = () => {
  const [blocks, setBlocks] = useState([
    { id: 1, component: 
    <div className='content-box'>
        <DragOutlined
            style={{position: 'absolute', top: '10px', left: '10px', fontSize: '20px', cursor: 'move', color:'gray'}}
        />
        <div style={{height:'20px', width:'20px'}}/>
    <SearchBarChart/></div> 
    },
    { id: 2, component: 
    <div className='content-box'>
        <DragOutlined
            style={{position: 'absolute', top: '10px', left: '10px', fontSize: '20px', cursor: 'move', color:'gray'}}
        />
        <div style={{height:'20px', width:'20px'}}/>
        <InforTable/>
    </div>
    }
  ]);

  const dragStart = (e, position) => {
    e.dataTransfer.setData('startPosition', position);
  };

  const onDrop = (e, endPosition) => {
    let startPosition = e.dataTransfer.getData('startPosition');
    startPosition = parseInt(startPosition, 10);
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(startPosition, 1);
    newBlocks.splice(endPosition, 0, removed);
    setBlocks(newBlocks);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      {blocks.map((block, index) => (
        <div
          key={block.id}
          draggable
          onDragStart={(e) => dragStart(e, index)}
          onDrop={(e) => onDrop(e, index)}
          onDragOver={allowDrop}
          
        >
          {block.component}
        </div>
      ))}
    </div>
  );
};

export default DragDropDemo;
