import React from 'react';
import Antd, {
  Table,
  Modal,
  Button,
  Select,
  Popconfirm,
  Row,
  Col,
} from 'antd';
import { fetch } from '../utils';


const Option = Select.Option;
const noop = () => {};

const GroupEditModal = React.createClass({
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
      list: [],
      members: [],
      loading: false,
      page: 1,
      per_page: 20,
      total: 0,
      selectMemberID: null,
    };
  },

  componentWillMount() {
    this.fetchAllMembers();
    this.fetchGroupMembers();
  },

  fetchAllMembers() {
    return fetch('/admin/users', {
      method: 'GET',
      body: {
        per_page: 10000,
      },
    }).then(data => this.setState({
      members: data.value,
    }));
  },

  fetchGroupMembers() {
    const { id } = this.props;
    this.setState({
      loading: true,
    });
    fetch(`/admin/groups/${id}/peoples`)
      .then(data => this.setState({
        list: data.value,
        total: data.total,
        loading: false,
      }))
      .catch(() => this.setState({ loading: false }));
  },

  handleAddMember() {
    const { id } = this.props;
    const { selectMemberID } = this.state;

    fetch(`/admin/groups/${id}/peoples`, {
      method: 'POST',
      body: {
        user_id: selectMemberID,
      },
    }).then(() => {
      Antd.message.success('添加成功');
      this.fetchGroupMembers();
    }).catch(() =>
      Antd.message.error('添加失败')
    );
  },

  handleMemberSelectChange(id) {
    this.setState({
      selectMemberID: id,
    });
  },

  handleDeleteClick(record) {
    const { id } = this.props;
    fetch(`/admin/groups/${id}/peoples/${record.user_id}`, {
      method: 'DELETE',
    }).then(() => {
      Antd.message.success('删除成功');
      this.fetchGroupMembers();
    }).catch(() =>
      Antd.message.error('删除失败')
    );
  },

  renderTable() {
    const avatarStyle = {
      width: 50,
      height: 50,
    };
    const columns = [
      {
        title: '头像',
        dataIndex: 'name',
        key: 'name',
        render(value, record) {
          return (
            <img
              style={avatarStyle}
              src={`/public/users/avatar/${record.username}`}
              alt="avatar"
            />
          );
        },
      }, {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      }, {
        title: '真名',
        dataIndex: 'realname',
        key: 'realname',
      }, {
        title: '操作',
        dataIndex: 'x',
        key: 'x',
        className: 'text-rigth',
        render: (value, record) =>
          <Popconfirm
            placement="left"
            title="确认删除？"
            onConfirm={() => this.handleDeleteClick(record)}
          >
            <Button type="ghost" size="small">删除</Button>
          </Popconfirm>
        ,
      },
    ];

    const {
      list, loading, page, per_page, total,
    } = this.state;

    list.forEach(item => {
      item.key = item.id;
    });

    const pagination = {
      total,
      current: page,
      pageSize: per_page,
      showTotal: (_total) => `共 ${_total} 条`,
      onChange: (_page) => {
        this.setState({
          page: _page,
        }, () => {
          this.fetchGroupMembers();
        });
      },
    };

    return (
      <Table
        dataSource={list}
        loading={loading}
        columns={columns}
        pagination={pagination}
      />);
  },

  render() {
    const {
      members,
    } = this.state;

    return (
      <Modal
        width={800}
        title={this.props.title}
        visible={this.props.visible}
        onOk={this.props.onOk}
        onCancel={this.props.onCancel}
      >
        <Row style={{ marginBottom: 5 }}>
          <Col span={12} offset={6}>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="请选择人员"
              optionFilterProp="children"
              notFoundContent="无法找到"
              onChange={this.handleMemberSelectChange}
            >
              {
                members.map(item =>
                  <Option value={item.id} key={item.id}>{item.username}({item.realname})</Option>
                )
              }
            </Select>
            <Button
              style={{ marginLeft: 5 }}
              type="primary" onClick={this.handleAddMember}
            >+ 添 加</Button>
          </Col>
        </Row>
        {
          this.renderTable()
        }
      </Modal>
    );
  },
});

export default GroupEditModal;
