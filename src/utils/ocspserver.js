/**
* @Author: BingWu Yang (https://github.com/detailyang) <detailyang>
* @Date:   2016-07-01T17:44:19+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-07-02T23:11:56+08:00
* @License: The MIT License (MIT)
*/


import fs from 'fs';
import { Server } from 'ocsp';
import config from '../config';

const cert = fs.readFileSync(config.pki.ca.crt);
const key = fs.readFileSync(config.pki.ca.unsecurekey);

export default class OCSPServer {
  constructor(ocspReq) {
    this.ocspReq = ocspReq;
    this.server = new Server({
      cert,
      key,
    });
  }

  addCert(serial, status, info) {
    this.server.addCert(serial, status, info);
  }

  getResponses() {
    return new Promise((resolve, reject) => {
      this.server.getResponses(this.ocspReq, (err, responses) => {
        if (err) {
          return reject(err);
        }

        return resolve(responses);
      });
    });
  }
}
