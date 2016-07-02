/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T22:06:56+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-02T23:13:03+08:00
* @License: The MIT License (MIT)
*/


import rfc2560 from 'asn1.js-rfc2560';
import querystring from 'querystring';

import models from '../../models';
import config from '../../config';
import utils from '../../utils';
import OCSPServer from '../../utils/ocspserver';


module.exports = {
  async get(ctx) {
    ctx.body = 'abcd';
  },

  async crl(ctx) {
    console.log('receive crl');
    ctx.body = 'abcd';
  },

  ocsp: {
    async get(ctx) {
      const ocsp = new Buffer(querystring.unescape(ctx.params.ocsp), 'base64');
      console.log(ocsp);
      const where = { id: [] };
      let ocspReq = {};

      try {
        ocspReq = rfc2560.OCSPRequest.decode(ocsp, 'der');
        const rls = ocspReq.tbsRequest.requestList;
        for (const i in ocspReq.tbsRequest.requestList) {
          if (!ocspReq.tbsRequest.requestList.hasOwnProperty(i)) {
            continue;
          }
          const cert = rls[i].reqCert;
          where.id.push(parseInt(cert.serialNumber.toString(10), 10));
        }
      } catch (e) {
        throw new utils.error.ParamsError('ocsp decode error');
      }

      if (!where.id.length) {
        throw new utils.error.ParamsError('ocsp cert not found');
      }

      const ocspserver = new OCSPServer(ocspReq);
      for (let i = 0; i < where.id.length; i++) {
        const id = where.id[i];
        const pki = await models.pki.findOne({
          attributes: ['id'],
          where: {
            id,
            is_delete: false,
          },
        });
        if (!pki) {
          ocspserver.addCert(id, 'revoked', {
            revocationTime: new Date(),
            revocationReason: 'CACompromise',
          });
        } else {
          ocspserver.addCert(id, 'good');
        }
      }

      const ocspResp = await ocspserver.getResponses();
      ctx.body = ocspResp;
    },

    async post(ctx) {
      if (ctx.request.header['content-type'] !== 'application/ocsp-request') {
        throw new utils.error.ParamsError('only support ocsp request');
      }
      const ocsp = ctx.request.body;
      console.log(ocsp);
      const where = { id: [] };
      let ocspReq = {};

      try {
        ocspReq = rfc2560.OCSPRequest.decode(ocsp, 'der');
        const rls = ocspReq.tbsRequest.requestList;
        for (const i in ocspReq.tbsRequest.requestList) {
          if (!ocspReq.tbsRequest.requestList.hasOwnProperty(i)) {
            continue;
          }
          const cert = rls[i].reqCert;
          where.id.push(parseInt(cert.serialNumber.toString(10), 10));
        }
      } catch (e) {
        throw new utils.error.ParamsError('ocsp decode error');
      }

      if (!where.id.length) {
        throw new utils.error.ParamsError('ocsp cert not found');
      }

      const ocspserver = new OCSPServer(ocspReq);
      for (let i = 0; i < where.id.length; i++) {
        const id = where.id[i];
        const pki = await models.pki.findOne({
          attributes: ['id'],
          where: {
            id,
            is_delete: false,
          },
        });
        if (!pki) {
          ocspserver.addCert(id, 'revoked', {
            revocationTime: new Date(),
            revocationReason: 'CACompromise',
          });
        } else {
          ocspserver.addCert(id, 'good');
        }
      }

      const ocspResp = await ocspserver.getResponses();
      ctx.body = ocspResp;
    },
  },
};
