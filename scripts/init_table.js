/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-14T10:30:41+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-06-29T10:00:30+08:00
* @License: The MIT License (MIT)
*/


require('babel-core/register')({
  presets: ['es2015-node5', 'stage-3'],
});
require('babel-polyfill');

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../src/config').mysql;
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const modeldir = `${__dirname}/../src/models`;
const basename = 'index.js';


fs.readdirSync(modeldir)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(modeldir, file));
    db[model.name] = model;
    db[model.name].sync().then((table) => {
      console.log(`create ${table} success`);
    });
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
