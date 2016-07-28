/*
 * @Author: detailyang
 * @Date:   2016-02-18 14:07:19
* @Last modified by:   detailyang
* @Last modified time: 2016-07-11T16:35:00+08:00
 */

module.exports = (sequelize, DataTypes) => {
  const GroupUser = sequelize.define('group_user', {
    group_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {},
    },
    user_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {},
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  }, {
    associate: () => {
    },
    indexes: [{ unique: true, fields: ['user_id', 'group_id'] }],
    freezeTableName: true,
    underscored: true,
  });

  return GroupUser;
};
