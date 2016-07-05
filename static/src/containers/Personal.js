/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-11T12:16:28+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-04-21T00:14:10+08:00
* @License: The MIT License (MIT)
*/


import React from 'react';
import Antd, {
  Upload,
  Form,
  Button,
  Input,
  Radio,
  Row,
  Col,
} from 'antd';
import { reduxForm } from 'redux-form';

import ChangePassword from '../components/ChangePassword';
import DynamicPassword from '../components/DynamicPassword';
import PKIModalButton from '../components/PKIModalButton';
import { fields } from '../reducers/personal';
import { savePersonal, changePassword, checkDynamicPassword } from '../actions';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const noop = () => {};

const PersonalForm = React.createClass({
  propTypes: {
    onOk: React.PropTypes.func,
    onUpload: React.PropTypes.func,
    onCancel: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      onOk: noop,
      onUpload: noop,
      onCancel: noop,
    };
  },

  getInitialState() {
    return {
      onOk: noop,
    };
  },

  handleChangePassword(...args) {
    return this.props.changePassword(...args)
      .then(() => {
        Antd.message.success('修改密码成功,请重新扫描动态密码!', 5);
      })
      .catch(error => {
        Antd.message.error((error.data && error.data.value) || error.message);
      });
  },

  changeDynamicPassword(...args) {
    return this.props.checkDynamicPassword(...args)
      .then(() => Antd.message.success('校验成功'))
      .catch(() => Antd.message.error('校验失败'));
  },

  savePersonal(...args) {
    return savePersonal(...args)
      .then(() => {
        Antd.message.success('编辑成功');
        this.props.onOk();
      })
      .catch(error => {
        Antd.message.error(error.message, 3);
      });
  },

  render() {
    const {
      fields: { username, realname, aliasname, mobile, email,
        gender, key, notp },
      handleSubmit,
      submitting,
      personal: { formErrors },
    } = this.props;

    const errorStatus = (field) => formErrors[field] ? 'error' : '';
    const help = (field) => formErrors[field];
    const style = {
      margin: '10px',
    };
    return (
      <div>
        <Row>
          <Col span={12} offset={6}>
            <Form className="box" onSubmit={handleSubmit(this.savePersonal)}>
              <FormItem className="row-flex row-flex-center">
                <Upload
                  showUploadList={false}
                  name="avatar"
                  action="/api/users/self/avatar"
                  onChange={this.props.onUpload}
                >
                  <img src="/api/users/self/avatar"
                    width="120"
                    className="avatar"
                  />
                </Upload>
              </FormItem>
              <Row>
                <Col span="11">
                  <Form.Item
                    label="用户名："
                    validateStatus={errorStatus('username')}
                    help={help('username')}
                  >
                    <Input disabled {...username} />
                  </Form.Item>
                </Col>
                <Col span="11" offset="2">
                  <Form.Item
                    label="性别："
                    validateStatus={errorStatus('gender')}
                    help={help('gender')}
                  >
                    <RadioGroup
                      value={ gender.value ? 1 : 0 }
                      onChange={e => gender.onChange(e.target.value)}
                    >
                      <Radio value={0}>男</Radio>
                      <Radio value={1}>女</Radio>
                    </RadioGroup>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span="11">
                  <Form.Item
                    label="真实姓名："
                    validateStatus={errorStatus('realname')}
                    help={help('realname')}
                  >
                    <Input {...realname} />
                  </Form.Item>
                </Col>
                <Col span="11" offset="2">
                  <Form.Item
                    label="花名："
                    validateStatus={errorStatus('aliasname')}
                    help={help('aliasname')}
                  >
                    <Input {...aliasname} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span="11">
                  <Form.Item
                    label="Email："
                    validateStatus={errorStatus('email')}
                    help={help('email')}
                  >
                    <Input {...email} />
                  </Form.Item>
                </Col>
                <Col span="11" offset="2">
                  <Form.Item
                    label="手机号："
                    validateStatus={errorStatus('mobile')}
                    help={help('mobile')}
                  >
                    <Input {...mobile} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Key：" validateStatus={errorStatus('key')} help={help('key')}>
                <Input type="textarea"
                  placeholder="your public ssh key (cat ~/.ssh/id_rsa.pub|pbcopy)"
                  rows="4"
                  {...key}
                />
              </Form.Item>
              <Row type="flex" align="end">
                <PKIModalButton />
                <ChangePassword onSubmit={this.handleChangePassword} />
                <DynamicPassword
                  onSubmit={this.changeDynamicPassword}
                />
                <Button
                  style={style}
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                >更新</Button>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    );
  },
});

export default reduxForm({
  form: 'personal',
  fields,
},
({ personal }) =>
  ({
    personal,
    initialValues: personal,
  }),
{ changePassword, checkDynamicPassword }
)(PersonalForm);
