/**
* @Author: BingWu Yang (https://github.com/detailyang) <detailyang>
* @Date:   2016-07-05T09:47:23+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-05T10:56:53+08:00
* @License: The MIT License (MIT)
*/


import React from 'react';
import Antd, {
  Modal,
  Form,
  Input,
  Row,
  Col,
} from 'antd';
import { reduxForm } from 'redux-form';
import { savePKIs } from '../actions';

const noop = () => {};

const PKIsCreateModal = React.createClass({

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

  savePKIs(values, dispatch) {
    return savePKIs(values, dispatch).then(() => {
      Antd.message.success('创建成功');
      this.props.onOk();
    })
    .catch(error => {
      Antd.message.error(error.data && error.data.value || error.message, 3);
    });
  },

  render() {
    const {
      fields: {
        commonname, password, days,
      },
      handleSubmit, submitting,
    } = this.props;
    const formErrors = this.state.formErrors;
    const errorStatus = (field) => formErrors[field] ? 'error' : '';
    const help = (field) => formErrors[field];

    return (
      <Modal
        title={'新建证书'}
        visible={this.props.visible}
        confirmLoading={submitting}
        onOk={handleSubmit(this.savePKIs)}
        onCancel={this.props.onCancel}
      >
        <Form>
          <Row gutter={16}>
            <Col className="gutter-row" span="12">
              <Form.Item
                label="有效时间："
                validateStatus={errorStatus('days')}
                help={help('days')}
              >
                <Input {...days} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span="12">
              <Form.Item
                label="证书密码："
                validateStatus={errorStatus('password')}
                help={help('password')}
              >
                <Input {...password} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label={
              <a href="javascript:;" onClick={() => commonname.addField()}>
                common name
              </a>
            }
            validateStatus={errorStatus('commonname')}
            help={help('commonname')}
          >
            {
              commonname.map((child, index) => {
                return (<Input
                  {...child} key={index} placeholder="填写字母、下划线、数字 (域名)"
                  style={{ margin: '5px 0' }}
                />);
              })
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  },
});


export default reduxForm({
  form: 'PKIsCreateModal',
  fields: ['commonname[]', 'password', 'days'],
  initialValues: {
    commonname: [''],
  },
},
null,
{ savePKIs },
)(PKIsCreateModal);
