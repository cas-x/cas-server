/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T22:06:56+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-06-30T13:25:41+08:00
* @License: The MIT License (MIT)
*/


import uuid from 'uuid';
import querystring from 'querystring';

import models from '../../models';
import utils from '../../utils';
import { getRandomInt } from '../../utils/random';
import config from '../../config';


module.exports = {
  authorize: {
    async onetime(ctx) {
      const qs = querystring.escape(ctx.request.query.qs || '');
      const name = ctx.request.query.name;
      const debug = ctx.request.query.debug;
      const username = ctx.request.body.username;
      const password = ctx.request.body.password;
      const where = {
        is_delete: false,
      };

      if (username) {
        where.username = username;
      }
      const user = await models.user.findOne({
        attributes: ['id', 'password', 'username'],
        where: where,
      });
      if (!user) {
        throw new utils.error.NotFoundError(`no username: ${ctx.request.body.username}`);
      }

      const oc = await models.oauth.findOne({
        attributes: ['id', 'name', 'domain', 'callback', 'is_admin', 'type'],
        where: {
          is_delete: false,
          name: name,
        },
      });
      if (!oc) {
        throw new utils.error.NotFoundError(`cannot found oauth ${name}`);
      }

      if (oc.type <= 1) {
        if (!utils.password.check(password, user.dataValues.password)) {
          throw new utils.error.ParamsError('static password not right');
        }
      } else if (oc.type === 2) {
        const rv = utils.password.otpcheck(password, utils.password.encrypt(
          user.username + user.password, config.notp.salt));
        if (!rv) {
          throw new utils.error.ParamsError('dynamic password not right');
        } else {
          if (rv.delta < config.notp.delta) {
            throw new utils.error.ParamsError('dynamic password had expired');
          }
        }
      } else {
        const _dynamic = password.slice(-6);
        const _static = password.slice(0, -6);
        const rv = utils.password.otpcheck(_dynamic, utils.password.encrypt(
          user.username + user.password, config.notp.salt));
        if (!rv) {
          throw new utils.error.ParamsError('dynamic password not right');
        } else {
          if (rv.delta < config.notp.delta) {
            throw new utils.error.ParamsError('dynamic password had expired');
          }
        }
        if (!utils.password.check(_static, user.password)) {
          throw new utils.error.ParamsError('static password not right');
        }
      }

      const code = uuid.v4() + getRandomInt(0, 1000);
      const rv = await ctx.redis.setex(`${name}:${code}`, config.oauth.ttl,
        JSON.stringify({
          id: user.id,
          username: user.username,
          gender: user.gender,
          realname: user.realname,
          aliasname: user.aliasname,
          mobile: user.mobile,
          email: user.email,
        })
      );
      if (!rv) {
        throw new utils.error.ServerError('save code error');
      }
      let callback = `${oc.callback}`;
      if (debug) {
        callback = `${oc.callback_debug}`;
      }

      if (callback.includes('?')) {
        callback += `&code=${code}`;
      } else {
        callback += `?code=${code}`;
      }
      callback += `&qs=${qs}`;

      ctx.return.data.value = callback;
      ctx.body = ctx.return;
    },

    async get(ctx) {
      const qs = querystring.escape(ctx.request.query.qs || '');
      const name = ctx.request.query.name;
      const debug = ctx.request.query.debug;

      const oc = await models.oauth.findOne({
        attributes: ['id', 'name', 'domain', 'callback', 'is_admin', 'type'],
        where: {
          is_delete: false,
          name: name,
        },
      });
      if (!oc) {
        throw new utils.error.NotFoundError(`cannot found oauth ${name}`);
      }
      const env = {};
      switch (oc.type) {
        case 0:
          if (!ctx.session || !ctx.session.id) {
            if (debug) {
              return ctx.redirect(`/public/oauth?name=${name}&qs=${qs}&debug=${debug}`);
            }
            return ctx.redirect(`/public/oauth?name=${name}&qs=${qs}`);
          }
          return await ctx.render('authorize.html');
        case 1:
        case 2:
        case 3:
          env.authtype = oc.type;
          break;
        default:
          break;
      }
      return await ctx.render('onetime.html', { env });
    },

    async post(ctx) {
      if (!ctx.session || !ctx.session.id) {
        throw new utils.error.PermissionError('you havent login');
      }
      const qs = querystring.escape(ctx.request.query.qs || '');
      const name = ctx.request.query.name;
      const debug = ctx.request.query.debug;
      const oc = await models.oauth.findOne({
        attribute: ['id', 'callback', 'callback_debug'],
        where: {
          is_delete: false,
          name: name,
        },
      });

      if (!oc) {
        throw new utils.error.NotFoundError('dont find oauth');
      }

      const user = await models.user.findOne({
        attribute: ['id', 'username', 'gender', 'realname', 'aliasname', 'mobile',
                    'email'],
        where: {
          is_delete: false,
          id: ctx.session.id,
        },
      });
      if (!user) {
        throw new utils.error.NotFoundError('dont find user');
      }

      const code = uuid.v4();
      const rv = await ctx.redis.setex(`${name}:${code}`, config.oauth.ttl,
        JSON.stringify({
          id: user.id,
          username: user.username,
          gender: user.gender,
          realname: user.realname,
          aliasname: user.aliasname,
          mobile: user.mobile,
          email: user.email,
        })
      );
      if (!rv) {
        throw new utils.error.ServerError('save code error');
      }
      let callback = `${oc.callback}`;
      if (debug) {
        callback = `${oc.callback_debug}`;
      }

      if (callback.includes('?')) {
        callback += `&code=${code}`;
      } else {
        callback += `?code=${code}`;
      }
      callback += `&qs=${qs}`;
      console.log(qs);

      ctx.return.data.value = callback;
      ctx.body = ctx.return;
    },
  },

  oauth: {
    async get(ctx) {
      const qs = querystring.escape(ctx.request.query.qs || '');
      const name = ctx.request.query.name || '';
      if (ctx.session && ctx.session.id) {
        return ctx.redirect(`/public/oauth/authorize?name=${name}&qs=${qs}`);
      }
      await ctx.render('oauth.html');
      return true;
    },

    async getUser(ctx) {
      const code = ctx.request.query.code;
      const name = ctx.oauth.name;
      const rv = await ctx.redis.get(`${name}:${code}`);
      if (!rv) {
        throw new utils.error.NotFoundError('dont find users');
      }
      const user = JSON.parse(rv);
      ctx.return.data.value = user;
      ctx.body = ctx.return;
    },
  },
};
