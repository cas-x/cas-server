<h1 align="center">CAS: Center Authorization Server</h1>

<p align="center">
  <img src="https://cdn.rawgit.com/cas-x/cas-logo/master/cas.svg" width="200" height="200" />
  <br />
   <a href="https://coveralls.io/repos/github/cas-x/cas-server/badge.svg?branch=master">
    <img src="https://coveralls.io/repos/github/cas-x/cas-server/badge.svg?branch=master" />
  </a>
  <a href="https://img.shields.io/badge/branch-master-brightgreen.svg?style=flat-square">
    <img src="https://img.shields.io/badge/branch-master-brightgreen.svg?style=flat-square" />
  </a>
  <a href="https://travis-ci.org/cas-x/cas-server">
    <img src="https://api.travis-ci.org/cas-x/cas-server.svg" />
  </a>
  <a href="https://img.shields.io/badge/license-MIT-blue.svg">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
  </a>
  <a href="https://img.shields.io/github/release/cas-x/cas-server.svg">
    <img src="https://img.shields.io/github/release/cas-x/cas-server.svg" />
  </a>
</p>


CAS (pronounced *case*) is an **authorization server**.
Its goal is to make application authorization as easy as possible.It provides a restful api and ldap support (cas-ldap is be used to support ldap protocol over restful api [RFC 4511](https://tools.ietf.org/html/rfc4511)). CAS can be used to integrate with software which on support restful api or support ldap, and it have used to integrate gitlab、jira、confluence、jenkins、gerrit, vpn device, phabricator, grafana.


Table of Contents
-----------------

  * [Requirements](#requirements)
  * [Development](#development)
  * [Production](#production)
  * [Contributing](#contributing)
  * [License](#license)
  * [Author](#author)


Requirements
------------

CAS requires the following to run:

  * [Node.js][node] 0.1-5, (personally recommand latest release version)
  * [Npm][npm] (normally comes with Node.js)
  * [Redis][redis] >2.8 (use redis as session store and message queue)
  * [Mysql][mysql] (persisted database)


Development
-----------

looking at config.js, setting the redis and mysql option
```sh
npm install # to install nodejs dependencies
NODE_ENV=dev node scripts/init_table.js # init mysql table
NODE_ENV=dev node scripts/create_user.js --username admin --admin # create first user
NODE_ENV=dev node webpack-dev-server.js # to start up webpack server for develop
NODE_ENV=dev node babel.index.js # to use koa2
```
Then you can open the http://127.0.0.1:3000 to login


Production
-----------
For initialize the database, please run the command as follow before startup application:

````bash
npm install --production
NODE_ENV=production node scripts/init_table.js # init mysql table
NODE_ENV=production node scripts/create_user.js --username admin --admin # create first user
````

For deploy node.js application, any process management like PM2、Forever、Supervisor is ok. Anyway, before startup CAS, you must should set environment variable as follow:
```sh
export CAS_MYSQL_USERNAME=cas
export CAS_MYSQL_PASSWORD=11111
export CAS_MYSQL_DATABASE=cas
export CAS_MYSQL_HOST=1.1.1.1
export CAS_MYSQL_PORT=3306
export CAS_SESSION_HOST=2.2.2.2
export CAS_SESSION_PORT=6379
export CAS_SESSION_DB=0
export CAS_SESSION_TTL=86400
export CAS_SESSION_KEY=whosyourdady
export CAS_PASSWORD_DEFAULT=youzan
export CAS_PASSWORD_BCRYPTLENGTH=12
export CAS_SYSLOG_TAG=cas
export CAS_SYSLOG_FACILITY=local6
export CAS_SYSLOG_HOSTNAME=3.3.3.3
export CAS_SYSLOG_PORT=514
export CAS_QUEUE_NAME=cas
export CAS_QUEUE_HOSTNAME=4.4.4.4
export CAS_QUEUE_PORT=6379
export CAS_QUEUE_DB=1
export CAS_CACHE_HOST=5.5.5.5
export CAS_CACHE_PORT=6379
export CAS_CACHE_TTL=3600
export CAS_CACHE_DB=2
export CAS_EMAIL_HOST=smtp.xxxx.com
export CAS_EMAIL_PORT=25
export CAS_EMAIL_SECURE=0
export CAS_EMAIL_USER=cas@example.com
export CAS_EMAIL_PASS=123123123
export CAS_EMAIL_FROM=cas@example.com
```

Contributing
------------

To contribute to CAS, clone this repo locally and commit your code on a separate branch. 


Author
------

> GitHub [@detailyang](https://github.com/detailyang)     
> GitHub [@Raistlin916](https://github.com/Raistlin916)    
> GitHub [@NinoFocus](https://github.com/NinoFocus)    


License
-------

CAS is licensed under the [MIT] license.  


[node]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[mysql]: https://www.mysql.com/
[redis]: http://redis.io/
