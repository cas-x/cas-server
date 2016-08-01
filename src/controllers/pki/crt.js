/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T22:06:56+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-05T12:15:37+08:00
* @License: The MIT License (MIT)
*/


import x509 from 'x509';

import config from '../../config';
import models from '../../models';
import utils from '../../utils';
import pki from '../../utils/pki';


module.exports = {
  async check(ctx) {
    const host = ctx.request.body.host;
    const cdn = pki.parse_dn(ctx.request.body.cdn);
    const sdn = pki.parse_dn(ctx.request.body.sdn);
    const sn = ctx.request.body.sn;

    const cacert = x509.parseCert(config.pki.ca.crt);
    const caissuer = cacert.issuer;

    if (caissuer.commonname !== sdn.commonname) {
      throw new utils.error.ParamsError('your certificate not sign by CAS CA');
    }

    const cn = cdn.CN;
    const user = await models.user.findOne({
      attributes: ['id'],
      where: {
        username: cn,
      },
    });

    if (!user) {
      throw new utils.error.ParamsError(`dont find the user ${cn}`);
    }

    const crtrow = await models.pki.findOne({
      attributes: ['name', 'days', 'created_at'],
      where: {
        id: parseInt(sn, 16),
        uid: user.id,
        is_delete: false,
      },
    });
    if (!crtrow) {
      throw new utils.error.ParamsError(`dont find the certificate ${cn}`);
    }
    crtrow.created_at.setDate(crtrow.created_at.getDate() + crtrow.days);
    if (crtrow.created_at <= new Date()) {
      throw new utils.error.ParamsError('your cert expired');
    }

    if (host) {
      const group = await models.group.findOne({
        attributes: ['id'],
        where: {
          name: host,
          is_delete: false,
        },
      });
      if (!group) {
        ctx.body = ctx.return;
        return;
      }

      const group_user = await models.group_user.findOne({
        where: {
          group_id: group.id,
          user_id: user.id,
          is_delete: false,
        },
      });
      if (!group_user) {
        throw new utils.error.ParamsError(`you are not allowed to access the host ${host}`);
      }
    }

    ctx.body = ctx.return;
  },
};
