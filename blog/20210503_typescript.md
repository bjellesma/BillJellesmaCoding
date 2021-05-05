---
title: 'Convert JavaScript Project to TypeScript'
date: '2021-05-04 15:20:00'
updateTime: '2021-05-04 15:20:00'
author: 'Bill Jellesma'
authorImage: ../../assets/images/author/author-bjellesma.jpg
image: ../../assets/images/20210505_typescript_to_javascript.png
tagline: 'Merge Conflicts are completely natural and nothing to be ashamed of'
published: true
tags:
    - TypeScript
---

# TL;DR

* We've all heard about the benefits of using typescript by now.
    * It's self documenting because you can define types.
    * There are less errors (generally) because the typescript compiler will yell at the user if they don't provide the defined types.
    * It still works with regular JavaScript so you don't need to convert everything to typescript all at once.

* Typescript can be used in any project using JavaScript whether it's vanilla JavaScript or NodeJS.
* We can use `nodemon` with `ts-node` to create a familiar dev environment.

# A Brief Example

When I started learning Angular, typescript came with it for free so I kind of got used to using typescript. I've become really accustomed to creating a function like this.

```ts
function yesOrNo(foo: string, bar: number, baz: any):boolean{
    // cool logic
    return true
}
```

Any other developer will be able to see the the function `yesOrNo` will take three paramaters:
* `foo` - a string
* `bar` - a number
* `baz` - can be literally any type
and see that the function returns a boolean, regardless of seeing the return statement.

But I wanted to be able to convert an existing project that I had into typescript. This took a little bit more effort to figure out how to insert the typescript compiler into my workflow (specifically, I was using nodejs) but I eventually got this to work.

# Using TypeScript in a Vanilla JS Project

Let's say that we have a directory structure like the following.

```
project
    |___src
        |___index.js
    |___dist
    |___package.json
    |___package-lock.json
```

and our `index.js` file will look like this

```js
function helloWorld(){
    console.log('hello world!')
}
```

1. First, we'll download and install the [TypeScript](https://www.typescriptlang.org/) package. We'll use the `-D` flag with npm to set typescript as a dev dependency.

```
npm install -D typescript
```

Installing typescript gives us access to the `tsc` command which, on its own, is enough to compile files in the current directory. However, we want a little bit more control.

2. Create a `tsconfig.json` file to instruct the typescript compiler with several options. You can create an initial boilerplate file by typing the following on the root directory.

```
tsc --init
```

3. In order to use the `tsc` command most efficiently on our project, we'll want to uncomment and define both the `outDir` and `rootDir` options in `tsconfig.json`.

```json
...
"outDir": "./dist",
"rootDir": "./src",
```

We're setting `rootDir` to our `scr` folder so that it compiles everything in that folder. Likewise, we'll set the `outDir` to the `dist` folder so that all of our compiled javascript will appear there.

4. Lastly, we'll want to rename any file that we want recognized by the typescript compiler to `.ts`. In our example, we'll rename `index.js` to `index.ts`

Now, we'll run `tsc` on the command line and you'll notice that all files in `src` and now compiled to `.js` files in `dist`.

Your new `index.js` file will look like this:

```js
"use strict";
function helloWorld() {
    console.log('hello world!');
}

```

If you look closely, you'll also notice a few aesthetic (some might consider it more essential than aesthetic) features. A semicolon was inserted after the `console.log()` call. A whitespace was also inserted before the curly brace of the function definition. This is just another example of how you can use TypeScript to make more "correct" code.

`"use strict"`, an option that forces strict type checking in JavaScript, can also be turned off via the `tsconfig.json` file. This may be an option to turn off if you're just trying to see if your project is still running when switching to typescript.

```json
...
"strict": true, //turn to false if you're just converting to typescript.
...
```

While we're on the subject, if you're converting a large project, you may also want to uncomment and turn off `noImplicitAny`. This option, if left on, can also give you several errors as most of your code will not have any types when first converting to typescript.

```json
...
"noImplicitAny": true, //turn to false if you're just converting to typescript.
...
```

# Converting a NodeJS Project to TypeScript with a Dev Server

Converting a NodeJS Project to TypeScript is a very similar process. There are just a few additional steps. We'll also include a [`nodemon`](https://www.npmjs.com/package/nodemon) Dev Server so that we can take advantage of hot reloading.

1. We'll install a Node JS hot reloading dev server globally. 

```
npm install -g nodemon
```

2. When first installing TypeScript on the project, we'll also want to install two additional packages. 

```
npm i -D typescript @types/node ts-node
```

[`ts-node`](https://github.com/TypeStrong/ts-node) will allow you to run a typescript file directly as node code. This will be used later on in our `nodemon.json` file so that we can run a typescript file directly.

[`@types/node`](https://www.npmjs.com/package/@types/node) will include type definitions for Node that will allow typescript to be able to validate properly as NodeJS.

3. We'll create a `nodemon.json` in the root of our project so that we can run our typescript file with hot reloading for dev work

```json
{
    "restartable": "rs",
    "ignore": [".git", "node_modules/", "dist/", "coverage/"],
    "watch": ["src/"],
    "execMap": {
      "ts": "node -r ts-node/register"
    },
    "env": {
      "NODE_ENV": "development"
    },
    "ext": "js,json,ts"
  }
```

`restartable` is a command that we can issue to `nodemon` to have the server restart.
`ignore` is a list of folders that we will have `nodemon` ignore when watching to restart the server.
`watch` is a list of folders that `nodemon` will watch for changes in.
`execMap` is a mapping between the file extension `ts` and the runtime to run our code.
`env` is a dictionary of environmental variables to include in the server.
`ext` is a comma separated string of extensions that `nodemon` will monitor within those folders.

4. We can run the server with the following command

```
nodemon --config nodemon.json ./src/bot.ts
```