import React, { useState } from 'react';
import { Form, Input, Button, List, Typography, Card, Select, Popconfirm, message, Checkbox, Radio, Modal} from 'antd';
import {Layout} from 'antd';
import axios from 'axios'
import { CheckCircleTwoTone } from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
const { TextArea } = Input;

const { Content } = Layout;
const AddAlertFormPage = () => {
  const [log, setLog] = useState('');
  const [logs, setLogs] = useState([]);
  const [messageApi, contextHolder] = message.useMessage()
  const [emailNotification, setEmailNotification] = useState(false)
  const [messageNotification, setMessageNotification] = useState(false)
  const [options, setOptions] = useState(['Option 1', 'Option 2', 'Option 3', 'Demo']);
  const [form] = Form.useForm();
  const navigator = useNavigate();

  const handleAddLog = () => {
    const l = logs.length + 1;
    if (l > 100) {
      messageApi.warning('日志数量已达上限');
      return 
    }
    if (log.trim()) {  
      setLogs([...logs, log]);
      setLog('');  // 清空输入框
    }
  };

  const handleDeleteLog = (index) => {
    setLogs(currentLogs => currentLogs.filter((_, idx) => idx !== index));
  };



  const  handleSubmit = async (value) => {
    const l = logs.length;
    if (l === 0) {
      messageApi.warning('日志列表为空，请添加日志');
      return;
    }
    value.logs = logs;
    try {
      console.log('value:', value);
      const response = await axios.post('http://localhost:9031/alarmAdd', value);
      if (response.status !== 200) {
        Modal.error({
          title: '警报提交失败',
          content: '请联系平台管理人员或稍后再试',
        });
        return;
      }
      Modal.success({
        title: '警报提交成功',
        content: '成功添加了一条警报，3秒后自动返回警报页面',
        onOk: () => {
          navigator('/alert');
        }
      });
      setTimeout(() => {
        navigator('/alert');
      }, 3000);
      console.log('Success:', response);
    } catch (error) {
      Modal.error({
        title: '警报提交失败',
        content: '请联系平台管理人员或稍后再试',
      });
      console.error('Failed to submit:', error);
    }
  };

  return (
    <Layout>
      <Content>
        <div style={{margin:20}}>
          {contextHolder}
          <Card title="日志警报信息" style={{ width: 1000, margin: "auto" }}>
            <Form
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 20,
              }}
              layout="horizontal"
              style={{
                width: 900,
              }}
              form={form}
              onFinish={handleSubmit}
              initialValues={{ 
                emailNotification: false ,
                messageNotification: false,
                email: '',
                description: '',
                phoneNumber: '',
              }}
            >
            <Form.Item 
              label="警报名称"
              name="name"
              rules={[{required: true, message: '请输入警报名称!'}]}
            >
              <Input maxLength={20}  placeholder="请输入警报名称"/>
            </Form.Item>
            <Form.Item 
              label= "日志输入源"
              name= "input"
              rules={[{required: true, message: '请选择日志输入源!'}]}
            >
              <Select
                showSearch
                placeholder="请选择日志输入源"
                options={options.map((item) => ({ value: item, label: item }))}
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
              />
            </Form.Item>
            <Form.Item
              name="matchType"
              label="匹配方式"
              rules={[{ required: true, message: '请选择一种匹配方式' }]}
            >
              <Radio.Group>
                <Radio value="approximate"> 模糊匹配 </Radio>
                <Radio value="accurate"> 精确匹配 </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="输入日志">
              <TextArea 
                rows={2}
                value={log}
                onChange={(e) => setLog(e.target.value)}
                placeholder="请输入日志内容，按回车添加日志"
                maxLength={500}
                onKeyDown={(e) => {if (e.key === 'Enter'){ handleAddLog(); e.preventDefault();}}}
              />
            </Form.Item>
            <Form.Item 
              label="日志列表" 
              style={{overflow: 'auto', maxHeight: '800px'}}
              rules={[{required: true, message: '请添加日志!'}]}
              >
              <List
                bordered
                dataSource={logs}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      <Popconfirm
                      title="删除日志"
                      description="确定删除这条日志吗?"
                      onConfirm={()=>handleDeleteLog(index)}
                      okText="确定"
                      cancelText="取消"
                      >
                        <Button type="link">删除</Button>
                      </Popconfirm>
                    ]}
                  >
                    <Typography.Text type='success' strong>{index + 1}.</Typography.Text>
                    <div style={{ wordWrap: 'break-word', width: '80%' }}>{item}</div>
                  </List.Item>
                )}
              />
            </Form.Item>
            <Form.Item 
                label="警报描述"
                name="description"
              >
                <TextArea 
                  rows={4}
                  placeholder="请输入该警报的描述信息"
                  maxLength={500}
                />
              </Form.Item>
            <Form.Item 
              label="邮件通知" 
              name="emailNotification" 
              valuePropName="checked"
            >
              <Checkbox
                checked={emailNotification}
                onChange={(e) => setEmailNotification(e.target.checked)} 
              />
            </Form.Item>
            <Form.Item 
              label="邮箱"
              name="email"
              rules={[{required: emailNotification, message: '请输入邮箱!'}]}
            >
              <Input maxLength={20}  placeholder="请输入邮箱" disabled={!emailNotification}/>
            </Form.Item>
            <Form.Item 
              label="短信通知" 
              name="messageNotification" 
              valuePropName="checked"
            >
              <Checkbox
                checked={messageNotification}
                onChange={(e) => setMessageNotification(e.target.checked)} 
              />
            </Form.Item>
            <Form.Item 
              label="手机号码"
              name="phoneNumber"
              rules={[{required: messageNotification, message: '请输入手机号码!'}]}
            >
              <Input maxLength={20}  placeholder="请输入手机号码" disabled={!messageNotification}/>
            </Form.Item>
            <Form.Item >
              <Button type="primary" style={{margin:'20px 80px 20px 400px'}} htmlType='submit'>提交</Button>
              <Button>取消</Button>
            </Form.Item>
            </Form>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default AddAlertFormPage;
