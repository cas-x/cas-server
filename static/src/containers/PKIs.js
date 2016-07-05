import React, { Component } from 'react';
import Antd, { Table, Button, Row, Col, Input, Icon, Popconfirm } from 'antd';
import { connect } from 'react-redux';

import PKIsCreateModal from './PKIsCreateModal';
import { fetchPKIsList, setKPIsPage, setPKIsKeyword, deletePKIs } from '../actions';

const InputGroup = Input.Group;

class PKIs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editModalVisible: false,
      editModalId: 0,
    };

    this.handleSearchClick = ::this.handleSearchClick
  }

  componentWillMount() {
    this.fetchPKIsList();
  }

  handleCreateClick() {
    this.setState({ editModalVisible: true, editModalId: 0 });
  }

  handleDeleteClick(record) {
    this.props.deletePKIs(record.id)
      .then(() => {
        Antd.message.success('删除成功');
        this.fetchPKIsList();
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
    this.fetchPKIsList();
  }

  fetchPKIsList() {
    return this.props.fetchPKIsList()
      .catch(error => Antd.message.error(error.message));
  }

  renderTable() {
    const columns = [
      {
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
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return (
            <div>
              <a href={`/api/pkis/server/${record.id}/pkcs12`} target="_blank">下载</a>
              <Popconfirm
                placement="left"
                title="确认删除？"
                onConfirm={() => this.handleDeleteClick(record)}
              >
                <Button type="ghost" size="small">删除</Button>
              </Popconfirm>
            </div>
          )
        }
      },
    ];

    const {
      PKIs: { list, loading, page, per_page, total },
      setKPIsPage,
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
        setKPIsPage(_page);
        this.fetchPKIsList();
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

  renderEditModal() {
    if (!this.state.editModalVisible) {
      return '';
    }

    const handleOk = () => {
      this.setState({ editModalVisible: false });
      this.fetchPKIsList();
    };

    const handleCancel = () => {
      this.setState({ editModalVisible: false });
    };

    return (
      <PKIsCreateModal
        id={this.state.editModalId}
        visible={this.state.editModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      />);
  }

  renderFilter() {
    const { setPKIsKeyword } = this.props;

    return (
      <Row style={{ marginBottom: 10 }}>
        <Col span="2">
          <Button type="primary" onClick={::this.handleCreateClick}>
            <Icon type="plus" />新建
          </Button>
        </Col>
        <Col span="4" offset="18">
          <InputGroup className="ant-search-input" size="default">
            <Input
              defaultValue={this.state.keyword}
              onChange={e => { setPKIsKeyword(e.target.value); }}
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

  render() {
    return (
      <div>
        {this.renderEditModal()}
        {this.renderFilter()}
        {this.renderTable()}
      </div>
    );
  }
}

export default connect(
  ({PKIs}) => ({PKIs}),
  { fetchPKIsList, setKPIsPage, setPKIsKeyword, deletePKIs }
)(PKIs)
