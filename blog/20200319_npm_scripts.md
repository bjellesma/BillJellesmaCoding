---
title: 'Using NPM scripts to make an easy workflow'
date: '2020-03-26 23:15:00'
updateTime: '2020-03-26 23:15:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20200326_nodejs.png'
tagline: 'NPM is a great developer to simplify a workflow'
tags:
- JSON
- NPM
- NodeJS
- Workflow
---

# Intro

Over the past couple of years working on programming projects, I've learned that one of the most valueable assets to have is a good workflow. My favorite workflow tool is Node Package Manager (npm). NPM is a broad tool to help manage packages used on the front end of your application; specifically, javascript packages. If you're creating a modern frontend using frameworks such as React, Vue, or Angular, or even using vanilla ES2015 javascript, you're probably already using npm to help manage the dependency tree to make your application function. But npm is also able to create a workflow through a file called `package.json`. In my experience, even if I'm creating a script using python, I find the use of a `package.json` file to be handy in making a smooth workflow. 

__I've also found that pipenv has a lesser known [scripts section](https://pipenv-fork.readthedocs.io/en/latest/advanced.html). However, I still prefer package.json because I can chain commands together (more on this below) and I find it easier to stay in the mental context of using npm.__

# Install NPM

As the name of NPM is Node Package Manager, we'll need to install NodeJS. Though needing to install software is often a deterrent for people, NodeJS is used with so many modern web apps that the chances are pretty good that any developer will already have this installed. If NodeJS is not installed, you can install it [from their official website](https://nodejs.org/en/download/) for Windows or use your favorite package manager with Mac or Linux. 

## Windows

Once you've downloaded the correct Windows Installer, 32 or 64-bit, for your system, just double click the installer file to run the installation. The installation works just the same as any other software (click next and accept the defaults unless you have a specific need). Once the installation is complete, you can verify the installation of both NodeJS and NPM by entering the following two commands:

```cmd
node -v
npm -v
```

__If these commands just return a message about the command not being found, you may need to restart your computer in order for these to be properly added to your PATH environmental variable__

## Linux (Ubuntu)

For all you hardcore Linux users, NodeJS is available in the Ubuntu repository so no PPA is necessary. Simply use Aptitude Package Manager with the following two commands:

```bash
sudo apt-get install nodejs
sudo apt-get install npm
```  

To take this a step further, you can install this from the [nodesource repository](https://nodesource.com/) so that you can easily upgrade your NodeJS version using `sudo apt update && sudo apt upgrade` which your probably familiar with using to upgrade Linux software. The following command will run a script from nodesource to add a GPG key to your normal repository.


```bash
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
```

__Though version 13 is current as of this writing, you can simply replace `setup_13.x` with the current version of NodeJS.__

## Mac (Homebrew)

You can use the [official website](https://nodejs.org/en/download/) to download a .pkg file. But if you want to be like one of the cool kids, you can install NodeJS using homebrew with

```bash
brew install node
```

# Start a package.json file

To start using a `package.json` file in your project, simply navigate to your project and issue the following command:

```bash
npm init -y
```

This command will create a simple `package.json` file and npm will attempt to guess the values for the script based on the name of your project. For example, let's say that you have a directory called `CoolProject` that you attempt the above command on, the following file will be created:

```json
{
  "name": "CoolProject",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

```

This file is meant to be boilerplate information and can be changed.

# Simple example using package.json

Let's say that I've built a script using the [argparse library in python](https://docs.python.org/3/library/argparse.html) and I'm using a command line parameter for username.

```py
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--username',help='The username for the application')
args = parser.parse_args()
print(f'The user for this application is {args.username}')
```

 Needing to enter `python script.py --username Bill` or `pipenv run python script.py --username Bill` can get tedious, not to mention prone to error. Let's say the next day after I boot up my machine and grab my coffee, I forget that I've add command line parameters to this program and instead of seeing 

 ```
The user for this application is Bill
 ```

I see the following

```
The user for this application is None
```

What went wrong? Oh, I forgot to specify the username in the command line. In this case, the fix was pretty easy to determine by just looking at the source code. What if I built a server program that takes a database username and password as optional parameters; that is, if one or neither is specified, we'll use the username and password in our environmental variables? In that case, you could connect to the wrong database without realizing it. The point is that entering the correct commands at the command line can become paramount to the success of the application; therefore, it's important that the correct commands are entered.

So going back to the simple application where you specify a username, simply modify the script section of your `package.json` to look like the following:

```js
...
"scripts": {
    "start": "pipenv run python script.py --username Bill"
  },
...
```

The entire file may look like this now:

```js
{
  "name": "CoolProject",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "pipenv run python script.py --username Bill"
  },
  "repository": {
    "type": "git",
    "url": ""
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": ""
  },
  "homepage": ""
}
```

Now, you can simply boot your computer, grab a coffee, and run `npm run start`.

# More complicated example of using package.json

For a slightly more complex and useful use of a package.json file, consider the following.

Lately, I've starting using [webpack-dev-server](https://webpack.js.org/guides/development/) to serve my project on a simple web server. The biggest advantage that I find with this approach is that I can take advantage of live reloading. Live reloading detects any changes that I make in my source code and automatically refreshes the page in my web browser to reflect those changes. Normally, webpack bundles all of your javascript into one file which is great for deployment and provides a lighter footprint through minification. But webpack-dev-server skips the bundling making live reload faster and much easier to debug (if there's an error in one of my javascript files, webpack-dev-server will tell me exactly the file and line number). Webpack-dev-server can be run by running `webpack-dev-server` However, when you're happy with your code, you do want to bundle and minify your code for your complete application which can be done using `webpack`. Finally, because my project is written in python, in order to bundle my project to an `exe`, I just enter `pipenv run pyinstaller script.py`. What I want is simply a watch script and a build script. Here, I can take advantage of chaining commands together. This is the scripts section of my `package.json`:

```js
...
"scripts": {
    "develop": "webpack-dev-server",
    "build": "webpack && pipenv run pyinstaller script.py -y"
  },
...
```

To run my project in development, I can simply type `npm run develop`. To build my project when it's ready to ship, I can simply run `npm run build`