/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T21:08:41+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-18T09:22:37+08:00
* @License: The MIT License (MIT)
*/


require('babel-core/register')({
  presets: ['es2015-node5', 'stage-3'],
});
require('babel-polyfill');

const Queue = require('bull');
const config = require('../src/config');
const models = require('../src/models');


const masterQueue = Queue(
  `${config.queue.name}:master`,
  config.queue.port,
  config.queue.hostname,
  {
    db: config.queue.db,
  }
);

setInterval(() => {
  models.user.findAll().then((_users) => {
    const users = _users.map((user) => {
      delete user.dataValues.password;
      delete user.dataValues.md5_password;
      delete user.dataValues.avatar;
      delete user.dataValues.created_at;
      delete user.dataValues.updated_at;
      return user.dataValues;
    });
    masterQueue.add({ type: 'user.sync', value: users });
  })
  .catch((err) => {
    console.log(err);
  });
}, 24 * 60 * 60 * 1000);
