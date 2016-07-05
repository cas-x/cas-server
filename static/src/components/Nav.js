/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-14T10:30:11+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-04-21T00:42:57+08:00
* @License: The MIT License (MIT)
*/


import React from 'react';
import { Link } from 'react-router';
import { Menu } from 'antd';

const navMap = [
  {
    router: '/dashboard/user',
    text: '用户列表',
    needAdmin: true,
  },
  {
    router: '/dashboard/oauth',
    text: 'OAuth列表',
    needAdmin: true,
  },
  {
    router: '/dashboard/PKIs',
    text: '证书管理',
    needAdmin: true,
  },
  {
    router: '/dashboard',
    text: '个人信息',
    needAdmin: false,
  },
];

export default ({ isAdmin, currentPath }) => {
  const hiddenStyle = { display: 'none' };

  return (
    <Menu
      selectedKeys={[currentPath]}
      theme=""
      mode="horizontal"
    >
      {
        navMap.map((navItem) =>
          <Menu.Item key={navItem.router} style={ !isAdmin && navItem.needAdmin && hiddenStyle }>
            <Link to={navItem.router}>{navItem.text}</Link>
          </Menu.Item>
        )
      }
    </Menu>
  );
};
