/*
 * @Author: detailyang
 * @Date:   2016-02-29 14:32:13
* @Last modified by:   detailyang
* @Last modified time: 2016-07-11T16:46:10+08:00
 */


import models from '../../models';
import utils from '../../utils';


module.exports = {
  async deleteById(ctx) {
    const group = await models.group.update({
      is_delete: true,
    }, {
      where: {
        id: ctx.params.id,
      },
    });
    if (!group) {
      throw new utils.error.ServerError('delete oauth error');
    }
    ctx.body = ctx.return;
  },

  async updateById(ctx) {
    const group = await models.group.update({
      name: ctx.request.body.name,
      desc: ctx.request.body.desc,
    }, {
      where: {
        id: ctx.params.id,
      },
    });
    if (!group) {
      throw new utils.error.ServerError('update group error');
    }
    ctx.body = ctx.return;
  },
};
