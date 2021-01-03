---
title: 'Hacktoberfest - The Month of Open Source'
date: '2018-10-06 23:00:00'
updateTime: '2018-10-06 23:00:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20190905_hacktoberfest/header.png'
tagline: 'Hacktoberfest is that wonderful time of year with pretty leaves, pumpkin spiced lattes, and programming.'
tags:
- github
---
October brings many things: crisper weather, a time of year when dressing up as Freddy Krueger isn't considered "weird", and my birthday. But this October brought something new for me: [Hacktoberfest](https://hacktoberfest.digitalocean.com).

I first heard about Hacktoberfest when I was listening to one of my new favorite podcasts, [The Changelog](https://changelog.com/podcast/317). On this episode, Daniel Zaltsman, Dev Rel Manager at DigitalOcean and key leader of Hacktoberfest, was talking about how Hacktoberfest was a way for everyone from beginners to contributors to maintainers to get more involved in open source and get a free t-shirt in the process.

Normally, when I listened to The Changelog in the past, I would normally learn about some cool new or new to me open source software and play with it a little. I loved the idea of open source and I always toyed around with the thought of helping out but that thought never escalated into actually trying to help. But I decided that I'd give Hacktoberfest a try.

# TL;DR

* Hacktoberfest is a month long event in October designed to get people more involved in open source.
* Hacktoberfest is giving free t-shirts to the first 50,000 people that complete their challenge.
* To complete the Hacktoberfest challenge, make five pull requests to any public Github hosted repositories.
* Seemly smaller contributions such as fixing typos in documentation are needed just as much as any other type of contribution so do not be afraid to look at Github through a contributer's eyes.

# What is Hacktoberfest

As is stated on The Changelog, "#Hacktoberfest is a once per year event in the month of October celebrating open source." Hacktoberfest has been around for five years and has grown exponentially every year. Last year, 30,000 shirts were given out while this year, 50,000 shirts are given to the first 50,000 contributors. Think of #Hacktoberfest like No Shave November except for the fact that instead of not shaving for an entire month, you're making contributions on [Github](https://Github.com). Essentially, they're similar in that they are both challenges that seek to take you out of your comfort zone. Hacktoberfest is a challenge to make five pull requests to any public repository on Github. Pull Requests occur when you make a change to a project on Github. You can follow the following steps to create a pull request.

1. Find a repository on [Github](https://github.com) with a project that you'd like to make a contribution to.

2. Fork the repository.

Forking a repository is done by clicking the fork button on the repository's main page. Forking will create a copy of the repository on your profile on Github so that you can hack around with the code.

![Forking a git repo](../../assets/images/20190905_hacktoberfest/fork.PNG)

3. Download [Git Bash](https://git-scm.com/downloads) and use it to clone a copy of the repository to your local machine.

```bash
git clone https://github.com/username/repository
```

*username is to be filled in with your username and repository is to be filled in with the repository you forked*

4. Create a new code branch

```bash
git checkout -b new-branch
```

*new-branch is to be filled with the name that you'd like to give your new branch. Project Maintainers often see this so they recommend something descriptive like bjellesma-typo-fix*

5. Make your contribution.

6. Add and commit this contribution to your new branch.

```bash
git add .
git commit -m "<my commit>"
```

7. Push your new branch to origin, the remote for the master branch for your github repository, so it will show on your Github profile.

```bash
git push origin new branch
```

8. One caveat that I don't find mentioned very often is that, when it prompts for your username and password and you have two factor authentication, you will need to generate a personal access token and use that as your password

On your github profile, navigate to Settings -> Developer Settings -> Personal access tokens and generate a new token

![Personal Access Tokens](../../assets/images/20190905_hacktoberfest/tokens.PNG)

Make sure to give this token permission to access your repository by selecting repo under scope

![repo scope](../../assets/images/20190905_hacktoberfest/scope.PNG)

9. Go back to the maintainer's repository and open a pull request.

Github will automatically detect that your forked repository has commits that are ahead of the maintainer's repository. A big green button should now appear at the top that says "Pull Request"

![Pull Request](../../assets/images/20190905_hacktoberfest/pull-request.PNG)

# What is a Contribution

A lot of the reason I never thought of actually helping out was that making a contribution always sounded like such a daunting task. In many ways, it is a daunting task and rightfully so. They're asking you to learn this code so well that you're able to start developing new features. But that's just one method of contribution. If you think of the project in a broader scope, you need people to test software, report bugs, update docs, update the UI, refactor code, lint code, fix bugs, etc. Usually, maintainers and collaborators, who have an overall roadmap of the software, are the ones who will add new features. But software has these other tasks that are equally as important. Yes, contributions can be as technical as adding new features into the code but there are several other tasks, both technical and non technical that are equally as important to the overall success of the project.

One task in particular, updating documentation, may seem trivial but is crucial to helping people understand the project. There is a readme file which is the main documentation showing people how to use the software, a contributing file to tell people who are contributing the rules such as overall naming conventions and specific rules for making pull requests, a licensing file to dictate any legality and copyright associate with the software (It is always import to emphasize that open source code is not necessarily free code), and more.

# What Should my Contributions Be?

During hacktoberfest, any public repositories on Github (including your own) that you make pull requests to are counted. This is designed to get beginners (like myself) familiar with how open source works and excited about the possibilities. Maintainers will setup several repositories that are designed to be easy ways to make pull requests such as add your name to a contribution file or write a simple script. While these easy pull requests count, you are encouraged to venture outside of your comfort zone. Repositories will always have an issues tab where people can report bugs or potential enhancements. You can respond to one of those issues and make a pull request for a potential fix. While fixing issues counts no differently toward #hacktoberfest than adding your name to a list of contributors, it is a more meaningful, rewarding contribution and dictates the meaning of hacktoberfest: start with easy contributions and move onto more meaningful contributions.

# Great Repositories to start with

* https://github.com/ambujraj/hacktoberfest2018
* https://github.com/Cutwell/Hacktoberfest-Census
* https://github.com/lingonsaft/hacktoberfest
