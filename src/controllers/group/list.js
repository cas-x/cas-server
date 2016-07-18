/**
* @Author: BingWu Yang (https://github.com/detailyang) <detailyang>
* @Date:   2016-07-11T10:25:15+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-18T19:54:34+08:00
* @License: The MIT License (MIT)
*/


import sequelize from 'sequelize';


import models from '../../models';
import utils from '../../utils';


module.exports = {
  async get(ctx) {
    const keyword = ctx.request.query.keyword || '';
    const where = { is_delete: false };

    if (keyword.length > 0) {
      where.$or = [{
        username: {
          $like: `%${keyword}%`,
        },
      }, {
        realname: {
          $like: `%${keyword}%`,
        },
      }, {
        aliasname: {
          $like: `%${keyword}%`,
        },
      }];
    }

    // it's not necessary to await in parallel for performance
    const users = await models.group.findAll({
      attributes: ['id', 'name', 'desc'],
      where: where,
      offset: (ctx.request.page - 1) * ctx.request.per_page,
      limit: ctx.request.per_page,
    });

    if (!users) throw new utils.error.NotFoundError();
    const count = await models.group.findOne({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: where,
    });
    ctx.return.data = {
      value: users,
      total: count.dataValues.count,
      per_page: ctx.request.per_page,
      page: ctx.request.page,
    };
    ctx.body = ctx.return;
  },

  async post(ctx) {
    delete ctx.request.body.id;
    const group = await models.group.create(ctx.request.body);
    if (!group) {
      throw new utils.error.ServerError('create group error');
    }
    ctx.body = ctx.return;
  },

  people: {
    async post(ctx) {
      const group_id = ctx.params.id || 0;
      const user_id = ctx.request.body.user_id || 0;

      if (!user_id) {
        throw new utils.error.ParamsError('user_id cannot be empty');
      }

      const gu = await models.group_user.create({
        group_id,
        user_id,
      });

      if (!gu) {
        throw new utils.error.ServerError('create group_user error');
      }

      ctx.body = ctx.return;
    },

    async delete(ctx) {
      const gid = ctx.params.id;
      const pid = ctx.params.pid;

      const group_user = await models.group_user.update({
        is_delete: true,
      }, {
        where: {
          group_id: gid,
          user_id: pid,
        },
      });
      if (!group_user) {
        throw new utils.error.ServerError('delete group_user error');
      }

      ctx.body = ctx.return;
    },

    async get(ctx) {
      const group_id = ctx.params.id || 0;
      const where = {
        group_id,
        is_delete: false,
      };

      // it's not necessary to await in parallel for performance
      const group_users = await models.group_user.findAll({
        attributes: ['id', 'user_id', 'group_id'],
        where: where,
        offset: (ctx.request.page - 1) * ctx.request.per_page,
        limit: ctx.request.per_page,
      });

      if (!group_users) throw new utils.error.NotFoundError();
      const count = await models.group_user.findOne({
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        ],
        where: where,
      });

      // do not use join
      const users = await models.user.findAll({
        attributes: ['id', 'username', 'realname'],
        where: {
          id: group_users.map((gu) => {
            return gu.user_id;
          }),
        },
      });

      const new_group_users = [];
      const find_user = (uid) => {
        for (const i in users) {
          if (!users.hasOwnProperty(i)) continue;
          const u = users[i];
          if (u.id === uid) {
            return users[i];
          }
          return null;
        }
      };

      for (const i in group_users) {
        if (!group_users.hasOwnProperty(i)) continue;
        const gu = group_users[i];
        const u = find_user(gu.user_id);
        if (u) {
          new_group_users.push({
            user_id: gu.user_id,
            group_id: gu.group_id,
            username: u.username,
            realname: u.realname,
          });
        }
      }

      ctx.return.data = {
        value: new_group_users,
        total: count.dataValues.count,
        per_page: ctx.request.per_page,
        page: ctx.request.page,
      };

      ctx.body = ctx.return;
    },
  },
};
