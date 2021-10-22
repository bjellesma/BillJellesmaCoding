---
title: "Using Pipenv with Odoo"
date: "2021-10-22 1:00:00"
updateTime: "2021-10-22 1:00:00"
author: "Bill Jellesma"
authorImage: ../../assets/images/author/author-bjellesma.jpg
image: ../../assets/images/20210912_odoo.jpg
tagline: "There's a virtual environment for that!"
published: true
tags:
  - Python
  - Odoo
---

# Motivation

`pipenv` is a package that can be used with Odoo to automate a lot of scripts. Previously, I've mentioned using [`npm` and `package.json` to make an easy workflow](https://billjellesmacoding.netlify.app/blog/20200319_npm_scripts). Working with Odoo, I'm in a fully python environment and wanted to stay away from unnecessarily installing `node.js` just to make it easier to run scripts. `pipenv` has this same functionality where we can define a `server` script so that at the end of the day, we can just run `pipenv run server`.

# Advantages of Pipenv

I've also talked before about several other advantages of using [`pipenv` as a virtual environment](https://billjellesmacoding.netlify.app/blog/20191208_virtual_environments). Here are a couple advantages talked about in the article:

- Your packages are isolated to a virtual environment. If you have multiple python projects, this helps so that your dependencies aren't installed globally. For example, if you're working on a Django project and also have a Flask project on your system, they may have dependencies in common that you've installed globally. If you hand the project to another developer, they may get either an incomplete list of dependencies or dependencies that they don't need. Virtual environments solve this so that the dependencies your project needs are isolated to that one project.

- Unlike `virtualenv` where you needed to enter the virtual shell first to give you a virtual command prompt **and then** run your script, `pipenv` lets you run anything from your virtual environment with one command by prefixing your command with `pipenv run`. For example, to run a script called `hello.py` using `pipenv`, you can simply use `pipenv run python hello.py`

![Running hello.py](../../assets/images/2021-10-22-00-22-00.png)

As we'll see below, `pipenv` also creates an easy way to run scripts.

# Using Pipenv with Odoo

1. Install `pipenv`

It probably won't come as much of a surprise that `pipenv` itself is a python package. So, we'll install `pipenv` globally using `pip install pipenv`.

2. Install all of the Odoo dependencies

When you first clone the [Odoo repository from Github](https://github.com/odoo/odoo), you'll see a `requirements.txt` file. This file is usually used with `pip` to install all of the listed packages. `pipenv` also has a built in way to use this file. If this is a fresh install or no `Pipfile` is present, you can simply use `pipenv install` and it will automatically detect a `requirements.txt` file being used.

![Fresh Installl](../../assets/images/2021-10-21-23-31-05.png)

If a `Pipfile` is already present and you simply want to add what's contained in `requirements.txt`, you can also do this by explicitly specifying your `requirements.txt` file with `pipenv install -r requirements.txt`

![Install requirements.txt](../../assets/images/2021-10-21-23-39-05.png)

3. On your `Pipfile`, create a script to start Odoo

To run Odoo, you can simply do `python ./odoo-bin`. We can add this to our `Pipfile` by using specifying a `scripts` section like so.

```
[[source]]
name = "pypi"
url = "https://pypi.org/simple"
verify_ssl = true

[dev-packages]

[packages]
...

[requires]
python_version = "3.7"

[scripts]
server = "python ./odoo-bin"
```

Now we can run `pipenv run server`.

`python ./odoo-bin` is not a difficult command to run every time and not much different than using `pipenv run server` so the advantage isn't obvious until your command starts to scale.

What about any parameters such as specifying an addons path? What about specifying a parameter to point to a specific database? These parameters can be used in a `.conf`file so we'll create a `run.conf` file.

`run.conf`

```conf
[options]
addons=addons
database=odoo-tutorials
```

Now the command to run will be `python ./odoo-bin -c run.conf`. Not a big change.

If we're developing an addon called `sillygame`, we'll often want to update it from the command line using `-u` so our command is now `python ./odoo-bin -c run.conf -u sillygame`. Now the command is getting a little long.

Let's say that we want to run another script to write environmental variables to our `run.conf` file before we start the server so that we can keep our environmental variables in a `.env` file. We'll call this script `run-env.py`. Now the command is `python ./run-env.py && python ./odoo-bin -c run.conf -u sillygame`. This is a pretty long command and difficult to remember when we're starting our day.

However, in the `pipfile` approach, we simply update the `Pipfile`

```
[[source]]
name = "pypi"
url = "https://pypi.org/simple"
verify_ssl = true

[dev-packages]

[packages]
...

[requires]
python_version = "3.7"

[scripts]
server = "python ./run-env.py && python ./odoo-bin -c run.conf -u sillygame"
```

and we're still running `pipenv run server`

Additionally, we'll start running a new command when we run tests down the road. The command we'll use will resemble `python ./odoo-bin --test-file=addons/sillygame/tests/test_sillygame.py`. We can add this to our `Pipfile` as a new script.

```
name = "pypi"
url = "https://pypi.org/simple"
verify_ssl = true

[dev-packages]

[packages]
...

[requires]
python_version = "3.7"

[scripts]
server = "python ./run-env.py && python ./odoo-bin -c run.conf -u sillygame"
test = "python ./odoo-bin --test-file=addons/sillygame/tests/test_sillygame.py"
```

So, now we can run `pipenv run test` whenever we want to run our test.
