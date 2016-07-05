/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-14T10:30:11+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-05T16:30:09+08:00
* @License: The MIT License (MIT)
*/


import React from 'react';
import Antd, { Form, Input, Row, Col, Button } from 'antd';
import querystring from 'querystring';
import { reduxForm } from 'redux-form';
import url from 'url';

import { fetch } from '../utils';

import './login.scss';


const noop = () => {};

const OnetimeForm = React.createClass({

  propTypes: {
    onOk: React.PropTypes.func,
  },

  getDefaultProps() {
    return {
      onOk: noop,
    };
  },

  onSave(data) {
    const { username, password } = data;

    fetch(`/public/oauth/onetime${location.search}`,
      {
        method: 'POST',
        body: {
          username,
          password,
        },
      })
      .then(res => {
        location.href = res.value;
      })
      .catch(error => {
        Antd.message.error((error.data && error.data.value) || error.message, 3);
      });
  },

  render() {
    const { fields: {
      username, password,
    }, submitting, handleSubmit } = this.props;
    let passwordfield = '静态密码';

    switch (window._authtype) {
      case 1:
        passwordfield = '静态密码';
        break;
      case 2:
        passwordfield = '动态密码';
        break;
      case 3:
        passwordfield = '静态+动态密码';
        break;
      default:
        break;
    }
    const qs = querystring.parse(url.parse(location.href).query);
    const name = qs.name || '';
    const AvatarStyle = {
      height: 100,
      width: 100,
      borderRadius: '50%',
    };
    const Style = {
      'marginTop': 100,
    };
    const H1Style = {
      'color': '#333',
    };
    const NameStyle = {
      color: 'red',
    };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <Row type="flex" justify="center">
        <Col className="box" span={12} style={Style} >
          <Row style={{ borderBottom: '1px solid #ddd', marginBottom: 15 }}>
            <Col span="18">
              <h1 style={H1Style}>Authorize application</h1>
              <p>
                <strong style={NameStyle}>{name}</strong> would
                  like permission to access your account
              </p>
            </Col>
            <Col span="6">
              <img style={AvatarStyle} src="/api/users/self/avatar" alt="avatar" />
            </Col>
          </Row>
          <Row>
            <div style={{ border: '1px solid #ddd', padding: '25px' }}>
              <Form
                onSubmit={handleSubmit(this.onSave)}
                horizontal
              >
                <Row>
                  <Col>
                    <Form.Item {...formItemLayout} label="用户名：">
                      <Input {...username} placeholder="填写字母、下划线、数字" />
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={`${passwordfield}：`}>
                      <Input {...password} type="password" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span="8" offset="8">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      style={{ width: '100%' }}
                      loading={submitting}
                    >
                      登录
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Row>
        </Col>
      </Row>
    );
  },

});


export default reduxForm({
  form: 'onetime',
  fields: ['username', 'password'],
})(OnetimeForm);
