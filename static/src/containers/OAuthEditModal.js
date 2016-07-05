/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-11T12:16:28+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-04-21T00:42:16+08:00
* @License: The MIT License (MIT)
*/


import React from 'react';
import Antd, {
  Modal,
  Form,
  Input,
  Checkbox,
  Radio,
  Row,
  Col,
} from 'antd';
import { reduxForm } from 'redux-form';
import { saveOAuth, getOAuth } from '../actions';

const noop = () => {};
const RadioGroup = Radio.Group;

const OAuthEditModal = React.createClass({
  propTypes: {
    id: React.PropTypes.number,
    visible: React.PropTypes.bool,
    onOk: React.PropTypes.func,
    onCancel: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      id: 0,
      visible: false,
      onOk: noop,
      onCancel: noop,
    };
  },

  getInitialState() {
    return {
      formErrors: {},
    };
  },

  componentWillMount() {
    const { id, getOAuth, initializeForm } = this.props;
    if (id) {
      getOAuth(id)
        .then(data => initializeForm(data.value))
        .catch(error => Antd.message.error(error.message, 3));
    }
  },

  saveOAuth(values, dispatch) {
    return saveOAuth(values, dispatch).then(() => {
      const msg = values.id ? '编辑成功' : '创建成功';
      Antd.message.success(msg);
      this.props.onOk();
    })
    .catch(error => {
      this.setState({
        formErrors: error.data.errors,
      });
      Antd.message.error(error.message, 3);
    });
  },

  render() {
    const {
      fields: {
        name, secret, identify, domain, callback, callback_debug, desc, type, is_admin, is_received,
      },
      handleSubmit, submitting,
    } = this.props;
    const formErrors = this.state.formErrors;
    const errorStatus = (field) => formErrors[field] ? 'error' : '';
    const help = (field) => formErrors[field];

    return (
      <Modal title={this.props.id ? '编辑' : '新建'}
        visible={this.props.visible}
        confirmLoading={submitting}
        onOk={handleSubmit(this.saveOAuth)}
        onCancel={this.props.onCancel}
      >
        <Form>
          <Form.Item label="name: "
            validateStatus={errorStatus('name')}
            help={help('username')}
          >
            <Input {...name} placeholder="填写字母、下划线、数字" />
          </Form.Item>
          <Form.Item label="secret: ">
            <Input {...secret} disabled />
          </Form.Item>
          <Form.Item label="identify: ">
            <Input {...identify} disabled />
          </Form.Item>
          <Form.Item label="domain: "
            validateStatus={errorStatus('domain')}
            help={help('domain')}
          >
            <Input {...domain} />
          </Form.Item>
            <Row>
              <Col span="11">
                <Form.Item
                  label="callback: "
                  validateStatus={errorStatus('callback')}
                  help={help('callback')}
                >
                  <Input {...callback} />
                </Form.Item>
              </Col>
              <Col span="12" offset="1">
                <Form.Item
                  label="callback_debug: "
                  validateStatus={errorStatus('callback_debug')}
                  help={help('callback_debug')}
                >
                  <Input {...callback_debug} />
                </Form.Item>
              </Col>
            </Row>
          <Form.Item label="desc: " validateStatus={errorStatus('desc')} help={help('desc')}>
            <Input {...desc} />
          </Form.Item>
          <Form.Item label="type: " validateStatus={errorStatus('type')} help={help('type')}>
            <RadioGroup
              {...type}
              onChange={e => type.onChange(e.target.value)}
              value={+type.value}
              size="small"
            >
              <Radio value={0}>默认</Radio>
              <Radio value={1}>静态</Radio>
              <Radio value={2}>动态</Radio>
              <Radio value={3}>静动</Radio>
            </RadioGroup>
          </Form.Item>
          <Row>
            <Col span="11">
              <Form.Item
                validateStatus={errorStatus('is_admin')} help={help('is_admin')}
              >
                <Checkbox
                  {...is_admin}
                  onChange={e => is_admin.onChange(e.target.checked)}
                  checked={+is_admin.value}
                />
                  assign admin permission
              </Form.Item>
            </Col>
            <Col span="12" offset="1">
              <Form.Item
                validateStatus={errorStatus('is_received')} help={help('is_received')}
              >
                <Checkbox
                  {...is_received}
                  onChange={e => is_received.onChange(e.target.checked)}
                  checked={+is_received.value}
                />
                receive event
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  },
});

export default reduxForm({
  form: 'OAuthEditModal',
  fields: ['id', 'name', 'secret', 'identify',
           'domain', 'callback', 'callback_debug', 'desc', 'type', 'is_admin', 'is_received'],
},
  null,
  { getOAuth }
)(OAuthEditModal);
