/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T22:06:56+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-05T12:15:37+08:00
* @License: The MIT License (MIT)
*/


import x509 from 'x509';
import jwt from 'jsonwebtoken';

import config from '../../config';
import models from '../../models';
import utils from '../../utils';
import pki from '../../utils/pki';


module.exports = {
  async check(ctx) {
    const inhost = parseInt(ctx.request.body.inhost, 10);
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

    if (inhost) {
      const group = await models.group.findOne({
        attributes: ['id'],
        where: {
          name: host,
          is_delete: false,
        },
      });
      if (!group) {
        throw new utils.error.ParamsError(`${host} group not found`);
      }

      const group_user = await models.group_user.findOne({
        where: {
          group_id: group.id,
          user_id: user.id,
          is_delete: false,
        },
      });
      if (!group_user) {
        throw new utils.error.ParamsError(`you are not allowed to access the host:${host}`);
      }
    }

    const oc = await models.oauth.findOne({
      attributes: ['id', 'secret'],
      where: {
        is_delete: false,
        domain: host,
      },
    });
    if (!oc) {
      throw new utils.error.ParamsError(`the host:${host} is not authorized oauth`);
    }

    const token = jwt.sign({
      username: cdn.CN,
      iat: Math.floor(Date.now() / 1000) - 15,
      iss: config.app.name,
      exp: Math.floor(Date.now() / 1000) + config.jwt.expire,
      sub: cdn.CN,
      aud: host

    }, oc.secret, { algorithm: 'HS256' })

    ctx.return.data.value = token;
    ctx.body = ctx.return;
  },
};
