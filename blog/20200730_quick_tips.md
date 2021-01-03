---
title: 'Quick Tips'
date: '2020-07-30 20:45:00'
updateTime: '2020-08-19 20:45:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20200730_quick_tips.jpg'
tagline: 'Some little coding tips that have helped me in the past'
unpublished: False
tags:
- Markdown
- VSCode
---

Do you ever feel like you have something to say on the subject of coding and it will take more than 280 characters? How about the fact that you have some neat code to share but it'll lose all of that fancy syntax highlight when it's posted to Twitter? How about the fact that you use Twitter as a place to store small notes on coding to refer back but it'll get lost underneath all of those tweets to Elon Musk on the new Starship Design (I still think that we need to give artificial gravity another look)? Well, I've run into all of these problems as well which is why I've chosen to make a blog post with all of my "quick tips" that I've found while coding.

## Use VSCode to create git commit templates

You can add to your process to use visual studio code to create commits and even have those commits follow a template. Just the following commands:

1. `git config --global core.editor "code --wait" ` will set the editor used by git to vscode and use --wait to wait for the user to save and close the commit message
2. `git config --global commit.template ~/.gitmessage` will setup the template listed in `~/.gitmessage` to be used when `git commit` is called

**Note** Using `git commit -m` will still bypass this method.

I find this process to be great for conforming to a git style guide.

## Replace bold text with headings in markdown

VSCode's find and replace functionality is great because you can click the `.*` button with find and replace to enable regular expressions.

![Regex Button](../../assets/images/20200730_regex_button.png)

 An awesome use case that I've found with this is to create headings rather than bold text. In order to do this, you need to know a few concepts.
1. In the replace box and while use regular expressions, you can create variables that correspond to each expression in each set of brackets in the find box. For example. we'll be using the regex `(\*\*)(.*)(\*\*)` to find the bold text (we're assuming that the bold text is made use asterisks as in `**bold text**`). The `(\*\*)` (the `**` in markdown) can be referenced in the replace box as `$1` while `(.*)` (the literal word `bold text` in markdown) can be referenced in the replace box as `$2`. This pattern continues for as many pairs of brackets that you in your regex.
2. You can use escape sequences in the replace box. For our example, we'll be using `\n` to indicate a new line

Without further ado, my sample markdown in defined as follows:

```md
**Heading** - This is a definition of my heading

**Heading 2** - This is another definition of my heading

**Note** This is just a note about the heading
```

We want to change Heading and Heading 2 from bold text with a hyphen (for definition) to become level 2 headers with a blank line after before starting the text. However, we want to keep `**Note**` because it's a note that we want to point out to our readers. We'll use the regex `(\*\*)(.*)(\*\*)(\s-\s)` in the find box and `## $2\n\n` in the replace box.

![Bold replace regex](../../assets/images/bold_replace_regex.png)

![Bold replace regex results](../../assets/images/bold_replace_regex_results.png)