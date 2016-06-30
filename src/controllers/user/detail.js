/*
 * @Author: detailyang
 * @Date:   2016-02-29 14:32:13
* @Last modified by:   detailyang
* @Last modified time: 2016-06-30T14:22:21+08:00
 */
import fs from 'fs';
import zxcvbn from 'zxcvbn';
import sshpk from 'sshpk';
import { md5 } from 'utility';

import models from '../../models';
import utils from '../../utils';
import config from '../../config';


module.exports = {
  async login(ctx) {
    const id = ctx.request.body.id
      || ctx.request.query.id
      || ctx.request.headers['cas-id'];
    const username = ctx.request.body.username
      || ctx.request.query.username
      || ctx.request.headers['cas-username'];
    const password = ctx.request.body.password
      || ctx.request.query.password
      || ctx.request.headers['cas-password'];
    const dynamic = ctx.request.body.dynamic
      || ctx.request.query.dynamic
      || ctx.request.headers['cas-dynamic'];
    const staticdynamic = ctx.request.body.staticdynamic
      || ctx.request.query.staticdynamic
      || ctx.request.headers['cas-staticdynamic'];
    let persistence = ctx.request.body.persistence
      || ctx.request.query.persistence
      || ctx.request.headers['cas-persistence'];

    if (persistence === undefined) {
      persistence = true;
    }
    if (!password || !(username || id)) {
      throw new utils.error.ParamsError('lack username or password');
    }
    const where = {
      is_delete: false,
    };

    if (username) {
      where.username = username;
    }
    if (id) {
      where.id = id;
    }

    const user = await models.user.findOne({
      attributes: ['id', 'password', 'is_admin', 'aliasname', 'username', 'realname'],
      where: where,
    });
    if (!user) {
      throw new utils.error.NotFoundError(`no username: ${username}`);
    }

    if (staticdynamic) {
      const _dynamic = password.slice(-6);
      const _static = password.slice(0, -6);
      const rv = utils.password.otpcheck(_dynamic, utils.password.encrypt(
        user.username + user.password, config.notp.salt));
      if (!rv) {
        throw new utils.error.ParamsError('optcode not right');
      } else {
        if (rv.delta < config.notp.delta) {
          throw new utils.error.ParamsError('optcode not right');
        }
      }
      if (!utils.password.check(_static, user.dataValues.password)) {
        throw new utils.error.ParamsError('password not right');
      }
    }

    if (dynamic) {
      const rv = utils.password.otpcheck(password, utils.password.encrypt(
        user.username + user.password, config.notp.salt));
      if (!rv) {
        throw new utils.error.ParamsError('optcode not right');
      } else {
        if (rv.delta < config.notp.delta) {
          throw new utils.error.ParamsError('optcode not right');
        }
      }
    }

    if (!dynamic && !staticdynamic) {
      if (!utils.password.check(password, user.dataValues.password)) {
        throw new utils.error.ParamsError('password not right');
      }
    }

    const value = {
      'id': user.id,
      'username': user.username,
      'aliasname': user.aliasname,
      'realname': user.realname,
      'gender': user.gender,
      'is_admin': user.is_admin,
    };
    ctx.return.data.value = value;
    if (+persistence) {
      if (!ctx.oauth) {
        ctx.session = value;
      }
    }
    ctx.set('Cas-Username', user.username);
    ctx.body = ctx.return;
    return;
  },

  async logout(ctx) {
    if (ctx.request.header.origin
     && ctx.request.header.origin.match(new RegExp(config.cors.domain))) {
      ctx.set('Access-Control-Allow-Credentials', 'true');
      ctx.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin);
    }
    ctx.session = null;
    ctx.body = ctx.return;
  },

  async get(ctx) {
    const user = await models.user.findOne({
      attributes: ['id', 'username', 'is_admin', 'gender', 'password',
                   'realname', 'is_delete', 'aliasname', 'mobile', 'email', 'key'],
      where: {
        is_delete: false,
        id: ctx.session.id,
      },
    });
    if (!user) {
      throw new utils.error.NotFoundError('dont find user');
    }
    user.dataValues.notp = utils.password.otpqrcode(
      utils.password.encrypt(
        user.username + user.password, config.notp.salt),
      config.notp.label);
    delete user.dataValues.password;
    ctx.return.data.value = user;
    ctx.body = ctx.return;
  },

  async filter(ctx) {
    const field = ctx.request.query.field;
    const value = ctx.request.query.value;
    const where = { is_delete: false };
    const attributes = ['id', 'username', 'gender', 'realname', 'aliasname',
                        'mobile', 'email', 'key'];
    if (field && ! attributes.includes(field)) {
      throw new utils.error.NotFoundError(`dont support field ${field}:${value}`);
    }
    if (field && value) {
      where[field] = value;
    }
    const user = await models.user.findAll({
      attributes: attributes,
      where: where,
    });
    if (!user) {
      throw new utils.error.NotFoundError('dont find user');
    }

    ctx.return.data.value = user;
    ctx.body = ctx.return;
  },

  async getOne(ctx) {
    const field = ctx.request.query.field;
    const value = ctx.request.query.value;
    const where = {};
    if (field && value) {
      where[field] = value;
    }
    const user = await models.user.findOne({
      attributes: ['id', 'username', 'gender',
                   'realname', 'aliasname', 'mobile', 'email', 'key', 'is_delete'],
      where: where,
    });
    if (!user) {
      throw new utils.error.NotFoundError('dont find user');
    }

    ctx.return.data.value = user;
    ctx.body = ctx.return;
  },

  async getByUsername(ctx) {
    const user = await models.user.findOne({
      attributes: ['id', 'username', 'gender', 'realname', 'is_delete',
                   'aliasname', 'mobile', 'email', 'key'],
      where: {
        username: ctx.params.username,
      },
    });
    if (!user) {
      throw new utils.error.NotFoundError('dont find user');
    }

    ctx.return.data.value = user;
    ctx.body = ctx.return;
  },

  async put(ctx) {
    delete ctx.request.body.username;
    delete ctx.request.body.password;
    delete ctx.request.body.id;
    const user = await models.user.update(ctx.request.body, {
      where: {
        id: ctx.session.id,
      },
    });
    if (!user) {
      throw new utils.error.ServerError('update user error');
    }
    ctx.body = ctx.return;
  },

  async updateByUsername(ctx) {
    delete ctx.request.body.username;
    delete ctx.request.body.password;
    delete ctx.request.body.id;
    const user = await models.user.update(ctx.request.body, {
      where: {
        username: ctx.params.username,
      },
    });
    if (!user) {
      throw new utils.error.ServerError('update user error');
    }
    ctx.body = ctx.return;
  },

  md5: {
    async login(ctx) {
      const username = ctx.request.body.username;
      const password = ctx.request.body.password;
      const user = await models.user.findOne({
        attributes: ['id', 'username', 'md5_password'],
        where: {
          is_delete: false,
          username: username,
        },
      });
      if (!user) {
        throw new utils.error.NotFoundError('dont find user');
      }
      if (!utils.password.check(password, user.dataValues.md5_password)) {
        throw new utils.error.ParamsError('md5 password not right');
      }
      ctx.body = ctx.return;
    },
  },

  ssh: {
    async login(ctx) {
      const username = ctx.request.body.username;
      const hash = ctx.request.body.hash || 'sha1';
      const signature = ctx.request.body.signature || '';
      const clear = ctx.request.body.clear || '';

      if (!['sha1', 'sha128', 'sha256'].includes(hash)) {
        throw new utils.error.ParamsError('only support sha1 sha256 hash algo');
      }
      const user = await models.user.findOne({
        attributes: ['id', 'key'],
        where: {
          is_delete: false,
          username: username,
        },
      });
      if (!user) {
        throw new utils.error.NotFoundError('dont find user');
      }
      for (const pubkey of user.key.split(/\r?\n/)) {
        const key = sshpk.parseKey(pubkey, 'ssh');
        const valid = key.createVerify(hash).update(clear).verify(new Buffer(signature, 'base64'));
        if (valid) {
          ctx.body = ctx.return;
          return;
        }
      }
      throw new utils.error.PermissionError('check signature error');
    },
  },

  key: {
    async getByUsername(ctx) {
      const username = ctx.params.username;
      const user = await models.user.findOne({
        attributes: ['id', 'key'],
        where: {
          is_delete: false,
          username: username,
        },
      });
      if (!user) {
        throw new utils.error.NotFoundError('dont find user');
      }

      ctx.return.data.value = user;
      ctx.body = ctx.return;
    },
  },

  avatar: {
    async get(ctx) {
      const user = await models.user.findOne({
        attributes: ['avatar'],
        where: {
          is_delete: false,
          id: ctx.session.id,
        },
      });

      ctx.response.set('Content-Type', 'image/jpeg');
      ctx.response.set('Cache-Control', `public, max-age=${config.avatar.cache}`);
      ctx.body = user.avatar;
    },

    async getByUsername(ctx) {
      const username = ctx.params.username;
      const user = await models.user.findOne({
        attributes: ['avatar'],
        where: {
          // is_delete: false, even if it's deleted:)
          username: username,
        },
      });
      if (!user) {
        throw new utils.error.NotFoundError('dont find user');
      }

      ctx.response.set('Content-Type', 'image/jpeg');
      ctx.response.set('Cache-Control', `public, max-age=${config.avatar.cache}`);
      ctx.body = user.avatar;
    },

    async post(ctx) {
      if (!ctx.request.body.files.avatar) {
        throw new Error('please upload avatar');
      }
      const avatar = ctx.request.body.files.avatar;
      const where = {};
      if (ctx.oauth && ctx.oauth.id) {
        const body = ctx.request.body.fields;
        if (body.id) {
          where.id = body.id;
        }
        if (body.username) {
          where.username = body.username;
        }
      } else {
        where.id = ctx.session.id;
      }

      if (avatar.size * 1024 >= config.avatar.maxsize) {
        throw new utils.error.ParamsError(
          `avatar too large, only smaller than ${config.avatar.maxsize / 1024 / 1024}KB`);
      }
      if (!(where.id || where.username)) {
        throw new utils.error.ParamsError('lack username or id');
      }
      const buffer = await new Promise((resolve, reject) => {
        fs.readFile(avatar.path, (err, data) => {
          if (err) return reject(err);
          return resolve(data);
        });
      });
      const user = await models.user.update({
        avatar: buffer,
      }, {
        where: where,
      });
      if (!user) {
        throw new utils.error.ServerError('update user error');
      }

      await new Promise((resolve, reject) => {
        fs.unlink(avatar.path, (err, data) => {
          if (err) return reject(err);
          return resolve(data);
        });
      });

      ctx.body = ctx.return;
    },
  },

  dynamicpassword: {
    async post(ctx) {
      const dp = ctx.request.body.dynamicpassword;
      const user = await models.user.findOne({
        attributes: ['username', 'password'],
        where: {
          is_delete: false,
          id: ctx.session.id,
        },
      });
      const rv = utils.password.otpcheck(dp, utils.password.encrypt(
        user.username + user.password, config.notp.salt));
      if (!rv) {
        throw new utils.error.ParamsError('optcode not right');
      } else {
        if (rv.delta < config.notp.delta) {
          throw new utils.error.ParamsError('optcode not right');
        }
      }
      ctx.body = ctx.return;
    },

    async get(ctx) {
      const user = await models.user.findOne({
        attributes: ['id', 'username', 'password'],
        where: {
          is_delete: false,
          id: ctx.session.id,
        },
      });
      if (!user) {
        throw new utils.error.NotFoundError('dont find user');
      }
      user.dataValues.notp = utils.password.otpqrcode(
        utils.password.encrypt(
          user.username + user.password, config.notp.salt),
        config.notp.label);
      delete user.dataValues.password;
      ctx.return.data.value = user;
      ctx.body = ctx.return;
    },
  },

  staticpassword: {
    async put(ctx) {
      const oldpassword = ctx.request.body.oldpassword;
      const newpassword = ctx.request.body.newpassword;

      const value = zxcvbn(newpassword);
      if (value.score <= 1) {
        throw new utils.error.ParamsError('password strength is too low');
      }
      const user = await models.user.findOne({
        attributes: ['id', 'password'],
        where: {
          is_delete: false,
          id: ctx.session.id,
        },
      });
      if (!user) {
        throw new utils.error.NotFoundError('dont find user');
      } else {
        if (!utils.password.check(oldpassword, user.password)) {
          throw new utils.error.ParamsError('old password not right');
        }
      }
      const salt = utils.password.genSalt(config.password.bcryptlength);
      await models.user.update({
        password: utils.password.encrypt(newpassword, salt),
        md5_password: utils.password.encrypt(md5(newpassword), salt),
      }, {
        where: {
          id: ctx.session.id,
        },
      });
      ctx.body = ctx.return;
    },
  },
};
