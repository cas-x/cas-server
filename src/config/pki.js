/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-16T22:03:58+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-02T21:44:33+08:00
* @License: The MIT License (MIT)
*/


import path from 'path';


if (process.env.NODE_ENV === 'dev') {
  module.exports = {
    dir: path.join(path.dirname(path.dirname(path.dirname(__filename))), 'pki'),
    days: process.env.CAS_PKI_DAYS || 30,
    password: process.env.CAS_PKI_PASSWORD || 'password',
    subj: process.env.CAS_PKI_SUBJ || '/C=US/ST=NY/L=New York/O=CAS',
    ca: {
      x509: process.env.CAS_PKI_CA_X509
        || path.join(path.dirname(path.dirname(path.dirname(__filename))), 'pki/x509.cnf.dev'),
      passin: process.env.CAS_PKI_CA_PASSIN || '1234',
      unsecurekey: process.env.CAS_PKI_CA_KEY || path.join(path.dirname(path.dirname(
        path.dirname(__filename))), 'pki/unsecure.ca.key'),
      key: process.env.CAS_PKI_CA_KEY || path.join(path.dirname(path.dirname(
        path.dirname(__filename))), 'pki/ca.key'),
      crt: process.env.CAS_PKI_CA_CRT || path.join(path.dirname(path.dirname(
        path.dirname(__filename))), 'pki/ca.crt'),
    },
  };
} else if (process.env.NODE_ENV === 'test') {
  module.exports = {
    dir: path.join(path.dirname(path.dirname(path.dirname(__filename))), 'pki'),
    days: process.env.CAS_PKI_DAYS || 30,
    password: process.env.CAS_PKI_PASSWORD || 'password',
    subj: process.env.CAS_PKI_SUBJ || '/C=US/ST=NY/L=New York/O=CAS',
    ca: {
      x509: process.env.CAS_PKI_CA_X509
        || path.join(path.dirname(path.dirname(path.dirname(__filename))), 'pki/x509.cnf.test'),
      passin: process.env.CAS_PKI_CA_PASSIN || '1234',
      unsecurekey: process.env.CAS_PKI_CA_KEY || path.join(path.dirname(path.dirname(
        path.dirname(__filename))), 'pki/unsecure.ca.key'),
      key: process.env.CAS_PKI_CA_KEY || path.join(path.dirname(path.dirname(
        path.dirname(__filename))), 'pki/ca.key'),
      crt: process.env.CAS_PKI_CA_CRT || path.join(path.dirname(path.dirname(
        path.dirname(__filename))), 'pki/ca.crt'),
    },
  };
} else {
  module.exports = {
    dir: path.join(path.dirname(path.dirname(path.dirname(__filename))), 'pki'),
    days: process.env.CAS_PKI_DAYS || 30,
    password: process.env.CAS_PKI_PASSWORD || 'password',
    subj: process.env.CAS_PKI_SUBJ || '/C=US/ST=NY/L=New York/O=CAS',
    ca: {
      x509: process.env.CAS_PKI_CA_X509
        || path.join(path.dirname(path.dirname(path.dirname(__filename))), 'pki/x509.cnf.prod'),
      passin: process.env.CAS_PKI_CA_PASSIN || '1234',
      unsecurekey: process.env.CAS_PKI_CA_KEY || path.join(path.dirname(path.dirname(
        path.dirname(__filename))), 'pki/unsecure.ca.key'),
      key: process.env.CAS_PKI_CA_KEY || path.join(path.dirname(path.dirname(
        path.dirname(__filename))), 'pki/ca.key'),
      crt: process.env.CAS_PKI_CA_CRT || path.join(path.dirname(path.dirname(
        path.dirname(__filename))), 'pki/ca.crt'),
    },
  };
}
