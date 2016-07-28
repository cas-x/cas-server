/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T21:08:41+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-18T09:23:31+08:00
* @License: The MIT License (MIT)
*/


require('babel-core/register')({
  presets: ['es2015-node5', 'stage-3'],
});
require('babel-polyfill');


const Queue = require('bull');
const request = require('superagent');
const co = require('co');
const qrCode = require('qrcode-npm');
const utils = require('../src/utils');
const config = require('../src/config');
const models = require('../src/models');
const email = require('../src/utils/email');


const masterQueue = Queue(
  `${config.queue.name}:master`,
  config.queue.port,
  config.queue.hostname,
  {
    db: config.queue.db,
  }
);

const agentQueue = Queue(
  `${config.queue.name}:agent`,
  config.queue.port,
  config.queue.hostname,
  {
    db: config.queue.db,
  }
);

function* changePassword(user) {
  const where = {};
  if (user.id) {
    where.id = user.id;
  }

  if (user.username) {
    where.username = user.username;
  }
  where.is_delete = false;

  const _user = yield models.user.findOne({
    attributes: ['email', 'username', 'password'],
    where,
  });
  if (!_user) {
    return;
  }

  const otp = utils.password.otpqrcode(
    utils.password.encrypt(
      _user.username + _user.password, config.notp.salt),
    config.notp.label);
  const qr = qrCode.qrcode(10, 'M');
  qr.addData(otp);
  qr.make();
  const img = qr.createImgTag(4);
  const text = `you google authorization secret is ${img}`;
  const rv = yield email.send('cas google authorization update', text, _user.email);
  console.log(rv);
}

masterQueue.process((msg, done) => {
  console.log('master receive event', msg.data);
  co(function *() {
    const ocs = yield models.oauth.findAll({
      attributes: ['id', 'name', 'secret', 'identify', 'is_received', 'domain', 'desc', 'callback'],
      where: {
        is_delete: false,
      },
    });

    switch (msg.data.type) {
      case 'user.update':
        if (msg.data.value.password) {
          yield changePassword(msg.data.value);
          break;
        }
        const where = {};
        const _user = msg.data.value;
        if (_user.id) {
          where.id = _user.id;
        }

        if (_user.username) {
          where.username = _user.username;
        }
        const user = yield models.user.findOne({
          attributes: ['id', 'username', 'is_admin', 'gender',
          'realname', 'is_delete', 'aliasname', 'mobile', 'email', 'key'],
          where,
        });
        if (!user) {
          throw new utils.error.NotFoundError('dont find user');
        }
        delete user.dataValues.md5_password;
        delete user.dataValues.password;
        delete user.dataValues.avatar;
        ocs.map((oc) => {
          if (msg.data.value.avatar) {
            return true;
          }
          if (!oc.is_received) {
            return true;
          }
          const data = JSON.parse(JSON.stringify(msg.data));
          data.callback = oc.callback;
          data.identify = oc.identify;

          data.value = user.dataValues;
          return agentQueue
          .add(data, { timeout: 1 })
          .then(() => {
            console.log('add agent queue success');
          })
          .catch(() => {
            console.log('add agent queue error');
          });
        });
        break;
      case 'user.add':
        ocs.map((oc) => {
          if (!oc.is_received) {
            return true;
          }
          const data = JSON.parse(JSON.stringify(msg.data));
          delete data.value.password;
          delete data.value.avatar;
          data.callback = oc.callback;
          data.identify = oc.identify;
          return agentQueue
          .add(data, { timeout: 1 })
          .then(() => {
            console.log('add agent queue success');
          })
          .catch(() => {
            console.log('add agent queue error');
          });
        });
        break;
      case 'user.sync':
        ocs.map((oc) => {
          if (!oc.is_received) {
            return true;
          }
          const data = JSON.parse(JSON.stringify(msg.data));
          data.callback = oc.callback;
          data.identify = oc.identify;
          return agentQueue
          .add(data, { timeout: 1 })
          .then(() => {
            console.log('add agent queue success');
          })
          .catch(() => {
            console.log('add agent queue error');
          });
        });
        break;
      default:
        break;
    }
    done();
  })
  .catch((err) => {
    console.log('get error', err);
    done(err);
  });
});
