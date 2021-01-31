---
title: 'Using Math in Markdown'
date: '2020-08-14 20:45:00'
updateTime: '2021-01-30 20:45:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20200814_math_in_markdown.jpg'
tagline: 'Did I ever tell you that I was a math major?'
unpublished: False
tags:
- Math
- Markdown
---

## Updates

* 20210130 - I'm on the hunt currently for a katex plugin for Scully, so all rendered equations are images.

## TL;DR

* [CodeCogs](https://www.codecogs.com/latex/eqneditor.php) is a great website to learn to quickly write LaTeX.
* You can write LaTeX in markdown within visual studio code through [a plugin](https://marketplace.visualstudio.com/items?itemName=goessner.mdmath)
* You can even render [LaTeX on your Gatsby Blog](https://www.gatsbyjs.com/plugins/gatsby-remark-katex/)
* I was a math major

Those of you that know me know that I enjoy solving partial derivatives as much as anyone. I was a dual major in math and computer science while I was in college. This allowed me to bore people with both the bubble sort algorithm as well as the trig substitution method for solving integrals. Alas, when I started working building software with my computer science background, my math background became merely a source of whimsical entertainment for Saturday afternoons. So, when I learned that I could use those fun math equations in markdown documents, I was elated!

## LaTeX (Not the glove)

Have you ever been in a position where you're looking to translate the square root of five into mathematical language on the computer? Sure, you can write "the square root of 5" and people would understand what you're talking about but what about if you're writing out the quadratic formula, x = -b plus or minus the square root of b squared minus 4 * ac all over 2a? What if something is lost in translation and someone puts only the square root as the numerator of the fraction. Here's when I learned about LaTeX. LaTeX is like another coding language but it's syntax is designed to translate your syntax into mathematical formulas.

Here is the LaTeX syntax for the quadratic formula:

```latex
\text{x} = \frac{-b\pm \sqrt{b^2-4ac}}{2a}
```

And it will display as

![Katex Equation](../../assets/images/math/20200813-1.png)

* `\text{}` will translate anything inside of the curly brackets as plain text
* `\frac{}{}` will translate the first set of curly braces as the numerator and the second set as the denominator
* `sqrt{}` will translate anything side the curly braces as what's under the square root sign
* `^2` will translate into an exponent. You can enter another number such as `^3` for cubed. 
    * If you are using a multi-digit number as the exponent, you'll need to put curly braces around that such as `^{22}

An awesome online tool to visualize and learn the LaTeX syntax is [codecogs.com](https://www.codecogs.com/latex/eqneditor.php). With this website, you can click the buttons with the picture of the math symbol that you're after and the syntax will appear below as well as the math symbol. Who doesn't like visual learning!

![LaTeX Editor](../../assets/images/20200814_math_latex_editor.png)

![LaTeX Editor](../../assets/images/20200814_math_latex_editor2.png)

Codecogs.com is a great tool but it is only the begining of the math in markdown lesson. Back in my naive days, I would just take screenshots of the math equations that I generate.

## Math in markdown

The meat and potatoes of the journey, math in markdown is the next step of this journey. [Markdown+Math](https://marketplace.visualstudio.com/items?itemName=goessner.mdmath) is a visual studio code plugin that will translate any LaTeX code in markdown into the corresponding mathematical symbols. If you use visual studio code's built in preview function to preview your markdown document, you'll see your LaTeX syntax translated into symbols.

![Math in VSCode](../../assets/images/20200814_math_in_vscode.png)

Notice that you need to surround the LaTeX syntax with dollar signs. This lets the interpreter know that you're using LaTeX. Previewing this is cool but it'd also be nice to save the file with all of these symbols. This plugin also has a setting that you'll be able to use to save your markdown document as an html file to be rendered in any browser. By default, this HTML file uses the same title and is saved in the same directory as the original markdown document.

![Math Setting](../../assets/images/20200814_math_vscode_setting.png)

With an HTML document, you can use other tools such as Adobe Acrobat to covert your HTML document to a PDF. You can use this tool to create those professional looking documents you see executives and stuffy professors carrying around.

![Stuffy Professors](../../assets/images/stuffy_professors.jpg)

However, much like a meal where dessert comes after the meat and potatoes, we're not on the last part of this math in markdown journey.

## Markdown in Gatsby

Those of you that have ready my previous posts will know the platform that I blog on is [Gatsby JS](https://www.gatsbyjs.com/). The main reason that convinced me to start a blog using Gatsby is that I'm able to write my blog posts using Markdown. Other platforms such as [Jekyll](https://jekyllrb.com/) will also allow you to create blog posts in Markdown but I chose Gatsby because it came to be popular at a time when I was getting into the React game. Needless to say, if I was able to find a math plugin to use on my Gatsby site, that would just be the icing on the cake. 

Gatsby does have such a plugin called [gatsby-remark-katex](https://www.gatsbyjs.com/plugins/gatsby-remark-katex/). KaTeX (as you might have guessed by the name) is related to LaTeX in that it uses most of the same language while not using the full LaTeX infrastructure so that it can be rendered on the web. I'm using this plugin right now on my blog to render some math such as the quadratic formula from earlier.

![Katex Equation](../../assets/images/math/20200813-2.png)

Setting up this plugin on a Gatsby blog is relatively simple

1. From the command line, type the following

```bash
npm install --save gatsby-transformer-remark gatsby-remark-katex
```

2. In your `gatsby-config.js` file, find the entry for `gatsby-transformer-remark` or create it if it doesn't exist and modify it to look like the following code:

```js
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `gatsby-remark-katex`,
          options: {
            // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
            strict: `ignore`
          }
        }
      ],
    },
  },
],
```

This is the part that screwed me up for a little bit. I didn't realize that `gatsby-transformer-remark` was already defined in my file so I created a new entry which was ignored at compile time. 

**Note** You will also need to restart the development server at this time.

3. In the js that you are using to render blog posts, you must import a css file like so

```js
import "katex/dist/katex.min.css"
```

This templates file usually looks similar to the following and be contained in a path called `gatsby/examples/using-remark/src/templates/template-blog-post.js`

```js
import React from "react"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"
import rehypeReact from "rehype-react"

import styles from "../styles"
import Counter from "../components/Counter"
import Layout from "../layouts"
import { rhythm, scale } from "../utils/typography"

import "katex/dist/katex.min.css"

const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: { "interactive-counter": Counter },
}).Compiler

class BlogPostRoute extends React.Component {
  render() {
    const post = this.props.data.markdownRemark

    let tags
    let tagsSection
    if (post.fields.tagSlugs) {
      const tagsArray = post.fields.tagSlugs
      tags = tagsArray.map((tag, i) => {
        const divider = i < tagsArray.length - 1 && <span>{`, `}</span>
        return (
          <span key={tag}>
            <Link to={tag}>{post.frontmatter.tags[i]}</Link>
            {divider}10130
      tagsSection = (
        <span
          css={{
            fontStyle: `normal`,
            textAlign: `left`,
          }}
        >
          tagged {tags}
        </span>
      )
    }

    return (
      <Layout location={this.props.location}>
        <div
          css={{
            maxWidth: rhythm(26),
          }}
        >
          <header>
            <h1
              css={{
                marginBottom: rhythm(1 / 6),
                color: post.frontmatter.shadow,
              }}
            >
              {post.frontmatter.title}
            </h1>
            <p
              css={{
                ...scale(-1 / 5),
                display: `block`,
                color: `${styles.colors.light}`,
              }}
            >
              {post.timeToRead} min read &middot; {tagsSection}
            </p>
          </header>

          <h2>Contents</h2>
          <div
            dangerouslySetInnerHTML={{ __html: post.tableOfContents }}
            className="toc"
          />

          {renderAst(post.htmlAst)}
          <hr
            css={{
              marginBottom: rhythm(1),
              marginTop: rhythm(2),
            }}
          />
          <p
            css={{
              marginBottom: rhythm(4 / 4),
              display: `flex`,
              alignItems: `center`,
            }}
          >
            <Img
              alt={`Avatar of ${post.frontmatter.author.id}`}
              fixed={post.frontmatter.author.avatar.children[0].fixed}
              css={{
                borderRadius: `100%`,
                float: `left`,
                marginRight: rhythm(3 / 4),
                marginBottom: 0,
              }}
              Tag="span"
            />
            <span
              css={{
                color: styles.colors.light,
                ...scale(-1 / 5),
              }}
            >00813
                  fontWeight: `bold`,
                  color: styles.colors.text,
                  textTransform: `uppercase`,
                }}
              >
                {post.frontmatter.author.id}
              </small>
              {` `}
              {post.frontmatter.author.bio}
            </span>
          </p>
        </div>
      </Layout>
    )
  }
}

export default BlogPostRoute

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
      timeToRead
      tableOfContents
      fields {
        tagSlugs
      }
      frontmatter {
        title
        tags
        date(formatString: "MMMM DD, YYYY")
        author {
          id
          bio
          avatar {
            children {
              ... on ImageSharp {
                fixed(width: 50, height: 50, quality: 75, grayscale: true) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }00813
        }
      }
    }
  }
`
```

4. Now you're ready to render those pretty math equations. As in the vscode plugin, you'll need use either one dollar sign or two dollar signs to render the math symbols

```
$$
\text{x} = \frac{-b\pm \sqrt{b^2-4ac}}{2a}
$$
```