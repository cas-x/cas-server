/*
 * @Author: detailyang
 * @Date:   2016-02-18 14:07:19
* @Last modified by:   detailyang
* @Last modified time: 2016-07-11T13:24:27+08:00
 */

module.exports = (sequelize, DataTypes) => {
  const Oauth = sequelize.define('oauth', {
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: '',
      unique: true,
      validate: {
        is: {
          args: /^[A-Za-z0-9-]+$/,
          msg: '必须为字母或者数字',
        },
        len: {
          args: [1, 128],
          msg: '长度必须为1-128位',
        },
      },
    },
    secret: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: '',
      validate: {
        len: {
          args: [36, 36],
          msg: '长度必须为36位',
        },
      },
    },
    identify: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: '',
      validate: {
        len: {
          args: [36, 36],
          msg: '长度必须为36位',
        },
      },
    },
    domain: {
      type: DataTypes.STRING(512),
      allowNull: true,
      defaultValue: '',
    },
    desc: {
      type: DataTypes.STRING(512),
      allowNull: false,
      defaultValue: '',
      validate: {
        len: {
          args: [1, 512],
          msg: '长度必须为1-512位',
        },
      },
    },
    callback: {
      type: DataTypes.STRING(512),
      allowNull: true,
      defaultValue: '',
    },
    callback_debug: {
      type: DataTypes.STRING(512),
      allowNull: true,
      defaultValue: '',
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    is_received: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    // 0 default 1 static 2 dynamic 3 static+dynamic
    type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  }, {
    associate: () => {
    },
    freezeTableName: true,
    underscored: true,
  });

  return Oauth;
};
