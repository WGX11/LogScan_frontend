import { ConfigProvider, FloatButton } from 'antd';
import zhCn from 'antd/lib/locale/zh_CN';
import router from './router';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <ConfigProvider locale={zhCn}>
        <RouterProvider router={router}/>
    </ConfigProvider>
  );
}

export default App;