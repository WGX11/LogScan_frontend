import React, { useState } from 'react';
import { PlusSquareOutlined, SearchOutlined, AlertOutlined, EyeOutlined, UserOutlined,} from '@ant-design/icons';
import { Menu, Layout, Button} from 'antd';
import logo from '../assets/logo.jpg';
import './Navigation.css';
const { Header} = Layout;
const items = [
  {
    label: '搜索',
    key: 'mail',
    icon: <SearchOutlined />,
  },
  {
    label: '输入',
    key: 'app',
    icon: <PlusSquareOutlined />,
  },
  {
    label: '警报',
    key: 'SubMenu',
    icon: <AlertOutlined />,
    children: [
      {
        type: 'group',
        label: 'Item 1',
        children: [
          {
            label: 'Option 1',
            key: 'setting:1',
          },
          {
            label: 'Option 2',
            key: 'setting:2',
          },
        ],
      },
      {
        type: 'group',
        label: 'Item 2',
        children: [
          {
            label: 'Option 3',
            key: 'setting:3',
          },
          {
            label: 'Option 4',
            key: 'setting:4',
          },
        ],
      },
    ],
  },
  {
    label: '监控面板',
    key: 'monitor',
    icon: <EyeOutlined />,
  },
  
];
const Navigation = () => {
  const [current, setCurrent] = useState('mail');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return (
    <Header
    className='custom-header'
    style={{
      display: 'flex',
      alignItems: 'center',
    }}>
      <img className='logo' src={logo} alt='logo'/>
      <Menu 
      onClick={onClick} 
      selectedKeys={[current]} 
      mode="horizontal" 
      items={items} 
      style={{
        flex: 1,
        minWidth: 0,
      }}
      />
      <Button
        className='userIcon'
        icon={<UserOutlined />}
      />
    </Header>
  );
};
export default Navigation;