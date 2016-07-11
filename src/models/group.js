/*
 * @Author: detailyang
 * @Date:   2016-02-18 14:07:19
* @Last modified by:   detailyang
* @Last modified time: 2016-07-11T13:59:40+08:00
 */

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('group', {
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
    desc: {
      type: DataTypes.STRING(512),
      allowNull: false,
      defaultValue: '',
      unique: true,
      validate: {
        len: {
          args: [1, 512],
          msg: '长度必须为1-512位',
        },
      },
    },
    // 0 default 1 static 2 dynamic 3 static+dynamic
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  }, {
    associate: () => {
    },
    freezeTableName: true,
    underscored: true,
  });

  return Group;
};
