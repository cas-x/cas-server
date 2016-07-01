/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T22:06:56+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-01T17:07:51+08:00
* @License: The MIT License (MIT)
*/


import rfc2560 from 'asn1.js-rfc2560';
import querystring from 'querystring';

import config from '../../config';
import utils from '../../utils';


module.exports = {
  async get(ctx) {
    console.log(config.pki.ca);
    ctx.body = 'abcd';
  },

  async crl(ctx) {
    console.log('receive crl');
    ctx.body = 'abcd';
  },

  ocsp: {
    async get(ctx) {
      const ocsp = new Buffer(querystring.unescape(ctx.params.ocsp), 'base64');
      const where = { id: [] };

      try {
        const ocspReq = rfc2560.OCSPRequest.decode(ocsp, 'der');
        const rls = ocspReq.tbsRequest.requestList;
        for (const i in ocspReq.tbsRequest.requestList) {
          if (!ocspReq.tbsRequest.requestList.hasOwnProperty(i)) {
            continue;
          }
          const cert = rls[i].reqCert;
          where.id.push(parseInt(`${cert.serialNumber}`, 10));
        }
      } catch (e) {
        throw new utils.error.ParamsError('ocsp decode error');
      }

      ctx.body = 'abcd';
    },

    async post(ctx) {
      ctx.body = 'abcd';
    },
  },
};
