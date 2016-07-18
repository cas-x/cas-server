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
import { saveGroup, getGroup } from '../actions';

const noop = () => {};
const RadioGroup = Radio.Group;

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
      formErrors: {},
    };
  },

  componentWillMount() {
    const { id, getGroup, initializeForm } = this.props;
    if (id) {
      getGroup(id)
        .then(data => initializeForm(data.value))
        .catch(error => Antd.message.error(error.message, 3));
    }
  },

  saveGroup(values, dispatch) {
    return saveGroup(values, dispatch).then(() => {
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
      fields: { name, desc },
      handleSubmit, submitting,
    } = this.props;
    const formErrors = this.state.formErrors;
    const errorStatus = (field) => formErrors[field] ? 'error' : '';
    const help = (field) => formErrors[field];

    return (
      <Modal title={this.props.id ? '编辑' : '新建'}
        visible={this.props.visible}
        confirmLoading={submitting}
        onOk={handleSubmit(this.saveGroup)}
        onCancel={this.props.onCancel}
      >
        <Form>
          <Form.Item label="组名"
            validateStatus={errorStatus('name')}
            help={help('username')}
          >
            <Input {...name} placeholder="填写字母、下划线、数字" />
          </Form.Item>
          <Form.Item label="描述">
            <Input {...desc} />
          </Form.Item>
        </Form>
      </Modal>
    );
  },
});

export default reduxForm({
  form: 'GroupEditModal',
  fields: ['id', 'name', 'desc', 'identify',
           'domain', 'callback', 'callback_debug', 'desc', 'type', 'is_admin', 'is_received'],
},
  null,
  { getGroup }
)(GroupEditModal);
