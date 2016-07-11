/**
* @Author: BingWu Yang (https://github.com/detailyang) <detailyang>
* @Date:   2016-07-11T10:25:15+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-11T14:00:32+08:00
* @License: The MIT License (MIT)
*/


import sequelize from 'sequelize';


import models from '../../models';
import utils from '../../utils';


module.exports = {
  async get(ctx) {
    const keyword = ctx.request.query.keyword || '';
    const where = {};

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
    if (!users.length) {
      throw new utils.error.NotFoundError('dont find group');
    }

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
};
