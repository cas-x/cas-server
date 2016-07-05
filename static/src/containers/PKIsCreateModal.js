import React from 'react';
import Antd, {
  Modal,
  Form,
  Input,
  Radio,
  Row,
  Col,
} from 'antd';
import { reduxForm } from 'redux-form';
import { savePKIs } from '../actions';

const RadioGroup = Radio.Group;
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
      this.setState({
        formErrors: error.data.errors,
      });
      Antd.message.error(error.message, 3);
    });
  },

  render() {

    const {
      fields: {
        commonname, password, days
      },
      handleSubmit, submitting,
    } = this.props;
    const formErrors = this.state.formErrors;
    const errorStatus = (field) => formErrors[field] ? 'error' : '';
    const help = (field) => formErrors[field];

    return (
      <Modal title={'新建证书'}
        visible={this.props.visible}
        confirmLoading={submitting}
        onOk={handleSubmit(this.savePKIs)}
        onCancel={this.props.onCancel}
      >
        <Form>
          <Form.Item label="commonname：" validateStatus={errorStatus('commonname')} help={help('commonname')}>
            {
              commonname.map((child, index) => {
                return <Input
                  {...child} key={index} placeholder="填写字母、下划线、数字"
                  style={{ margin: '5px 0' }}
                />
              })
            }
            <a href="javascript:;" onClick={() => commonname.addField()}>more commonname</a>
          </Form.Item>
          <Row>
            <Col span="11">
              <Form.Item
                label="有效时间："
                validateStatus={errorStatus('days')}
                help={help('days')}
              >
                <Input {...days} />
              </Form.Item>
            </Col>
            <Col span="11" offset="2">
              <Form.Item
                label="密码："
                validateStatus={errorStatus('password')}
                help={help('password')}
              >
                <Input {...password} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  },
});


export default reduxForm({
    form: 'PKIsCreateModal',
    fields: ['commonname[]', 'password', 'days'],
    initialValues: {
      commonname: ['']
    }
  },
  null,
  { savePKIs }
)(PKIsCreateModal)
