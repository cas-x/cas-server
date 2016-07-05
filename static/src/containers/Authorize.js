/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T22:43:06+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-05T16:25:37+08:00
* @License: The MIT License (MIT)
*/


import { Icon, Button, Row, Col, message } from 'antd';
import url from 'url';
import querystring from 'querystring';
import React from 'react';
import { fetch } from '../utils';

export default React.createClass({
  handleClick(e) {
    e.preventDefault();
    fetch('', { method: 'POST' })
      .then((res) => {
        location.href = res.value;
      })
      .catch((err, resp) => {
        message.error(resp.data.value, 3);
      });
  },

  render() {
    const qs = querystring.parse(url.parse(location.href).query);
    const name = qs.name || '';
    const AvatarStyle = {
      height: 100,
      width: 100,
      borderRadius: '50%',
    };
    const IconStyle = {
      'fontSize': 16,
      'marginRight': 16,
    };
    const CheckIconStyle = {
      'fontSize': 16,
      color: '#79d858',
    };
    const Style = {
      'marginTop': 100,
    };
    const H1Style = {
      'color': '#333',
    };
    const ButtonStyle = {
      'marginTop': 25,
      'marginBottom': 15,
    };
    const NameStyle = {
      color: 'red',
    };

    return (
      <Row type="flex" justify="center">
        <Col className="box" span={12} style={Style} >
          <Row style={{ 'borderBottom': '1px solid #ddd', marginBottom: 15 }}>
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
            <h1 style={H1Style}>
              Review Permissions
            </h1>
          </Row>
          <div style={{ border: '1px solid #ddd', padding: 25 }}>
            <Row style={{ padding: 10 }}>
              <Col span="10">
                <Icon type="user" style={IconStyle} />
                Read your personal user data
              </Col>
              <Col span="1" offset="11">
                <Icon type="check" style={CheckIconStyle} />
              </Col>
            </Row>
            <Row style={{ padding: 10 }}>
              <Col span="10">
                <Icon type="setting" style={IconStyle} />
                Setting your personal user data
              </Col>
              <Col span="1" offset="11">
                <Icon type="check" style={CheckIconStyle} />
              </Col>
            </Row>
          </div>
          <Row>
            <Button onClick={this.handleClick} style={ButtonStyle} type="primary" size="large">
              确认
            </Button>
          </Row>
        </Col>
      </Row>
    );
  },
});
