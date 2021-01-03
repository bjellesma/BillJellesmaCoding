---
title: 'The Virtual Environment and You'
date: '2018-11-13 23:00:00'
updateTime: '2018-11-13 23:00:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20190905_virtualenv/header.jpeg'
tagline: 'Using virtual environments is a great to not pollute your system with that package that ended up not working.'
tags:
- python
---
# TL;DR

* Virtualenv is a great python package to created isolated projects
* Vagrant is a way to take the idea of a virtual environment one step further and isolate an entire development environment rather than just projects
* You can download or even create different boxes of Vagrant to give you a different environment such as ubuntu or Linux Mint
* You can use provisioning scripts to download different software on a Vagrant Box whenever it boots up

# Virtualenv

Virtualenv is a python package that I use daily and for every new python project that I create. As much as I love using pip, I hate using pip to download every python package under the sun; virtualenv helps me keep packages organized in my system.

# Virtualenv Quickstart

1. Download the virtualenv package. Once you have python installed, install virtualenv with `pip install virtualenv`

Think of your virtual environment as another spot where python is installed. You don't keep your project files in the same folder as where python is installed. Similarly, best practices dictate to keep your virtualenv install folder seperate from your project folder. This also has the advantage of keeping your virtual environment out of your version control so if you are using `git` on one of your projects, for example, there is no chance of your virtual environment being commited.

2. Make a new directory to store all of your environments in; once you are in the root folder for all of your projects, use a command like `mkdir environments`. I also recommend keeping all of your virtualenvs in one folder. Say your root folder is `/projects`, you may have a project called *Green Eggs and Ham: Behind the story of Sam I Am* stored in `/projects/green_eggs_ham` and another project called *Cat In The Hat: Who Sat on the Mat* stored in `/projects/cat_hat`, there would be a seperate virtual environment for each in `/projects/environments`.

3. Make the virtual environment with `virtualenv green_eggs_ham`. You can also use other options with virtualenv to give you even more of a customized environment. You can read all about the options [here](https://virtualenv.pypa.io/en/latest/reference/).

One option that I'll normally use is, if I need a different version of python, I'll use `virtualenv -p /c/python27/bin/python green_eggs_ham`, this allows me to use python 2.7 in my virtual environment rather than the system python 3. This is useful if I need to troubleshoot a feature not working in python 2.7.

4. If you're using git bash for windows, you can type `source green_eggs_ham/Scripts/activate` to activate your virtual environment. If you are using Windows but don't have git bash, you need to run `cd green_eggs_ham/Scripts` and then `activate.bat`. Finally, if you're using Linux or Mac, you can use `source green_eggs_ham/bin/activate`

I usually create a short shell script back in my project files called `green_eggs_ham_env.sh` which contains the following:

```bash
source /projects/environments/green_eggs_ham
```

*Note: the path will be different based on your environment*

Though this short shell only saves one line of code, I find it easier to remember to call my shell script from within my project directory with `source green_eggs_ham_env.sh`.

5. Notice that you are part of your virtual environment by the fact that your bash prompt is now prefixed with `(green_eggs_ham)`. You can now install all of your pip packages. Let's test this feature by using `pip install python-dotenv`. When you're ready to leave your environment, you can type `deactivate` and you will notice that when you type `pip list`, python-dotenv no longer appears in the list of installed packages.

Installing packages is the feature of virtualenv that really shows its power. Picture yourself have multiple projects going and then you want to give your project files to a friend, how would you know which packages your friend needs to run the code?

# Vagrant

If you liked the above idea of create seperate python packages such as requests and urllib3, you'll love Vagrant. Vagrant takes this idea of isolated packages to the next level by isolating your entire environment, like if you need an entire install of Apache for one project.

# Vagrant Quickstart

1. Install virtualbox. On Linux, you need to download and install the .deb file from [here](https://www.virtualbox.org/wiki/Linux_Downloads)
2. You can also download vagrant [here](https://www.vagrantup.com/downloads.html). You will be able download the appropriate install file for your system (deb for linux, msi for windows, etc)
3. Now, in a terminal, navigate to the directory that you'd like this virtual machine to live.
4. All you need are the following command
```bash
$ vagrant init hashicorp/precise64
```
This creates a vagrant file which will contain all of your configurations. `hashicorp/precise64` is the name of an image which contains base configurations for the vagrant file. You can find several of these images on the [official website catalog](https://app.vagrantup.com/boxes/search)

5. Once the vagrantfile is initialized, you're ready to go with your vagrant virtual machine. Just use the following command to bring up the machine

```bash
vagrant up
```

Vagrant may take a few seconds to start, you will know it is finished when you are prompted for input again.

```
default: Guest Additions Version: 4.2.0
    default: VirtualBox Version: 5.1
==> default: Mounting shared folders...
    default: /vagrant => /home/bjellz/Documents/vagrant_getting_started
==> default: Machine already provisioned. Run `vagrant provision` or use the `--provision`
==> default: flag to force provisioning. Provisioners marked to run always will still run.
ubuntu:~/Documents/vagrant_getting_started$
```

6. Now, what got me for awhile when I first performed this was I didn't see any difference in my terminal session. You can use this command:

```bash
vagrant ssh
```

Now you will know that you are in your virtual environment because your prompt will now look like:

```
Welcome to Ubuntu 12.04 LTS (GNU/Linux 3.2.0-23-generic x86_64)

 * Documentation:  https://help.ubuntu.com/
New release '14.04.5 LTS' available.
Run 'do-release-upgrade' to upgrade to it.

Welcome to your Vagrant-built virtual machine.
Last login: Fri Mar 23 02:04:54 2018 from 10.0.2.2
vagrant@precise64:~$
```

## Installing Software

Now, what good is using a virtual environment without software? By creating provisioning scripts inside your VM's /home/vagrant directory, you can tell Vagrant to automatically install software whenever someone performs `vagrant up`. Taking the example from Vagrant's official website, create a file name `bootstrap.sh` in your `/home/vagrant` directory.

Since this `/home/vagrant` directory on your VM is shared with the directory on your host machine that contains the `Vagrantfile`. This was great news to me because it meant that I could use [atom](https://atom.io/) to edit `bootstrap.sh` which was in my `/vagrant-getting-started` directory on my Ubuntu machine. I highly recommend this tactic unless you want to use `vi` or `nano`.

Having your favorite text editor in hand, edit `bootstrap.sh` to install Apache.

```bash
#!/usr/bin/env bash

apt-get update
apt-get install -y apache2
if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi
```

You will also want to uncomment the following line in `Vagrantfile`

```bash
config.vm.provision :shell, path: "bootstrap.sh"
```

This line tells Vagrant to run `bootstrap.sh` when the VM is brought up. If you already have the VM running, just run `vagrant reload --provision`

Now, using Apache, you can run a web server in your vagrant terminal but you'll only be able to actually see the pages that that web server hosts from web browsers installed on Vagrant. Fortunately, you can use port fowarding to pipe a port on your vagrant install over to your host machine so that you can open your favorite web browsing software. Remember port forwarding for computer games? Well, it's the same concept except, instead of opening a port on your router, you're opening a "virtual" port in Vagrant. To get started, just add the following line into your Vagrantfile:

```bash
config.vm.network :forwarded_port, guest: 80, host: 4567
```

Your Vagrantfile should now look like:

```bash
Vagrant.configure("2") do |config|
  config.vm.box = "hashicorp/precise64"
  config.vm.provision :shell, path: "bootstrap.sh"
  config.vm.network :forwarded_port, guest: 80, host: 4567
end
```

All of the traffic normally run on http port 80 is now forwarded to port 4567 on your host machine. Now, you can open your web browser and type in [http://127.0.0.1:4567](http://127.0.0.1:4567) and all of the traffic that Apache serves can now be viewed in your web browser

## Shut down

You can logout of vagrant with

```
vagrant@precise64:~$ logout
```

Think of vagrant as another computer, all that you've done is sign out of the machinhttps://atom.io/e. The machine is still running and consuming resources on the host. To "shut down" the machine, use the following command

```
bjellz@bjellz-ubuntu:~/Documents/vagrant_getting_started$ vagrant destroy
    default: Are you sure you want to destroy the 'default' VM? [y/N] y
==> default: Forcing shutdown of VM...
==> default: Destroying VM and associated drives...
```

Notice that this command is run at the prompt of the host machine and not Vagrant. This means that you must already be logged out of your vagrant machine. Again, think of your vagrant machine as a physical computer.

If you use `vagrant destroy`, your machine will need to run through all of the provisioning scripts again since it is actually rebuilding the machine. This isn't a problem for our tutorial vagrant but what happens when the software you want to provision gets larger and larger? Vagrant will take longer to come back. Alternatively, you can use `vagrant halt` to still shut down the machine but, instead, all of your provisioning software is preserved.

# References

* [Virtualenv](https://virtualenv.pypa.io/en/stable/) is a great way to create an isolated environment so that you can easily test new programs and features without changing your own environment and installing packages globally
* [Virtualenv options](https://virtualenv.pypa.io/en/latest/reference/)
* [Vagrant](https://www.vagrantup.com/docs/index.html) has great documentation
