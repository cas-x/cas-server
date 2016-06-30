/*
 * @Author: detailyang
 * @Date:   2016-03-10 17:34:34
* @Last modified by:   detailyang
* @Last modified time: 2016-06-30T14:20:48+08:00
 */
import utils from '../utils';
import models from '../models';

module.exports = async(ctx, next) => {
  if (ctx.request.path.indexOf('/admin') === 0) {
    if (ctx.session && ctx.session.is_admin) {
      return await next();
    }
    throw new utils.error.PermissionError('you are not admin');
  } else if (ctx.request.path.indexOf('/api') === 0) {
    if (ctx.session && ctx.session.id) {
      return await next();
    }
    throw new utils.error.PermissionError('you have not login');
  } else if (ctx.request.path.indexOf('/oauth') === 0) {
    const authorization = ctx.request.headers.authorization;
    if (!authorization) {
      throw new utils.error.ParamsError('lack authorization secret like `oauth $secret`');
    }
    const authorizationsplit = authorization.split(' ');
    if (authorizationsplit.length !== 2) {
      throw new utils.error.ParamsError('lack authorization secret like `oauth $secret`');
    }
    // reverse
    const type = authorizationsplit[0];
    const secret = authorizationsplit[1];
    if (type !== 'oauth') {
      throw new utils.error.ParamsError('authorization secret type only support oauth');
    }

    const oc = await models.oauth.findOne({
      attributes: ['id', 'name', 'domain', 'callback', 'is_admin'],
      where: {
        is_delete: false,
        secret: secret,
      },
    });
    if (!oc) {
      throw new utils.error.PermissionError('secret is not right ');
    }
    ctx.oauth = oc;
    return await next();
  }

  return await next();
};
