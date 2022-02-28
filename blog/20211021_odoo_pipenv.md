---
title: "Using Pipenv with Odoo"
date: "2021-10-22 1:00:00"
updateTime: "2022-02-27 1:00:00"
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

# Common Errors

## Setuptools

Typically, you'll see a message that says that locking has failed. You may see an installation error such as the following:

```
Command "python setup.py egg_info" failed with error code 1
```

I solved this by running this line to upgrade my pipenv installation `pip install --upgrade pipenv`. Additionally, you should make sure that setuptools, pip, and ez_setup are up to date.

```
pip install --upgrade pip
pip install --upgrade setuptools
pip install --upgrade ez_setup
```

You can then use `pipenv lock --pre --clear` to attempt to resolve any unresolved dependencies.

## Out of date requirements.txt

After solving the above error for setuptools, I then received the following error when using `pipenv install -r requirements.txt`

```
[pipenv.exceptions.ResolutionFailure]: Warning: Your dependencies could not be resolved. You likely have a mismatch in your sub-dependencies.
  You can use $ pipenv install --skip-lock to bypass this mechanism, then run $ pipenv graph to inspect the situation.
  Hint: try $ pipenv lock --pre if it is a pre-release dependency.
ERROR: No matching distribution found for feedparser==5.2.1
```

For this common error, feedparser is just an example as other packages may no longer be needed in later versions of Odoo.

A little google-foo led me to [this github issue](https://github.com/odoo/odoo/issues/76144) where it's basically saying that feedparser is no longer a requirement in newer versions of Odoo. If you check the [branch 14.0 requirements.txt file](https://github.com/odoo/odoo/blob/14.0/requirements.txt), you'll see that feedparser has been removed. Depending on whether you've cloned the branch directly or created a fork, you may either do a `git pull` to pull the changes from the remote or simply copy and paste the contents of the file.

One important note is that if you've already run `pipenv install -r requirements.txt`, you may already have content in the packages section of your `Pipfile`.

```py
[dev-packages]

[packages]
feedparser = "==5.2.1"
...
freezegun = "==0.3.15"
...
```

In this case, remove the contents of the section so that when `pipenv install -r requirements.txt` is run, it'll pull all of the dependencies correctly.

```py
[dev-packages]

[packages]

```

## Pywin

After running `pipenv install -r requirements.txt`, I received a new error on use pywin

```
[pipenv.exceptions.ResolutionFailure]: Warning: Your dependencies could not be resolved. You likely have a mismatch in your sub-dependencies.
  You can use $ pipenv install --skip-lock to bypass this mechanism, then run $ pipenv graph to inspect the situation.
  Hint: try $ pipenv lock --pre if it is a pre-release dependency.
ERROR: No matching distribution found for pywin32>=223
```

This particular error occurred because I'm using linux. If you check the `requirements.txt` file, you can remove the line with the call for `pypiwin32 ; sys_platform == 'win32'`. Though this error shouldn't appear if you're using Windows, this dependency is unneeded if you're using a Mac or Linux. After removing this line from `requirements.txt`, you'll once again need to manually clear the dependencies in your `Pipfile` so that the packages section looks as the following:

```py
[dev-packages]

[packages]

```

If you've made it past these errors, you should now be generating a `pipfile.lock`

## ModuleNotFound Errors

```
ModuleNotFoundError: No module named 'PyPDF2'
ModuleNotFoundError: No module named 'OpenSSL'
```

```
pipenv install PyPDF2
pipenv install pyOpenSSL
```

## Deprecation Warning

Although I'm able to start my server successfully with `python ./odoo-bin`
