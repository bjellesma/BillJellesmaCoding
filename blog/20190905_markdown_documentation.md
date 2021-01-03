---
title: 'Using Markdown for Documentation'
date: '2018-09-15 23:00:00'
updateTime: '2018-09-15 23:00:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/markdown.jpg'
tagline: 'Markdown is an excellent documentation tool that`s great for developers!'
tags:
- Markdown
---
# Using Markdown for Documentation

While learning web development, one important skill I've picked up is using markdown. I started out finding markdown as just being "One more new technology to learn and remember" but I've come to use it for almost all of my documentation, be it for work, personal notetaking, or posting my thoughts on the latest cat meme. I'm even using markdown to help me write this blog post!

# TL;DR (Too Long; Didn't Read)

* Simple and easily readable language for formatting text
* Used for readme files, comments, discussion forums, etc.
* I love using markdown with Atom text editor because they provide a native way to see the format that you will generate
 * Atom also lets you save as HTML so that you can use it for a web page
* It's especially useful as a developer because I can insert code blocks into my documentation

# What is Markdown?

Simply put, markdown is a simple formatting language designed to easily be converted to HTML. It is also designed in such a way that even looking at the source code will enable you to understand the format, tone, and general flow of the document. Since most text editors have a markdown plugin either built baked directly into them or available as an easily downloadable plugin, you can writemarkdown in a similar fasion to writing plain HTML. Some plugins even allow you to view what markdown source will look like in a rendered document for uses such as readme files, web pages, and it can even be used to format comments on popular websites such as [Github](https://github.com)! For example, in [Atom](https://atom.io/) text editor, you can use <kbd>CTRL</kbd>+<kbd>SHIFT</kbd>+<kbd>M</kbd> (for windows) to view the rendered markdown. Using this rendered markdown document, you are also given the option to right click the document and save it as an HTML document. Besides saving the HTML, this will also save all of the styles associated with your documents which is extremely useful if you, like me, are addicted to using syntax highlighting. Unfortunately, Wordpress' free plan doesn't allow me to insert the CSS that I would need to do syntax highlighting. You can then upload the HTML to almost anywhere!

This:

```Markdown
#### I Love Markdown and this is why:

* *Easy to read!*
* Fun
* **I feel like a Rock Star**
```

Renders to:

#### I Love Markdown and this is why:

* *Easy to read!*
* Fun
* **I feel like a Rock Star**

# The Many Faces of Markdown

Throughout this article, we've been using a special variant of Markdown called Github Flavored Markdown (GFM). There are many different "dialects" of Markdown that use [John Gruber's Original Spec](https://daringfireball.net/projects/markdown/) plus a bit of extra "magic" providing additional resources for formatting that that particular community finds useful. These dialects are listed on the [CommonMark Github Project](https://github.com/commonmark/commonmark/wiki/markdown-flavors).

GFM builds on the core markdown spec with tables and syntax highlighting for codeblocks. Although codeblocks are supported in the core spec, syntax highlighting was added by Github through the use of their own [Linguist Project](https://github.com/github/linguist).

# The Origin Story

Markdown has origins dating back to 2004. It was created by Aaron Schwartz (who you might recognize as the late creator of [Reddit](https://www.reddit.com/)) and John Grubber. The goal of the whole project was to make the language readable without it having to be translated into human readable language first. Though it can be argued that HTML serves this purpose, the important parts of HTML may get lost by the human eye in all of the HTML tags.

Consider the HTML version:

```HTML
<h4>I Love Markdown and this is why:</h4>

<ul>
  <li><i>Easy to read!</i></li>
  <li>Fun</li>
  <li><b>I feel like a Rock Star</b></li>
</ul>
```

Compared to the Markdown version:

```Markdown
#### I Love Markdown and this is why:

* *Easy to read!*
* Fun
* **I feel like a Rock Star**
```

Speaking of HTML, markdown is backwards compatible with HTML so you can still use HTML tags for all of your edge cases. For example, markdown doesn't provide a way to render the keyboard keys in the fancy way that I would like but HTML has this capability:

```HTML
<kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>DEL</kbd>
```

The kbd tag can also be customized with addition CSS which GFM provides.

# What does Markdown mean to me?

Back when I was but a fledgling in the codingverse, I can remember taking notes from youtube videos on python and inserting code directly into Microsoft Word documents or Google Docs only to have that platform autoformat my code as if it were a sentence. I would have to explicitly tell Word not to format this as text. I then evolved to writing my code into a text editor and then snipping an image of the screen and inserting that into my documents. Both of these processes were time consuming, tedious, and gave me the feeling that I'm not using the technologies available to me. Enter the mysterious .md files that Github most commonly uses for readme files. I researched what the .md file meant and the rest is history.

 With markdown and syntax highlighting, I can now do:

```Markdown
```Python
print("Hello World!")
```


In addition to this, I often find myself needing to display tabular data such as metrics:

```Markdown
| Day | Breakfast | Lunch | Dinner |
| --- | --- | --- |
| Monday | Oatmeal | Turkey Sandwich | Pasta |
```

Linking to images of a specific menu:

```Markdown
![This is alt text that is used if the image cannot be found](https://via.placeholder.com/350x150 "This is the hover tooltip")
```

Linking to websites with more information:

```Markdown
[Articles](http://slashdot.org)
```

You can find a cheatsheet of all you can do with markdown on [Adam-p's markdown here project on Github](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) (I often refer back to this).

Since browser don't natively recognize markdown (yet), you may think that if you're on another computer without a text editor, you can't do anything. You'd be very wrong! There are several websites available at your fingertips to preview markdown inside a browser. One website that I'll often use is [markdownlivepreview](http://markdownlivepreview.com/).

# References and additional links

* [Wikipedia](https://en.wikipedia.org/wiki/Markdown)
* [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
* [John Gruber's Original Spec](https://daringfireball.net/projects/markdown/)
* [Github Flavored Markdown](https://help.github.com/categories/writing-on-github/)
* [Linguist](https://github.com/github/linguist)
* [Markdown Live Preview](http://markdownlivepreview.com/)
