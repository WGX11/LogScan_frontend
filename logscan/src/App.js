import { ConfigProvider, FloatButton } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import SearchPage from './pages/SearchPage/SearchPage';
import zhCn from 'antd/lib/locale/zh_CN';


function App() {
  return (
    <ConfigProvider locale={zhCn}>
      <div>
        <SearchPage />
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