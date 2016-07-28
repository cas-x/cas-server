/*
 * @Author: detailyang
 * @Date:   2016-02-18 14:07:19
* @Last modified by:   detailyang
* @Last modified time: 2016-07-11T13:24:33+08:00
 */


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    username: {
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
    realname: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: '',
      validate: {
        len: {
          args: [1, 128],
          msg: '长度必须为1-128位',
        },
      },
    },
    aliasname: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: '',
      validate: {
        len: {
          args: [1, 128],
          msg: '长度必须为1-128位',
        },
      },
    },
    mobile: {
      type: DataTypes.STRING(18),
      allowNull: true,
      defaultValue: '',
      validate: {
        len: {
          args: [8, 18],
          msg: '长度必须为8-18位',
        },
        isNumeric: {
          args: true,
          msg: '必须为数字',
        },
      },
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: '',
      validate: {
        isEmail: {
          args: true,
          msg: '必须为邮箱格式',
        },
        len: {
          args: [6, 64],
          msg: '长度必须为6－64位',
        },
      },
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: '',
    },
    md5_password: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: '',
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    key: {
      type: DataTypes.STRING(8192),
      allowNull: true,
      defaultValue: '',
    },
    avatar: {
      type: DataTypes.BLOB('medium'),
      allowNull: true,
    },
    gender: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      // 0 is man 1 is girl
      defaultValue: false,
    },
  }, {
    associate: () => {
    },
    freezeTableName: true,
    underscored: true,
  });
  return User;
};
