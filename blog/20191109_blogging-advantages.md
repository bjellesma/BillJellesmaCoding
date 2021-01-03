---
title: 'Advantages of Tech Blogging'
date: '2019-11-09 23:19:00'
updateTime: '2019-11-09 23:19:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20191109_blogging_advantages.png'
tagline: 'A tech blog is to an IT person as a diary is to a 14 year old girl on Disney Channel.'
tags:
- blogging
- gatsby
---

Remember blogging? You know, the thing that Barney Stinson did that everyone made fun of him for. Well, it's certainly made an impression on the tech community. Almost without fail, whenever I look up a topic about some modern JavaScript framework or obscure python command, I'll come across a blog post that someone else has written almost as much as I see comments on StackOverflow. Blogging is a great idea if you can devote a couple hours here and there. Here are a couple things that I've kept in mind when reading and writing blog posts:

# TLDR;

* You learn more background to a topic
* Pay it forward
* Journal and document your own journey
* Blog posts don't need to be a giant daunting article
* Networking and Opportunities 
* Hosting a blog teaches you too

## You learn more background to a topic

Have you ever googled a question, excitedly found that StackOverflow had an answer, and then found out that the answer was just a guy posting code saying "Use this"? Reading a blog post allows you to go more in depth on a topic than simply getting an answer. When I was figuring out ES6 for Javascript, I read blog posts of people's favorite and, in their opinions, most used ES6 features. Seeing the top 5 ES6 features on a blog with examples helped me to start incorporating that into my code rather than googling ES6 features for every line of my code. Bonus, I found out that Internet Explorer 11 doesn't support the new ES6 features, so I need to use a transpiler like [Babel](https://babeljs.io/).

A nice benefit specifically of writing posts is that you're forced to think through the topic in your head. A quote often attributed to Albert Einstein is "If you can't explain it simply, then you don't understand it". It's great to have this knowledge in your head, but if you can't properly communicate it, even to yourself, then what good is it? It's fleeting knowledge that you won't remember in a week when you need to do it again. You'd better hope that you've commented your code well.

## Pay it forward

As software engineers, we're often tasked with doing similar tasks as other software engineers (see the image carousel on this website? I want that on our website), such as figuring out how to convert datetime values between timezones (the bane of human existence). Wouldn't it be nice if, when you google `Python convert datetime to timezone`, you find a blog post of someone who's already done that in the specific framework that you're using? By following this post and figuring out how to apply this method to your codebase, you've just saved yourself hours of headache. It still took some work to implement this new feature into your codebase because you see that they were using a different python module. Well, maybe there's another software engineer out there using the same module and framework as you. You have the opportunity to pay it forward and help others by making a new blog post to add on to what the original had.

## Journal and document your own journey

Sometimes, if I'm trying to remember a specific git command or how to setup a virtual environment, I'll look back at my own blog. It becomes my own documentation. A habit that I've developed is to store my virtual environments in one folder and then have a bash script in my project folder that I can use to turn on and off that virtual environment. What happens if I'm not working on a new project for a month or so and then go to make a new project? I might forget and store the virtual environment in my project folder. Now my commands to activate this virtual environment aren't going to line up with commands in other projects. This is an inconsistency that, will not only irritate me but, will cause me to spend needless time to figure out what I did. It'd be really nice if, the moment that I forgot how to setup my virtual environment, I could just look back on an old blog post that I wrote on how to do this.

## Blog posts don't need to be a giant daunting article

Unless you're getting paid to write a tech article for [Medium](https://medium.com/topic/technology) or [Ars Technica](https://arstechnica.com/), there are no length requirements. You're not writing a senior paper for your high school. In fact, the shorter and less fluff, the better written the article is. If you start writing a post with your whole backstory (at first I was afraid, I was petrified) which is interesting to no one but you, your audience will be annoyed and likely not read the actual point of the article. It's common to spend a couple hours of the day just trying to find the perfect set of commands for your project, a perfect post would be a couple sentences and an example of those commands that you've found. There's no reason to write six pages on using the spread operator in JavaScript.

Here is an [example](https://www.saltycrane.com/blog/2008/06/how-to-get-current-date-and-time-in/) of a short article. This person wrote one sentence, gave an example, and gave a useful table of datetime directives. As a bonus, the code is formatted as a codeblock and not text so it is easy to read. If I'm working on a project trying to parse a datetime, I would find this very useful.

## Networking and Opportunities 

Having a tech blog is something easy to reference when talking to people and people may even find your articles just by Google rankings (that's the dream). When doing some light research, I was surprised to find out that some people have actually been asked to talk at conferences and meetups and some have even been lead to job opportunities. Even if you don't receive these lucrative opportunities, it's still a great link to give people along with your Linkedin and Twitter. People will clearly be able to see your passion as you wrote on a topic that you're passionate about. 

## Hosting a blog teaches you too

Hosting my own blog has taught me several modern and powerful tools. Essentially, this blog itself is a side project to learn Gatsby, React, Netlify, GraphQL, etc. I've hosted a few blogs over the years to have an online presence and have gone through a few providers. I used to use a self hosted [Wordpress](https://wordpress.org/) as my CMS. Since I self hosted it, it was a pain to maintain and I couldn't really justify the money for GoDaddy hosting and a domain. I've tried normal [Wordpress](https://wordpress.com/) hosting which meant that they hosted my blog. That meant they had control to insert advertisements while not allowing me to install plugins or edit the PHP files as the tinkerer in me wanted to do. I finally settled on using [GatsbyJS](https://www.gatsbyjs.org/) hosted on [Netlify](https://www.netlify.com/). I found this to be a great choice as it was free but still allowed me to play with my frontend code. Plus, Gatsby allows me to create my blog posts from Markdown directly. As I write this article, I'm using Markdown which I already enjoy using.

There are plenty of other hosting options. Some are technical and take some time to set up. Some are quick and low maintenance.

### Quick

* Squarespace
* Tumblr

### Technical

* [NextJS](https://nextjs.org/)
* [Jekyll](https://jekyllrb.com/)

# Conclusion

In my opinion, maintaining a tech blog is a very worthwhile endevour. Though I do need to devote some of my time to write articles and maintain the blog, the benefits outweigh these potential drawbacks and inconveniences.

# References

* [https://firstsiteguide.com/benefits-of-blogging/](https://firstsiteguide.com/benefits-of-blogging/)
* [https://www.saltycrane.com/blog/2008/06/how-to-get-current-date-and-time-in/](https://www.saltycrane.com/blog/2008/06/how-to-get-current-date-and-time-in/)
* [https://www.freecodecamp.org/news/developers-the-why-and-how-to-writing-technical-articles-54e824789ef6/](https://www.freecodecamp.org/news/developers-the-why-and-how-to-writing-technical-articles-54e824789ef6/)
* [https://dev.to/57uff3r/have-you-got-any-benefits-from-writing-tech-articles-or-having-a-tech-blog-128](https://dev.to/57uff3r/have-you-got-any-benefits-from-writing-tech-articles-or-having-a-tech-blog-128)