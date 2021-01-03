---
title: 'Emmet abbreviations for Visual Studio Code'
date: '2020-01-29 00:15:00'
updateTime: '2020-01-29 00:15:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20200129_emmet.jpg'
tagline: 'Emmet Brown says get all the Emmet abbreviations'
tags:
- Emmet
- VSCode
---

Visual Studio Code (VSCode) is an amazing lightweight text editor with tons of built in support like GIT versioning and an online marketplace to get even more packages to make life easier. One incredible feature that Visual Studio code ships with out of the box is [Emmet](https://code.visualstudio.com/docs/editor/emmet). Emmet might be one of the best tools for coding efficiency. The idea of Emmet is simple, you just type in a short keystroke, keyword, or keyphrase, and emmet will offer to translate that to some commonly snippet for the tech stack that you're working in!

Unfortunately, by the very nature of entering in arbitrary commands, I find myself forgetting these commands fairly frequently. I've attempted to start a cheat sheet similar to [GIT cheat sheet](https://billjellesmacoding.netlify.com/git-cheat-sheet) so that I, and anyone else that may find this of use, can refer to this.

### HTML5 DocType

**Keystroke** - !

This translates to

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
```

No configuration is needed for this handy snippet. Just type ! in your editor and let the magic unfold. A [Doctype Declaration](https://www.w3schools.com/tags/tag_doctype.asp) is so important to tell the browser how to render the page and yet I'd always forget it when writing HTML manually. Besides this, this keystroke does save time in having to use the standard html, body, and head tags. Plus, the easy to forget meta tags are included.

![HTML5 Doctype](../../assets/images/20200106_emmet_html_doctype.gif)

### React Functional Component

**Keyword** - rcf

This translates to

```js
import React from 'react';
import PropTypes from 'prop-types';

const ComponentName = () => {
    return (
        <div></div>
    );
};

ComponentName.propTypes = {};

export default ComponentName;

```

**Special Note** - Your text editor needs to focus on a js file for this to work.

A little configuration is needed for this one but it's a must have if you're working with React (ehem [Gatsby](https://www.gatsbyjs.org/))

1. Add the following line of code to `settings.json` under emmet.include languages.

```json
"emmet.includeLanguages": { "javascript": "javascriptreact", },
```

To get here, go to File -> Preferences -> Settings and search for emmet.includelanguages.

![Settings.json](../../assets/images/20200106_emmet_settings_json.png)

2. Insert the above line of code so that your file looks like this:

```json
{
  ...
  "workbench.colorTheme": "Solarized Dark",
  "emmet.includeLanguages": { "javascript": "javascriptreact", },
  "javascript.implicitProjectConfig.checkJs": true,
  ...
}
```

You can now type `rcf` to quickly create a react component

![React functional component](../../assets/images/20200106_emmet_rcf.gif)

### HTML Expansion

This feature is also available out of the box and gives an example of the power of Emmet. This isn't a keystroke or keyphrase but combines several symbols to quickly make some HTML. You can use any combination of the following example according to the [official emmet docs](https://docs.emmet.io/cheat-sheet/):

```
div.article1>h1.header+div.body>(li.item{heading $})*5
```

This translates to

```html
<div class="article1">
    <h1 class="header"></h1>
    <div class="body">
        <li class="item">heading 1</li>
        <li class="item">heading 2</li>
        <li class="item">heading 3</li>
        <li class="item">heading 4</li>
        <li class="item">heading 5</li>
    </div>
</div>
```

![HTML Expansion](../../assets/images/20200129_emmet_html_expansion.gif)

A couple things of note:

1. `>` is a child operator so we can use this to specify inner tags. For example, we have the article div as a parent tag and both the h1 and div as children.

2. `.` specifies a class. In the above example, the parent div has a class of article1, the h1 has a class of header, the inner div has a class of body, and all of the list tags have a class of item.

3. `*5` specifies multiplication. In the above example, we are saying that we want 5 list tags with a class of item

4. `()` specifies a grouping. In the above example, this is necessary to say that the list tags along with class and text are done 5 times.

5. `{}` specifies text. In the above example, we are saying that our list tags should have text of heading $ (the $ is explained in a moment).

6. `$` can be thought of as a numbering variable when used with multiplication. In the above example, this is how the text is converted to heading 1, heading 2, etc.

### Wrap with abbreviation

This is an awesome feature that I found out recently on [Scotch.io](https://scotch.io/bar-talk/8-emmet-tips-you-might-not-know#toc-html-tags-expansions). With Wrap with abbreviation, you can highlight text in your editor, open the command palette (ctrl+shift+p for Windows/linux), and type in an html expansion to wrap the text. The second I saw this feature, I knew that I would want to add it to my repitore because I usually have to find the right opening and closing tags to insert the text which can be a huge pain in a large file.

![Wrap with abbreviation](../../assets/images/20200129_emmet_wrap_with_abbreviation.gif)

### Form input

Again, this is available out of the box. This is useful for easily and quickly creating form elements. For example, take a look at the following code:

```
input:text
```

This translates to

```html
<input type="text" name="" id="">
```

![Form Input](../../assets/images/20200129_emmet_form_input.gif)

The example above has a little bit of a smaller effect than some of the other snippets but it's still a snippet that I find myself using often enough. It shouldn't come as much of a surprise that you can use other inputs such as `input:button` or `input:checkbox`

## Further Reading

* [DesignCourse Youtube video](https://www.youtube.com/watch?v=uCNgWcKrFfQ)
* [TraversyMedia Youtube video](https://www.youtube.com/watch?v=5BIAdWNcr8Y)
* [Official Emmet Docs](https://docs.emmet.io/cheat-sheet/)
* [Scotch.io Emmet Tips](https://scotch.io/bar-talk/8-emmet-tips-you-might-not-know)