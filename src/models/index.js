/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-02-18T14:02:21+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-06-29T09:49:25+08:00
* @License: The MIT License (MIT)
*/


const Queue = require('bull');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const config = require('../config');
const db = {};
const sequelize = new Sequelize(config.mysql.database, config.mysql.username,
  config.mysql.password, {
    host: config.mysql.host,
    port: config.mysql.port,
    logging: config.mysql.logging,
  });

const masterQueue = Queue(
  `${config.queue.name}:master`,
  config.queue.port,
  config.queue.hostname,
  {
    db: config.queue.db,
  }
);

fs.readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
    switch (file) {
      case 'user.js':
        model.afterBulkUpdate((object, fn) => {
          if (object.where.id) {
            object.attributes.id = object.where.id;
          }
          if (object.where.username) {
            object.attributes.username = object.where.username;
          }
          masterQueue.add({ type: 'user.update', value: object.attributes });
          fn();
        });
        model.afterCreate((object) => {
          masterQueue.add({ type: 'user.add', value: object.dataValues });
        });
        break;
      default:
        break;
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
