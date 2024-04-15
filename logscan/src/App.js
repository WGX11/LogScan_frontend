import { ConfigProvider, FloatButton } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import SearchPage from './pages/SearchPage/SearchPage';
import zhCn from 'antd/lib/locale/zh_CN';
import router from './router';
import { RouterProvider } from 'react-router-dom';
import Navigation from "./component/Navigation";

function App() {
  return (
    <ConfigProvider locale={zhCn}>
      <div>
        <Navigation />
        <RouterProvider router={router}/>
        <FloatButton
        icon={<FileTextOutlined />}
        description="HELP"
        shape="square"
      />
      </div>
    </ConfigProvider>
  );
}

export default App;