/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-14T10:30:37+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-06-30T13:57:16+08:00
* @License: The MIT License (MIT)
*/


import Redis from 'ioredis';
import uuid from 'uuid';
import { Store } from 'koa-session2';


export default class RedisStore extends Store {
  constructor(host, port, db, key, ttl) {
    super();
    this.redis = new Redis({
      host: host,
      port: port,
      db: db,
    });
    this.key = key;
    this.redis.on('error', (err) => {
      throw err;
    });
    this.ttl = ttl;
  }

  getId(sid) {
    return `${this.key}:${sid}`;
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  async get(sid) {
    const data = await this.redis.get(`${this.getId(sid)}`);
    return JSON.parse(data);
  }

  async set(session, opts) {
    opts.sid = this.getID(32) + this.getRandomInt(1, 1000);
    if (Object.keys(session).length !== 0) {
      await this.redis.setex(`${this.getId(opts.sid)}`, this.ttl, JSON.stringify(session));
    }

    return opts.sid;
  }

  async destory(sid) {
    return await this.redis.del(this.getId(sid));
  }
}
