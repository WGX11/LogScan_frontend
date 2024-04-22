import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from  './component/Navigation';
import { FloatButton } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const PageLayout = () => {
  return (
    <>
      <Navigation />
      <Outlet /> 
      <FloatButton
        icon={<FileTextOutlined />}
        description="HELP"
        shape="square"
      />
    </>
  );
};

export default PageLayout;
