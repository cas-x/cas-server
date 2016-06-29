/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-14T10:30:41+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-06-29T10:00:21+08:00
* @License: The MIT License (MIT)
*/


require('babel-core/register')({
  presets: ['es2015-node5', 'stage-3'],
});
require('babel-polyfill');

const md5 = require('utility').md5;
const minimist = require('minimist');
const uuid = require('uuid');
const utils = require('../src/utils');
const config = require('../src/config');
const models = require('../src/models');
const co = require('co');

const argv = minimist(process.argv.slice(2));
const username = argv.username;
const id = argv.id;
const realname = argv.realname || 'admin';
const aliasname = argv.aliasname || 'admin';
const email = argv.email || 'admin@admin.com';
const mobile = argv.mobile || '01234567890';
const gender = argv.gender || false;
const admin = argv.admin || false;

const createUser = function*(data) {
  const salt = utils.password.genSalt(config.password.bcryptlength);
  if (!data.password) {
    data.password = utils.password.encrypt(
      config.password.default, salt);
    data.md5_password = utils.password.encrypt(
      md5(config.password.default), salt);
  } else {
    data.password = utils.password.encrypt(
      data.password, salt);
    data.md5_password = utils.password.encrypt(
      md5(data.password), salt);
  }
  const width = config.avatar.width;
  const avatar = yield utils.avatar.generate(uuid.v1(),
    gender ? 'female' : 'male', width);
  data.avatar = avatar;
  yield models.user.create(data);
  return;
};

if (!username) {
  throw new Error('please input username');
}

co(function *() {
  yield createUser({
    id: id,
    username: username,
    is_admin: admin,
    gender: gender,
    realname: realname,
    aliasname: aliasname,
    email: email,
    mobile: mobile,
  });
})
.then(() => {
  process.exit(0);
})
.catch((err) => {
  console.log(err);
  process.exit(1);
});
