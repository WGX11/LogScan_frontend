import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusSquareOutlined, SearchOutlined, AlertOutlined, EyeOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { Menu, Layout, Button} from 'antd';
import logo from '../assets/logo.jpg';
import './Navigation.css';


const { Header} = Layout;
const items = [
  {
    label: '搜索',
    key: '/search',
    icon: <SearchOutlined />,
  },
  {
    label: '输入',
    key: '/input',
    icon: <PlusSquareOutlined />,
  },
  {
    label: '警报',
    key: '/alert',
    icon: <AlertOutlined />,
  },
  {
    label: '监控面板',
    key: '/monitor',
    icon: <EyeOutlined />,
  },
  {
    label: '论坛',
    key: '/forum',
    icon: <TeamOutlined />,
  }
];
const Navigation = () => {
  const [current, setCurrent] = useState('/')
  const navigator = useNavigate()
  const location = useLocation(); 
  useEffect(() => {
    setCurrent(location.pathname)
  }
  , [location])
  const onClick = (e) => {
    setCurrent(e.key)
    navigator(e.key)
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