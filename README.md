## @kromi77/express-rh

## Table of contents

- [☕️ About-erh](#️-about-erh)
- [📀 Requirements](#-√)
- [🔧 Installation](#-installation)
- [🚀 Quick start](#-quick-start)
- [📖 Documentation](#-documentation)
- [🔍 Good to know](#-good-to-know)
- [🚨 Issues](#-issues)

## ☕️ About ERH

The package was created from a spontaneous idea that came up while my friends and I were working on a joint project (a social platform) for a university course. Since we used Express to build the backend for our project, I took on the task of creating a route handler, which became the foundation of the current state of the package you see here. I really liked Next.js and the way it handles routing, so I wanted this handler to closely replicate that behavior.

## 📀 Requirements
![Express.JS](https://img.shields.io/badge/-Express-black?style=flat&logo=Express&logoColor=white)
![Node.JS](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=Node.js&logoColor=white) or
![Bun](https://img.shields.io/badge/-Bun-1A2B3C?style=flat&logo=Bun&logoColor=white)


## 🔧 Installation
For npm:

```bash npm i @kromi77/express-rh```

For bun:

```bash bun add @kromi77/express-rh```

## 🚀 Quick start

**ESM**

```ts
//index.ts
import ERH from "@kromi77/express-rh";
import express from "express";
import path from "path";
const routes = new ERH({
	app: express(),
	endpointsFolder: path.join(__dirname, "endpoints"),
	useParentPath: true,
	baseRoute: "/api/v1/",
});
```

```ts
// endpoints/get/users.ts
import { Response, Request } from "express";
export default {
	callback: (req: Request, res: Response) => {
		res.send("Hello from GET/users.js!");
	},
};
```

**CJS**

```js
//index.js
const { ERH } = require("@kromi77/express-rh");
//OR
//const ERH = require('@kromi77/express-rh').default;
const express = require("express");
const path = require("path");
const routes = new ERH({
	app: express(),
	endpointsFolder: path.join(__dirname, "endpoints"),
	useParentPath: true,
	baseRoute: "/api/v1/",
});
```

```js
// endpoints/get/users.js
module.exports = {
	callback: (req, res) => {
		res.send("Hello from GET/users.js!");
	},
};
```

## 📖 Documentation

### ERH Options

|         **Option**         |      **Type**       | **Required** |            **Default**            |                                                             **Description**                                                             |
| :------------------------: | :-----------------: | :----------: | :-------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------: |
|            app             | express.Application |      ✅      |                 -                 |                                                     Instance of express application                                                     |
|      endpointsFolder       |       string        |      ✅      |                 -                 | Path to folder with endpoints. Inside this folder remember to create folders that will match naming of methods like GET, POST, PUT etc. |
|            host            |       string        |      ❌      |             localhost             |                                                            Host to listen on                                                            |
|            port            |       number        |      ❌      | 3000 for public 8080 or 0 for dev |                                                            Port to listen on                                                            |
|         baseRoute          |       string        |      ❌      |                 /                 |            Base api route that will be added before endpoint ex. /api/v1/ then endpoint will look like /api/v1/yourendpoint             |
|          devMode           |       boolean       |      ❌      |               false               |                                                     If dev server should be created                                                     |
|        devModeRoute        |       string        |      ❌      |               /dev                |             You route that will be added before dev endpoint ex. /dev/v2 then endpoint will look like /dev/v2/yourendpoint              |
|      useBuiltInLogger      |       boolean       |      ❌      |               true                |                                   Whether you want to use built in logger to log every endpoint call                                    |
|   useBuiltInRateLimiter    |       boolean       |      ❌      |               true                |           Whether you want to use built in rate limiter that using express-rate-limit with values described in usage section            |
|       useBuiltInCors       |       boolean       |      ❌      |               true                |                                         Whether you want to use built in cors from cors package                                         |
|    useBuiltInJsonParser    |       boolean       |      ❌      |               true                |                                        Whether you want to use built in json parser from express                                        |
| useBuiltInUrlEncodedParser |       boolean       |      ❌      |               true                |                                    Whether you want to use built in url encoded parser from express                                     |
|       useParentPath        |       boolean       |      ❌      |               false               |                                      Whether to use directory structure as base path for endpoints                                      |
|      middlewareFolder      |       string        |      ❌      |                 -                 |                                                         Folder with middlewares                                                         |
|       staticFolders        |      string[]       |      ❌      |                 -                 |                                                   List of folders with static content                                                   |
|       staticBasePath       |       string        |      ❌      |              /static              |                                                     Base api route for static files                                                     |
|       startCallback        |      function       |      ❌      |            simple log             |                                        Whether you want to overwrite base server start callback                                         |

### Interface IMiddlewareModule

| **Property** |     **Type**      | **Required** | **Default** |                    **Description**                    |
| :----------: | :---------------: | :----------: | :---------: | :---------------------------------------------------: |
|   callback   |     function      |      ✅      |      -      |  Callback function with functionality of middleware   |
|     name     |      string       |      ❌      |      -      |               Name of middleware module               |
|    global    |      boolean      |      ❌      |    true     | Whether middleware should be used among all endpoints |
|   matcher    | string[] (RegExp) |      ❌      |      -      |    Whether middleware should be used matched paths    |
|    ignore    |      boolean      |      ❌      |    false    | Whether middleware should be ignored from setting up  |

### Interface IEndpointModule

| **Property** |       **Type**       | **Required** | **Default** |                **Description**                |
| :----------: | :------------------: | :----------: | :---------: | :-------------------------------------------: |
|     path     |        string        |      ❌      |      -      |   Override the default path of the endpoint   |
| middlewares  | IMiddlewareModule [] |      ❌      |     []      |   Define middleware to run on endpoint call   |
|   callback   |       Function       |      ✅      |      -      | Callback function with endpoint functionality |

## 🔍 Good to know

- If you use one of `--public`, `-p`, `--host`, `-h` flags then handler will try to host your app publicly

- Adding `.` in name of your endpoint file will extend a path eg. products.list.js will result path: `basepath/products/list`

- Using `[id]` as your folder name will result dynamic path it's same as using `:id`

## 🚨 Issues

If you see any improvements to make or found a bug feel free to open an issue with this template

```
Type: Issue | Improvement
Description of issue or improvement:
Express version:
NodeJS version:
ERH version:
Additional info:
```
