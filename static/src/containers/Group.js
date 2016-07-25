/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-14T10:30:11+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-04-21T17:23:02+08:00
* @License: The MIT License (MIT)
*/


import React, { Component } from 'react';
import Antd, { Table, Button, Row, Col, Input, Icon, Popconfirm } from 'antd';
import { connect } from 'react-redux';

import GroupEditModal from './GroupEditModal';
import GroupMemberModal from './GroupMemberModal';
import { fetchGroupList, setGroupPage, setGroupKeyword, deleteGroup } from '../actions';

const InputGroup = Input.Group;

class Group extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editModalVisible: false,
      editModalId: 0,
      memberModalVisible: false,
      memberModalTitle: '',
      memberModalId: 0,
    };
  }

  componentWillMount() {
    this.fetchGroupList();
  }

  handleCreateClick() {
    this.setState({ editModalVisible: true, editModalId: 0 });
  }

  handleEditClick(record) {
    this.setState({ editModalVisible: true, editModalId: record.id });
  }

  handleDeleteClick(record) {
    this.props.deleteGroup(record.id)
      .then(() => {
        Antd.message.success('删除成功');
        this.fetchGroupList();
      })
      .catch(() => {
        Antd.message.error('删除失败');
      });
  }

  handleKeywordKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleSearchClick();
    }
  }

  handleSearchClick() {
    this.fetchGroupList();
  }

  openMemberModal(record) {
    this.setState({
      memberModalTitle: record.name,
      memberModalId: record.id,
      memberModalVisible: true,
    });
  }

  fetchGroupList() {
    return this.props.fetchGroupList()
      .catch(error => Antd.message.error(error.message));
  }

  renderTable() {
    const columns = [
      {
        title: '组名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '描述',
        dataIndex: 'desc',
        key: 'desc',
      }, {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
      }, {
        title: '操作',
        dataIndex: 'x',
        key: 'x',
        className: 'text-rigth',
        render: (value, record) => {
          return (
            <div>
              <Button
                type="ghost"
                size="small"
                onClick={() => this.openMemberModal(record)}
              >
                成员
              </Button>
              <Button
                type="ghost"
                size="small"
                onClick={() => this.handleEditClick(record)}
              >
                编辑
              </Button>
              <Popconfirm
                placement="left"
                title="确认删除？"
                onConfirm={() => this.handleDeleteClick(record)}
              >
                <Button type="ghost" size="small">删除</Button>
              </Popconfirm>
            </div>
          );
        },
      },
    ];

    const {
      group: { list, loading, page, per_page, total },
      setGroupPage,
    } = this.props;

    list.forEach(item => {
      item.key = item.id;
    });

    const pagination = {
      total,
      current: page,
      pageSize: per_page,
      showTotal: (_total) => `共 ${_total} 条`,
      onChange: (_page) => {
        setGroupPage(_page);
        this.fetchGroupList();
      },
    };

    return (
      <Table
        dataSource={list}
        loading={loading}
        columns={columns}
        pagination={pagination}
      />);
  }

  renderFilter() {
    const { setGroupKeyword } = this.props;

    return (
      <Row style={{ marginBottom: '10px' }}>
        <Col span="2">
          <Button type="primary" onClick={::this.handleCreateClick}>
            <Icon type="plus" />新建
          </Button>
        </Col>
        <Col span="4" offset="18">
          <InputGroup className="ant-search-input" size="default">
            <Input
              defaultValue={this.state.keyword}
              onChange={e => { setGroupKeyword(e.target.value); }}
              onKeyDown={::this.handleKeywordKeyDown}
            />
            <div className="ant-input-group-wrap">
              <Button className="ant-search-btn" onClick={this.handleSearchClick}>
                <Icon type="search" />
              </Button>
            </div>
          </InputGroup>
        </Col>
      </Row>
    );
  }

  renderEditModal() {
    if (!this.state.editModalVisible) {
      return '';
    }

    const handleOk = () => {
      this.setState({ editModalVisible: false });
      this.fetchGroupList();
    };

    const handleCancel = () => {
      this.setState({ editModalVisible: false });
    };

    return (
      <GroupEditModal
        id={this.state.editModalId}
        visible={this.state.editModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      />);
  }

  renderMemberModal() {
    if (!this.state.memberModalVisible) {
      return '';
    }

    const handleClose = () => {
      this.setState({ memberModalVisible: false });
    };

    return (
      <GroupMemberModal
        visible={this.state.memberModalVisible}
        title={this.state.memberModalTitle}
        id={this.state.memberModalId}
        onOk={handleClose}
        onCancel={handleClose}
      />);
  }

  render() {
    return (
      <div>
        {this.renderEditModal()}
        {this.renderMemberModal()}
        {this.renderFilter()}
        {this.renderTable()}
      </div>
    );
  }
}

export default connect(
  ({ group }) => ({ group }),
  { fetchGroupList, setGroupPage, setGroupKeyword, deleteGroup }
)(Group);
