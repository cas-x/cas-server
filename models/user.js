/*
* @Author: detailyang
* @Date:   2016-02-18 14:07:19
* @Last Modified by:   detailyang
* @Last Modified time: 2016-03-08 15:23:56
*/

'use strict';
const validator = require('../utils')['validator'];

module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING(128),
            allowNull: false,
            defaultValue: "",
            unique: true,
            validate: {
                is: {
                    args: /^[A-Za-z0-9-]+$/,
                    msg: '必须为字母或者数字'
                },
                len: {
                    args: [1, 128],
                    msg: '长度必须为1-128位'
                }
            }
        },
        chinesename: {
            type: DataTypes.STRING(128),
            allowNull: false,
            defaultValue: "",
            validate: {
                is: {
                    args: /^[\u4e00-\u9fa5]+$/,
                    msg: '必须为汉字'
                }
            }
        },
        aliasname: {
            type: DataTypes.STRING(128),
            allowNull: false,
            defaultValue: "",
            validate: {
                is: {
                    args: /^[\u4e00-\u9fa5]+$/,
                    msg: '必须为汉字'
                }
            }
        },
        mobile: {
            type: DataTypes.STRING(18),
            allowNull: false,
            defaultValue: "",
            validate: {
                len: {
                    args: [8,18],
                    msg: '长度必须为8-18位'
                },
                isNumeric: {
                    args: true,
                    msg: '必须为数字'
                }
            }
        },
        email: {
            type: DataTypes.STRING(64),
            allowNull: false,
            defaultValue: "",
            validate: {
                isEmail: {
                    args: true,
                    msg: '必须为邮箱格式'
                },
                len: {
                    args: [6,64],
                    msg: '长度必须为6－64位'
                }
            }
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false,
            defaultValue: ""
        },
        is_delete: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        is_admin: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        key: {
            type: DataTypes.STRING(8192),
            allowNull: true,
            defaultValue: "",
        },
        avatar: {
            type: DataTypes.BLOB,
            allowNull: true
        },
        gender: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            // 0 is man 1 is girl
            defaultValue: false
        }
    }, {
        associate: (models) => {
            // User.hasMany(models.Post);
        },
        freezeTableName: true,
        underscored: true,
    });

    return User;
}