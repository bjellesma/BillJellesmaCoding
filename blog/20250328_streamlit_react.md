---
title: "Using React in streamlit"
date: "2025-03-28 00:00:00"
updateTime: "2025-03-28 00:00:00"
author: "Bill Jellesma"
authorImage: ../../assets/images/author/author-bjellesma.jpg
image: ../../assets/images/20250328_streamlit_react.png
tagline: "Using Custom Components for interactivity"
published: True
tags:
  - Streamlit
  - React
---

Do you want to bring your front end skills over to streamlit? Well now you can with streamlit custom components library.

Let's create a streamlit that will display the weight vs deadlift of a sample of 1000 athletes. Let's also add some interaction to the app so that the user can click a point on the crossfit scatter plot to see more information about the athlete.

![CrossFit Streamlit App](../../assets/images/20250328_crossfit_streamlit.gif)

The GitHub repo is located [here](https://github.com/bjellesma/crossfit_streamlit/tree/main) if you want to look at the actual code.

# TL;DR

* Start with a basic streamlit app to read a large dataset from Kaggle
* Use `Streamlit Component Lib` to build a component using React and Typescript
* Invoke Bidirectional communication so that our React app can send data back to our streamlit app

## The Deep Dive

The first thing that you'll need to do is to install a few packages that we'll need: `node.js` and `npm` (Often the two go hand in hand). I'm using WSL, so the below is the Linux command but Windows users can also download [NodeJS from here](https://nodejs.org/en/download)

```bash
sudo apt-get install nodejs npm
```

Once we create a new directory to store our streamlit code, we'll get this code under version control.

```bash
mkdir crossfit_streamlit 
cd crossfit_streamlit
git init
```

Let's first start with a simple Streamlit app. I'm using a [CSV that I found on Kaggle](https://www.kaggle.com/datasets/ulrikthygepedersen/crossfit-athletes?resource=download) for crossfit athletes and how they've performed on various benchmark workouts.

We'll start with a simple folder structure.

```text
|--main.py 
|--temp/
|  |--data.csv
|--Pipfile
|--Pipfile.lock
```

Where data.csv is the file that we've downloaded from Kaggle.

**Sidenote**

Before proceeding, notice that I have a `Pipfile` because I like to use `pipenv` as my virtual environment. I've posted about [pipenv before here](https://billjellesmacoding.netlify.app/blog/20191208_virtual_environments), so I'll just show you the code so that you can see the dependencies and the scripts that I'm using. The `Pipfile.lock` file is also generated automatically when installing these dependencies/

```text
[[source]]
url = "https://pypi.org/simple"
verify_ssl = true
name = "pypi"

[packages]
streamlit = "*"
pandas = "*"

[dev-packages]

[requires]
python_version = "3.10"

[scripts]
dev = "streamlit run main.py --server.headless true"
```

Now let's make app.py. For now, we'll just use `st.dataframe` to show the data from that CSV.

```py
import streamlit as st
import pandas as pd

@st.cache_data
def load_data() -> pd.DataFrame:
    return pd.read_csv('temp/data.csv')

df = load_data()
st.dataframe(df)
```

As you can see, the app isn't incredibly interesting yet as we're just displaying the data.

![Basic CrossFit dataframe](../../assets/images/20250326_crossfit_data_baseic.png)

Now let's add in some frontend engineering to spice things up a little.

## Add a pinch of React

Now what we want to do is to add React code to show a scatter plot.

First thing that we'll do is to make a folder structure for our app.

```txt
streamlit_app
|--app.py 
|--temp/
|  |--data.csv
|--.gitignore
|--components/
|  |--crossfit_scatter_plot
|     |--frontend
|       |--build/
|       |--public/
|         |--index.html
|       |--src/ 
|         |--index.tsx
|         |--CrossfitScatterPlot.tsx
|       |--.env
|       |--.prettierrc
|       |--tsconfig.json
```

You'll notice that we've added a `.gitignore` file in here as well so let's go ahead and add to that file. We'll just add one line in there for now.

```txt
node_modules
```

This is because we plan to add a node_modules folder.

## NPM

Now let's create a `package.json` in order to install frontend dependencies.

```bash
cd components/crossfit_scatter_plot/frontend
npm init
```

`npm init` is just an easy way to create the needed `package.json`. You'll be presented with a series of questions to get started with the file.

```bash
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (frontend) crossfit_scatter_plot
version: (1.0.0) 
description: An interactive component for visualizing crossfit data
entry point: (index.js) src/index.tsx
test command: 
git repository: 
keywords: 
author: Bill Jellesma
license: (ISC) 
About to write to streamlit_app/components/crossfit_scatter_plot/frontend/package.json:

{
  "name": "crossfit_scatter_plot",
  "version": "1.0.0",
  "description": "An interactive component for visualizing crossfit data",
  "main": "src/index.tsx",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Bill Jellesma",
  "license": "ISC"
}


Is this OK? (yes) yes
```

Notice that a `package.json` will be created in your frontend directory. Hold tight! There are a couple of things to update this file with.

```json
"dependencies": {
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-plotly.js": "^2.5.1",
    "streamlit-component-lib": "^2.0.0"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "homepage": ".",
  "devDependencies": {
    "@types/node": "^12.0.0",
    "@types/react": "^16.9.0",
    "@types/react-dom": "^16.9.0",
    "@types/react-plotly.js": "^2.5.0",
    "react-scripts": "^5.0.1",
    "typescript": "^4.2.0"
  },
```

So `streamlit_component_lib` is one of the dependencies and this is at the heart of our application that will help serve the frontend react app that we're creating.

You'll also want to update the scripts section. These scripts will provide the npm commands that we'll use to develop the component

```json
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
```

Your `package.json` should now look like this

```json
{
  "name": "crossfit_scatter_plot",
  "version": "1.0.0",
  "description": "An interactive component for visualizing crossfit data",
  "dependencies": {
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-plotly.js": "^2.5.1",
    "streamlit-component-lib": "^2.0.0"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "homepage": ".",
  "devDependencies": {
    "@types/node": "^12.0.0",
    "@types/react": "^16.9.0",
    "@types/react-dom": "^16.9.0",
    "@types/react-plotly.js": "^2.5.0",
    "react-scripts": "^5.0.1",
    "typescript": "^4.2.0"
  },
  "main": "src/index.tsx",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "author": "Bill Jellesma",
  "license": "ISC"
}

```

You can now use the following command to install all of our frontend dependencies.

```bash
npm i
```

This installation may take a couple of minutes but notice that this will create a `node_modules` folder which is quite large. This is why we added this to the `.gitignore`.

## Files

Now we'll start adding files to fill in the folder structure that we provided earlier.

**frontend/public/index.html**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Streamlit Component</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Streamlit Component" />
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
  </body>
</html>
```

For those familiar with frontend design, this is the base file that you'll need. It simply provides a root id which we'll connect to with our typescript.

**crossfit_scatter_plot/frontend/.env**

```bash
# Run the component's dev server on :3001
PORT=3001
# Don't automatically open the web browser on `npm run start`.
BROWSER=none
```

This is an extremely short file. What it'll be used for is that, when we run the dev server for our component, it'll instruct it to run on port 3001. The port number can be whatever but oftentimes streamlit is running on 3000 and when this file isn't specified, the component will try to run on 3000. The browser command is useful just because there's no point in opening the browser for the component dev server, you won't see anything.

**crossfit_scatter_plot/frontend/.prettierrc**

```json
{
  "endOfLine": "lf",
  "semi": false,
  "trailingComma": "es5"
}
```

While not strictly necessary, this file is nice to have for developers working in vscode. VS Code automatically uses prettier to format files on save. This just adds a couple of additional commands.

**crossfit_scatter_plot/frontend/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react"
  },
  "include": ["src"]
}
```

Unlike other files, the tsconfig is very important to have. The most important setting in here is the include command. This command will process any files in our `src/` directory ensuring that typescript is enforced whenever saving files.

**crossfit_scatter_plot/frontend/src/index.tsx**
```tsx
import React from "react"
import ReactDOM from "react-dom"
import CrossfitScatterPlot from "./CrossfitScatterPlot"

ReactDOM.render(
  <React.StrictMode>
    <CrossfitScatterPlot />
  </React.StrictMode>,
  document.getElementById("root")
)
```

This file is the entry point for our React application. Notice that we're referencing the root ID. ReactDOM is instructed to bind its React tag to bind to an ID of root.

Add the following to app.py

Now, we'll create the custom component 

**crossfit_scatter_plot/frontend/CrossfitScatterPlot.tsx**
```tsx
import {Streamlit, withStreamlitConnection,} from "streamlit-component-lib"
import React, { useEffect } from "react"
import Plot from "react-plotly.js"
import { Data, Layout } from "plotly.js";

// interface to enforce args
interface Props {
  args: {
    data: Data[];
    layout: Layout;
  };
}

/**
 * Crossfit scatter plot of weight vs deadlift
 */
const CrossfitScatterPlot: React.FC<Props> = ({args}) => {
  // Set the component height
  useEffect(() => {
    Streamlit.setFrameHeight(500)
  }, [])

  const handleClick = (clickData: any) => {
    if (clickData.points && clickData.points.length > 0) {
      const point = clickData.points[0];
      const athleteName = point.text || `Athlete at index ${point.pointIndex}`;     
      Streamlit.setComponentValue({
        series: point.curveNumber,
        pointIndex: point.pointIndex,
        x: point.x,
        y: point.y,
        athleteName: athleteName
      })
    }
  }
  
  return (
    <div style={{ width: '100%' }}>
      {args.data && args.layout ? (
        <Plot
          data={args.data}
          layout={args.layout}
          style={{ width: '100%', height: '450px' }}
          onClick={handleClick}
          config={{ responsive: true }}
        />
      ) : (
        <div style={{
          width: '100%', 
          height: '450px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px'
        }}>
          <p>Waiting for data...</p>
        </div>
      )}
    </div>
  );
};

export default withStreamlitConnection(CrossfitScatterPlot);
```

For users coming from the python world, this React code may seem a little confusing but let's break it down.

Before we break it down, I do just want to point out that this is technically typescript code and not pure JavaScript. Think of typescript as just a layer of top of JavaScript; it's often referred to as a superset as it uses a lightweight compiler to compile down to pure JavaScript. The advantage of using typescript is that it adds type safety that JavaScript alone doesn't support. This means that if you specify a function as taking in a number, but you have another function that passes a string, the compiler will yell at you and not allow you to compile the JavaScript and therefore not allow you to ship your code to production without fixing this inconsistency. 

First we'll import the libraries. We'll import the streamlit custom lib code. We also want `useEffect` from React. This is used here so that we can immediately run code when the component mounts.
Plotly maintains a custom `<Plot>` element that we can use. The reason that we're adding the import for `Data` and `Layout` from `plotly.js` is because we'll use these types in a typescript interface to enforce that we get the proper types from python.

```tsx
import {Streamlit, withStreamlitConnection,} from "streamlit-component-lib"
import React, { useEffect } from "react"
import Plot from "react-plotly.js"
import { Data, Layout } from "plotly.js";
```

The next code that starts with the keyword `interface` is the typescript interface that we were discussing above to enforce that we get the expected data from python.

```tsx
// interface to enforce args
interface Props {
  args: {
    data: Data[];
    layout: Layout;
  };
}
```

This next line is how we declare a React Component. Notice that this uses the props interface that we created. `args` is defined to be the object that we've passed in from python. I say object because each argument that we've passed from python will be a property on that object. So `args.data` will be the data dictionary that we've passed from python to our component.

```tsx
const CrossfitScatterPlot: React.FC<Props> = ({args}) => {
  // code in here
};
```

Within the code block, we first find `useEffect`. This is a React feature that is used to detect when certain events occur such as a user performing an action so that our application can run code in response. In this case, the empty square brackets indicate that the code is to run when the component is first mounted and ready. We're using this so that we can tell streamlit to set the height of the component to 500 pixels.

```tsx
useEffect(() => {
    Streamlit.setFrameHeight(500)
  }, [])
```

We'll skip straight to the return value first and come back to our other section.

So the first thing to notice about our return value is that it follows the syntax of a shorthand if statement in JavaScript (and typescript). The code in the parentheses after the `?` executes if the code before the `?` is truthy meaning it's defined (not null or false). If the code is null or false, it'll execute the code after the `:`

```tsx
args.data && args.layout ? (do if true) : (do if false)
``` 

So we can apply that knowledge to know that if both data and layout have been defined in the `args`, then we will execute the `<Plot>` element, otherwise we will show a div saying that we have no data. Remember earlier that we've imported `<Plot>` from Plotly. Like any Plotly figure, we'll need to specify a data and layout parameter. We're passing these from python. We can also specify a style attribute for an inline style with any applicable CSS. This is something that Streamlit natively does not support, so this is one nice feature of using components. There is the `config` attribute where we want to specify this figure as responsive to play nicely with users with different screen sizes (including on mobile). Lastly, we have an attribute call `onClick`. This is an extremely cool attribute! This is a JavaScript event where we can run a function whenever a user clicks on one of the markers. 

```tsx
return (
    <div style={{ width: '100%' }}>
      {args.data && args.layout ? (
        <Plot
          data={args.data}
          layout={args.layout}
          style={{ width: '100%', height: '450px' }}
          onClick={handleClick}
          config={{ responsive: true }}
        />
      ) : (
        <div style={{
          width: '100%', 
          height: '450px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px'
        }}>
          <p>Waiting for data...</p>
        </div>
      )}
    </div>
  );
```

Now, let's circle back to the `handleClick` function. This was the value of the `onclick` attribute from earlier. We'll use this click event to demonstrate the bidirectional flow of Streamlit by setting a component value using `Streamlit.setComponentValue`. Notice that we're specifying `clickData` as the parameter for this function. `clickData` will contain all the information about the user's click event. This will be an array of data in which we just want the first value to get the data that we're interested in. For example, `clickData.points[0].text` will be the text of the point which in this case is the athlete's name. 

```tsx
  const handleClick = (clickData: any) => {
    if (clickData.points && clickData.points.length > 0) {
      const point = clickData.points[0];
      const athleteName = point.text || `Athlete at index ${point.pointIndex}`;
      Streamlit.setComponentValue({
        series: point.curveNumber,
        pointIndex: point.pointIndex,
        x: point.x,
        y: point.y,
        athleteName: athleteName
      })
    }
  }
```

One final statement at the end of the file is that we need to return the component back to Streamlit.

```tsx
export default withStreamlitConnection(CrossfitScatterPlot);
```

The final file we need for the actual component is the `__init__.py` file which will dictate the connection that the streamlit code will have with the component.

`components.declare_component()` is the function that'll specify where the code for our component can be executed from. I'm using a `_RELEASE` variable as a boolean that I will manually set in the code to dictate whether I've built the production version of the component. If the variable is false, then we just use the port that we've specified earlier in the `.env` to say that our component is currently served on that port. This enables it so that when we make a change to the typescript, that change will nearly instantly be rendered in streamlit. If the variable is True, then we've built the component and all of our code will be in the `frontend/build` folder. The advantage is that this will be an optimized build that should be faster.

The last part to note is that we're creating the function `crossfit_scatter_plot` that we'll be importing in streamlit. This function will call `_component_func()` which is a function that is determined by the boolean `_RELEASE`

```python
import os
import streamlit.components.v1 as components

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
_RELEASE = False

# Declare a Streamlit component. `declare_component` returns a function
# that is used to create instances of the component. We're naming this
# function "_component_func", with an underscore prefix, because we don't want
# to expose it directly to users. Instead, we will create a custom wrapper
# function, below, that will serve as our component's public API.

if not _RELEASE:
    # While we're in development, we can use the hot-reload mechanism in Streamlit
    # to load the component from our frontend/build/ directory
    _component_func = components.declare_component(
        "crossfit_scatter_plot",
        url="http://localhost:3001",
    )
else:
    # When we're distributing the component, we'll build the JSX files to the
    # frontend/build directory.
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("crossfit_scatter_plot", path=build_dir)

def crossfit_scatter_plot(data, layout):
    component_value = _component_func(
        data=data,
        layout=layout
    )
    
    return component_value
```

Phew! This concludes writing the component as well as the hook. All that's left to do now is to update our Streamlit app to use this component.

## Back to Streamlit

To add this component, we'll first want to import the component.

```python
from components.crossfit_scatter_plot import crossfit_scatter_plot
```

Next, we'll also want to specify that data and layout for our scatter plot in python. This way our python is still in control and our React component will refresh with the new data whenever we change our data. Let's add two functions to help us.

```python
@st.cache_data
def parse_data(df) -> dict:
    """
    Parse data to get it ready for React
    """
    # guard against null values
    filtered_df = df.dropna(subset=['weight', 'deadlift'])

    # clean data
    filtered_df = filtered_df[(filtered_df['weight'] <= 500) & (filtered_df['deadlift'] <= 1000) 
                              & (filtered_df['weight'] >= 100) & (filtered_df['deadlift'] >= 10)]
    # take the first 100 results that match the filter
    filtered_df = filtered_df.head(1000)

    return [
        {
            'x': filtered_df['weight'].to_list(),
            'y': filtered_df['deadlift'].to_list(),
            'mode': 'markers',
            'type': 'scatter',
            'text': filtered_df['name'].to_list(),
            'marker': {
                'color': 'rgba(17, 157, 255, 0.8)',
                'size': 10,
            },
            'name': 'Weight vs Deadlift'
        }
    ]

# Create a layout configuration for the plot
def create_layout():
    return {
        'title': 'Weight vs Deadlift Performance',
        'xaxis': {
            'title': 'Weight (lbs)',
            'showgrid': True
        },
        'yaxis': {
            'title': 'Deadlift (lbs)',
            'showgrid': True
        },
        'margin': {'l': 50, 'r': 40, 't': 40, 'b': 40},
        'hovermode': 'closest',
        'showlegend': True
    }
```

Our `parse_data` function will serve the purpose to clean the data and get it ready to be sent to the component. We're filtering three times in this function. First we're dropping all records that are null in either of the two columns we're interested in.

```py
filtered_df = df.dropna(subset=['weight', 'deadlift'])
```

Second, we have a lot of outliers and data that doesn't make sense like a negative value for a deadlift weight. We'll use the following filter to say that people must weight between 100 and 500 pounds and their deadlift weight must be between 10 and 1000 pounds.

```py
filtered_df = filtered_df[(filtered_df['weight'] <= 500) & (filtered_df['deadlift'] <= 1000) 
                              & (filtered_df['weight'] >= 100) & (filtered_df['deadlift'] >= 10)]
```

The last filter will just limit the results of that filter to 1000 rather than use the entire CSV of data.

```py
filtered_df = filtered_df.head(1000)
```

Now we'll just return a list of the data that our component will be looking for. We specify that x will be the weight and y will be the deadlift, and we convert the columns of that data frame to a list so that it is json serializable. The `text` of this data will also include the name of the athlete so that we can identify the point on the plot.

```py
return [
        {
            'x': filtered_df['weight'].to_list(),
            'y': filtered_df['deadlift'].to_list(),
            'mode': 'markers',
            'type': 'scatter',
            'text': filtered_df['name'].to_list(),
            'marker': {
                'color': 'rgba(17, 157, 255, 0.8)',
                'size': 10,
            },
            'name': 'Weight vs Deadlift'
        }
    ]
```

The `create_layout` function is a little easier to explain as all it's doing is saying what the labels of the axes are going to be.

We're also going to need code to actually call and display the component. Notice that we're also assigning the value of the component function. This is where the bidirectional communication comes in. We'll assign the variable `selected_point` to be the value that `setComponentValue` from React sends back. This will be a dictionary in python. So if we have a value for `selected_point` (the user has clicked a point and sent something back to Streamlit), we'll display values of that data point.

```py
df = load_data()
parsed_data = parse_data(df)
selected_point = crossfit_scatter_plot(
    data=parsed_data,
    layout=create_layout()
)

# if user has selected an athlete from scatter plot
if selected_point:
    st.write("### Selected Athlete Information")
    st.write(f"**Athlete:** {selected_point.get('athleteName', 'Unknown')}")
    st.write(f"**Weight:** {selected_point.get('x')} lbs")
    st.write(f"**Deadlift:** {selected_point.get('y')} lbs")
```

Lastly, we'll use streamlit expanders to display the dataframe and the json that we're sending to React. This may give us some debugging capability

```py
with st.expander('Raw Dataframe'):
    st.dataframe(df)

with st.expander('JSON'):
    st.json(parsed_data)
```

So here is the full streamlit app code.

```py
import streamlit as st
import pandas as pd
from components.crossfit_scatter_plot import crossfit_scatter_plot

@st.cache_data
def load_data() -> pd.DataFrame:
    return pd.read_csv('temp/data.csv')

@st.cache_data
def parse_data(df) -> dict:
    """
    Parse data to get it ready for React
    """
    # guard against null values
    filtered_df = df.dropna(subset=['weight', 'deadlift'])

    # clean data
    filtered_df = filtered_df[(filtered_df['weight'] <= 500) & (filtered_df['deadlift'] <= 1000) 
                              & (filtered_df['weight'] >= 100) & (filtered_df['deadlift'] >= 10)]
    # take the first 100 results that match the filter
    filtered_df = filtered_df.head(1000)

    return [
        {
            'x': filtered_df['weight'].to_list(),
            'y': filtered_df['deadlift'].to_list(),
            'mode': 'markers',
            'type': 'scatter',
            'text': filtered_df['name'].to_list(),
            'marker': {
                'color': 'rgba(17, 157, 255, 0.8)',
                'size': 10,
            },
            'name': 'Weight vs Deadlift'
        }
    ]

# Create a layout configuration for the plot
def create_layout():
    return {
        'title': 'Weight vs Deadlift Performance',
        'xaxis': {
            'title': 'Weight (lbs)',
            'showgrid': True
        },
        'yaxis': {
            'title': 'Deadlift (lbs)',
            'showgrid': True
        },
        'margin': {'l': 50, 'r': 40, 't': 40, 'b': 40},
        'hovermode': 'closest',
        'showlegend': True
    }

df = load_data()
parsed_data = parse_data(df)
selected_point = crossfit_scatter_plot(
    data=parsed_data,
    layout=create_layout()
)

# if user has selected an athlete from scatter plot
if selected_point:
    st.write("### Selected Athlete Information")
    st.write(f"**Athlete:** {selected_point.get('athleteName', 'Unknown')}")
    st.write(f"**Weight:** {selected_point.get('x')} lbs")
    st.write(f"**Deadlift:** {selected_point.get('y')} lbs")

with st.expander('Raw Dataframe'):
    st.dataframe(df)

with st.expander('JSON'):
    st.json(parsed_data)
```

Now we'll see a scatter plot of a 1000 crossfit athletes with their weight vs their deadlift. Notice that we're also able to click any point on the plot and have our streamlit app render the athlete's information.

![CrossFit Streamlit App](../../assets/images/20250328_crossfit_streamlit.gif)

## Just Build the thing

Before we wrap up, it'd be worth it to mention how to actually build the component. Up until now, we've been use npm to render the component locally on our machines. This is nice for developers because we can make changes and have them instantly reflected in our application. But this isn't going to work for a production system to rely on an open port to serve content nor is the component optimized. What we'll want to do when we're ready to deploy it with our streamlit app is to build the component.

Luckily, it's pretty easy to build the component. Just like we run `npm run start` to start our component in development mode, we can run `npm run build` to build a production version of the component.

When you run `npm run build`, the component will begin building to the previously uninhabited `build/` folder in the same directory.

Once you build the component, there is just one thing to change so our Streamlit App knows to use this new built version. Remember we created a variable in `__init__.py` called `_RELEASE`? Well now, all we need to do is to set that variable to `True`. By doing that, Streamlit will use the conditional statement to use the `build/` folder instead of looking for the component on localhost.

```py
import os
import streamlit.components.v1 as components

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
_RELEASE = True

# Declare a Streamlit component. `declare_component` returns a function
# that is used to create instances of the component. We're naming this
# function "_component_func", with an underscore prefix, because we don't want
# to expose it directly to users. Instead, we will create a custom wrapper
# function, below, that will serve as our component's public API.

if not _RELEASE:
    # While we're in development, we can use the hot-reload mechanism in Streamlit
    # to load the component from our frontend/build/ directory
    _component_func = components.declare_component(
        "crossfit_scatter_plot",
        url="http://localhost:3001/crossfit_scatter_plot",
    )
else:
    # When we're distributing the component, we'll build the JSX files to the
    # frontend/build directory.
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("crossfit_scatter_plot", path=build_dir)

def crossfit_scatter_plot(data, layout):
    component_value = _component_func(
        data=data,
        layout=layout
    )
    
    return component_value
```

## Concluding

So, what have we learned? Well we learned how to take our frontend skills with React and apply them to create a component in Streamlit. This component will help to enhance our Streamlit App by letting us take advantage of things like state and click handler events.