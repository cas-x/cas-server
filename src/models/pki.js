/*
 * @Author: detailyang
 * @Date:   2016-02-18 14:07:19
* @Last modified by:   detailyang
* @Last modified time: 2016-06-29T14:50:03+08:00
 */


module.exports = (sequelize, DataTypes) => {
  const Pki = sequelize.define('pki', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING(512),
      allowNull: true,
      defaultValue: '',
    },
    key: {
      type: DataTypes.BLOB('medium'),
      allowNull: true,
      defaultValue: '',
    },
    csr: {
      type: DataTypes.BLOB('medium'),
      allowNull: true,
      defaultValue: '',
    },
    crt: {
      type: DataTypes.BLOB('medium'),
      allowNull: true,
      defaultValue: '',
    },
    pkcs12: {
      type: DataTypes.BLOB('medium'),
      allowNull: true,
      defaultValue: '',
    },
    days: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    is_delete: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true, // assumeing it's deleted
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.INTEGER,
      // 'server', 'client',
      defaultvalue: 0,
    },
  }, {
    associate: () => {
      // User.hasMany(models.Post);
    },
    freezeTableName: true,
    underscored: true,
  });
  return Pki;
};
