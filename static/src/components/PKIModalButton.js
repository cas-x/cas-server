/**
* @Author: BingWu Yang (https://github.com/detailyang) <detailyang>
* @Date:   2016-07-05T09:47:23+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-05T10:00:47+08:00
* @License: The MIT License (MIT)
*/


import Antd, {
  Button,
  Form,
  Input,
  Alert,
  Row,
  Col,
  Modal,
  Table
} from 'antd';
import React from 'react';
import { fetch } from '../utils';

const FormItem = Form.Item;
const noop = () => {};

export default Form.create()(React.createClass({
  propTypes: {
    form: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      form: {}
    };
  },

  getInitialState() {
    return { loading: false, visible: false, PKI: {} };
  },

  hideModal() {
    this.setState({ visible: false });
  },

  showModal() {
    this.setState({ visible: true });
    this.fetchPKI()
  },

  fetchPKI() {
    fetch('/api/pkis/client')
      .then(data => {
        this.setState({
          PKI: data.value
        })
      })
  },

  handleSubmit() {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }

      fetch('/api/pkis/client', {
        method: 'POST',
        body: {
          certPassword: values.certPassword,
          loginPassword: values.loginPassword
        }
      }).then(data => {
        Antd.message.info('申请成功')
        this.fetchPKI()
      })
      .catch(error => Antd.message.error(error.message));
    });
  },

  render() {
    const { getFieldProps } = this.props.form
    const { PKI } = this.state
    const columns = [{
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },{
        title: '证书名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '有效时间',
        dataIndex: 'days',
        key: 'days',
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
      }, {
        title: '',
        key: 'action',
        render: () => {
          return <a href="/api/pkis/client/pkcs12" target="_blank">下载</a>
        }
      }]

    const loginPassword = getFieldProps('loginPassword', {
      rules: [
        {
          required: true,
          message: '请填写登录密码',
        },
      ],
    })

    const certPassword = getFieldProps('certPassword', {
      rules: [
        {
          required: true,
          message: '请填写证书密码',
        },
      ],
    });

    return (
      <div style={{ margin: 10 }}>
        <Button type="primary" onClick={this.showModal}>证书管理</Button>
        <Modal
          title="我的证书"
          visible={this.state.visible}
          onCancel={this.hideModal}
          footer={[
            <Button key="back" type="ghost" size="large" onClick={this.hideModal}>关闭</Button>,
          ]}
        >
          {
            Object.keys(PKI).length ?
              <Table
                style={{ marginBottom: 30 }}
                columns={columns}
                dataSource={[PKI]}
                pagination={false}
              /> :
              ''
          }
          <Form form={this.props.form}>
            <Row gutter={12}>
              <Col className="gutter-row" span={12}>
                <FormItem>
                  <Input type="text" placeholder="输入证书密码" {...certPassword} />
                </FormItem>
              </Col>
              <Col className="gutter-row" span={12}>
                <FormItem>
                  <Input type="password" placeholder="输入登录密码" {...loginPassword} />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="gutter-row" span={8} offset={10}>
                <Button
                  type="primary"
                  onClick={this.handleSubmit}
                >
                  申请证书
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  },
}));
