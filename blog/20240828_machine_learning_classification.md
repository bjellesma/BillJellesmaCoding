---
title: "Classification - Logistic Regression"
date: "2024-08-28 23:00:00"
updateTime: "2024-08-28 23:00:00"
author: "Bill Jellesma"
authorImage: ../../assets/images/author/author-bjellesma.jpg
image: ../../assets/images/2024-08-28-logistic-regression.jpg
tagline: "Classification, logistic regression, numpy"
published: True
tags:
  - Math
  - Machine Learning
  - Artificial Intelligence
  - numpy
---

# Classification

Classification is a type of machine learning algorithm that is used to predict the class or category of a given input. This is as opposed to linear regression which I wrote about [last week](https://billjellesmacoding.netlify.app/blog/20240817_unsupervised_linear_regression). Unlike linear regression which aims to output a number (based on the square footage of my house and the past year's worth of data, what can I expect my house to sell for), classification only has a handful of different outputs at the end (Is this a dog or a cat). In this article, I'll focus on the most widely used classification method, logistic regression.

First I think we want to briefly look at why we can't just use linear regression and assign a threshold.

### Why Linear Regression is Not Suitable for Classification

Linear regression is not ideal for classification tasks because:

- It focuses on finding the best fit line, which may shift with additional training examples, thus altering the **decision boundary**—the point at which we decide the classification.
    - Based on what we discussed in linear regression, more training data added to the model will shift the best fit line which can skew our results. We want this decision boundary to stay the same regardless of the amount of training data that we have.

- It can lead to incorrect classifications, especially for categorical data. For example, tumors larger than a certain size might still be classified as malignant, even if they are benign.

<img src="https://github.com/bjellesma/Notes/raw/master/Coursera/Machine-Learning-Specialization/image-11.png" alt="Incorrect classification by Linear Regression" style="max-width:100%; height:auto;">

The above image illustrates how linear regression fails to correctly classify data points for categorical data. This is because linear regression will attempt to give us a curve. 

<img src="https://github.com/bjellesma/Notes/raw/master/Coursera/Machine-Learning-Specialization/image-12.png" alt="Impact of Tumor Size on Classification" style="max-width:100%; height:auto;">


While linear regression might sometimes get lucky and classify the data correctly, it's not reliable for categorical data. If we're try to classify a tumor, accuracy becomes very important.

## Binary Classification

**Binary classification** refers to the type of classification where there are only two possible outcomes, such as "Yes/No" or "True/False." The example above with a tumor would be binary if we had benign or malignant.

Classification algorithms can have more than two categories. For example, we may want to further classify the tumor as benign, malignant type 1, or malignant type 2. This may be more useful but is no longer binary.

## Logistic Regression

Logistic regression is a more suitable alternative for classification tasks. It uses a logistic function to model the probability of a binary outcome and can effectively create a decision boundary for classification.

### Key Functions in Logistic Regression

Though we're not using linear regression as stated previously, you can think of logistic regression as building on top of linear regression.

- **Sigmoid Function**: This is the new best fit line because this gives a unique S-curve that we make more accurately use to classify our outputs.

<img src="https://github.com/bjellesma/Notes/raw/master/Coursera/Machine-Learning-Specialization/image-16.png" alt="sigmoid" style="max-width:100%; height:auto;">


Mathematically the sigmoid uses the following equation. Here, e is a well known constant in the field of mathematics.

## $g(z) = \frac{1}{1+e^{-z}}$ where 0 < g(z) < 1

In the sigmoid, the value of z is also the familiar linear regression equation

## $z=\vec{w} \cdot \vec{x} + b$ where we're taking the dot product of the weights (w vector) and input training data (x vector)

- **Decision Boundary**: The threshold at which the output is classified into one of the two categories. This term was mentioned before and you can think of this as the best fit line from linear regression. The key difference is that this concept allows us to assign a threshold so that we make classifications based on those thresholds. 

### Coding the sigmoid

Before moving forward, let's see the sigmoid in numpy code

```python
import numpy as np
import matplotlib.pyplot as plt
def sigmoid(z):
    """
    Compute the sigmoid of z

    Args:
        z (ndarray): A scalar, numpy array of any size.

    Returns:
        g (ndarray): sigmoid(z), with the same shape as z
         
    """

    g = 1/(1+np.exp(-z))
   
    return g

# Generate an array of evenly spaced values between -10 and 10
z_tmp = np.arange(-10,11)

# Use the function implemented above to get the sigmoid values
y = sigmoid(z_tmp)

# Code for pretty printing the two arrays next to each other
np.set_printoptions(precision=3) 
print("Input (z), Output (sigmoid(z))")
print(np.c_[z_tmp, y])

# Plot z vs sigmoid(z)
# subplot is used to create a grid of 1 row and 1 column of plots: 1 plot
# subplots(2,2) would create 4 total plots
fig,ax = plt.subplots(1,1,figsize=(5,3))
ax.plot(z_tmp, y, c="b")

ax.set_title("Sigmoid function")
ax.set_ylabel('sigmoid(z)')
ax.set_xlabel('z')
```

```
Input (z), Output (sigmoid(z))
[[-1.000e+01  4.540e-05]
 [-9.000e+00  1.234e-04]
 [-8.000e+00  3.354e-04]
 [-7.000e+00  9.111e-04]
 [-6.000e+00  2.473e-03]
 [-5.000e+00  6.693e-03]
 [-4.000e+00  1.799e-02]
 [-3.000e+00  4.743e-02]
 [-2.000e+00  1.192e-01]
 [-1.000e+00  2.689e-01]
 [ 0.000e+00  5.000e-01]
 [ 1.000e+00  7.311e-01]
 [ 2.000e+00  8.808e-01]
 [ 3.000e+00  9.526e-01]
 [ 4.000e+00  9.820e-01]
 [ 5.000e+00  9.933e-01]
 [ 6.000e+00  9.975e-01]
 [ 7.000e+00  9.991e-01]
 [ 8.000e+00  9.997e-01]
 [ 9.000e+00  9.999e-01]
 [ 1.000e+01  1.000e+00]]
```

<img src="https://github.com/bjellesma/Notes/raw/master/Coursera/Machine-Learning-Specialization/image-15.png" alt="sigmoid output" style="max-width:100%; height:auto;">

Notice that the y axis is always between zero and one making this ideal for classification. Notice also that as z approaches $\infin$, the sigmoid approaches 1 and as a approaches $-\infin$, the sigmoid approaches 0. 

### Cost Function for Logistic Regression

The trouble with applying the cost function that we used for linear regression (Squared Error Cost) to the sigmoid is that it renders a non convex curve which means that there are several local minima that gradient descent will attempt to approach whereas we instead want the cost function to produce a convex curve so that we can approach one global minimum.

<img src="https://github.com/bjellesma/Notes/raw/master/Coursera/Machine-Learning-Specialization/image-18.png" alt="Problem with squared error cost" style="max-width:100%; height:auto;">


To achieve a more convex curve, we'll apply some logarithms. The cost function is defined as:

## $J(\vec{w},b) = -\frac{1}{m}\sum_{i=1}^m(y^{(i)}(\log{(f_{\vec{w},b}(\vec{x}))} +(1-y^{(i)})\log{(1-f_{\vec{w},b}(\vec{x}^{(i)}))}))$ 

Where:
- $m$ is the number of training examples.
- $y^{(i)}$ is the actual label of the $i$ th training example.

The cost function looks complex but if have two cases that we're classifying (we'll use 0 and 1), then then each iteration of the cost function (a loss function, $L$ represents the cost associated with a single training example) becomes:

## For y=1, $L(f_{\vec{w},b}(\vec{x}), y^{(i)}) = -\log{(f_{\vec{w},b}(\vec{x}))}$ 

## For y=0, $L(f_{\vec{w},b}(\vec{x}), y^{(i)}) = -\log{(1-f_{\vec{w},b}(\vec{x}))}$ 

Mathematically this works because if y is zero then the first term cancels and if y is 1 then the second term cancels.

This achives the result of making sure the cost function is convex, meaning that it has a single global minimum, making it easier to optimize using gradient descent.

### Implementation of Cost Function in NumPy

Here is an example implementation of the logistic regression cost function using NumPy:

```python
import numpy as np
import matplotlib.pyplot as plt

def sigmoid(z):
    """
    Compute the sigmoid of z

    Parameters
    ----------
    z : array_like
        A scalar or numpy array of any size.

    Returns
    -------
     g : array_like
         sigmoid(z)
    """
    # clip is used just to protect against overflow
    z = np.clip( z, -500, 500 )           
    g = 1.0/(1.0+np.exp(-z))

    return g

def compute_cost_logistic(X, y, w, b):
    """
    Computes cost

    Args:
      X (ndarray (m,n)): Data, m examples with n features
      y (ndarray (m,)) : target values
      w (ndarray (n,)) : model parameters  
      b (scalar)       : model parameter
      
    Returns:
      cost (scalar): cost
    """

    m = X.shape[0]
    cost = 0.0
    # iterate over each training example
    for i in range(m):
        z_i = np.dot(X[i],w) + b
        f_wb_i = sigmoid(z_i)
        cost +=  -y[i]*np.log(f_wb_i) - (1-y[i])*np.log(1-f_wb_i)
             
    # divide by number of traing examples
    cost = cost / m
    return cost

X_train = np.array([[0.5, 1.5], [1,1], [1.5, 0.5], [3, 0.5], [2, 2], [1, 2.5]])  #(m,n)
y_train = np.array([0, 0, 0, 1, 1, 1])

w_array1 = np.array([1,1])
b_1 = -3
w_array2 = np.array([1,1])
b_2 = -4

print("Cost for b = -3 : ", compute_cost_logistic(X_train, y_train, w_array1, b_1))
print("Cost for b = -4 : ", compute_cost_logistic(X_train, y_train, w_array2, b_2))
```

```
Cost for b = -3 :  0.36686678640551745
Cost for b = -4 :  0.5036808636748461
```

## Gradient Decent for logistic regression

The functions for these are almost identical in the gradient descent functions for linear regression except that we are using j as a subscript to denote the feature. Also, keep in mind that the definitions of $(f_{w,b}(x^{(i)})$ is now different

## $w_j = w_j - \alpha \frac{1}{m}\sum_{i=1}^{m} (f_{w,b}(x^{(i)}) - y^{(i)})(x_j^{(i)})$

## $b = b - \alpha \frac{1}{m}\sum_{i=1}^{m} (f_{w,b}(x^{(i)}) - y^{(i)})$

It's the same concept other than that. We are using simultaneous updates each pass of these functions and our goal to have gradient descent converge to a global minimum. 

So let's apply this to some code! :)

```python
import copy, math
import numpy as np

def sigmoid(z):
    """
    Compute the sigmoid of z

    Parameters
    ----------
    z : array_like
        A scalar or numpy array of any size.

    Returns
    -------
     g : array_like
         sigmoid(z)
    """
    z = np.clip( z, -500, 500 )           # protect against overflow
    g = 1.0/(1.0+np.exp(-z))

    return g

def compute_gradient_logistic(X, y, w, b): 
    """
    Computes the gradient for logistic regression 
 
    Args:
      X (ndarray (m,n): Data, m examples with n features
      y (ndarray (m,)): target values
      w (ndarray (n,)): model parameters  
      b (scalar)      : model parameter
    Returns
      dj_dw (ndarray (n,)): The gradient of the cost w.r.t. the parameters w. 
      dj_db (scalar)      : The gradient of the cost w.r.t. the parameter b. 
    """
    m,n = X.shape
    dj_dw = np.zeros((n,))                           #(n,)
    dj_db = 0.

    for i in range(m):
        f_wb_i = sigmoid(np.dot(X[i],w) + b)          #(n,)(n,)=scalar
        err_i  = f_wb_i  - y[i]                       #scalar
        for j in range(n):
            dj_dw[j] = dj_dw[j] + err_i * X[i,j]      #scalar
        dj_db = dj_db + err_i
    dj_dw = dj_dw/m                                   #(n,)
    dj_db = dj_db/m                                   #scalar
        
    return dj_db, dj_dw  

def gradient_descent(X, y, w_in, b_in, alpha, num_iters): 
    """
    Performs batch gradient descent
    
    Args:
      X (ndarray (m,n)   : Data, m examples with n features
      y (ndarray (m,))   : target values
      w_in (ndarray (n,)): Initial values of model parameters  
      b_in (scalar)      : Initial values of model parameter
      alpha (float)      : Learning rate
      num_iters (scalar) : number of iterations to run gradient descent
      
    Returns:
      w (ndarray (n,))   : Updated values of parameters
      b (scalar)         : Updated value of parameter 
    """
    # An array to store cost J and w's at each iteration primarily for graphing later
    J_history = []
    w = copy.deepcopy(w_in)  #avoid modifying global w within function
    b = b_in
    
    for i in range(num_iters):
        # Calculate the gradient and update the parameters
        dj_db, dj_dw = compute_gradient_logistic(X, y, w, b)   

        # Update Parameters using w, b, alpha and gradient
        w = w - alpha * dj_dw               
        b = b - alpha * dj_db               
      
        # Save cost J at each iteration
        if i<100000:      # prevent resource exhaustion 
            J_history.append( compute_cost_logistic(X, y, w, b) )

        # Print cost every at intervals 10 times or as many iterations if < 10
        if i% math.ceil(num_iters / 10) == 0:
            print(f"Iteration {i:4d}: Cost {J_history[-1]}   ")
        
    return w, b, J_history         #return final w,b and J history for graphing
```

Whew! Now that we have the functions written, let's see the cost function run for 10,000 iterations and see how it performs. Remember, the whole point of running gradient descent is to find our weights and bias terms that we'll use in our model.

```python
w_tmp  = np.zeros_like(X_train[0])
b_tmp  = 0.
alph = 0.9
iters = 10000

w_out, b_out, _ = gradient_descent(X_train, y_train, w_tmp, b_tmp, alph, iters) 
print(f"\nupdated parameters: w:{w_out}, b:{b_out}")
```

```
Iteration    0: Cost 0.6509898706978229   
Iteration 1000: Cost 0.01898509708803807   
Iteration 2000: Cost 0.009462945855308616   
Iteration 3000: Cost 0.006299017770009604   
Iteration 4000: Cost 0.004720359852320092   
Iteration 5000: Cost 0.003774414835001944   
Iteration 6000: Cost 0.0031443437189356085   
Iteration 7000: Cost 0.0026945747305561125   
Iteration 8000: Cost 0.0023574030434657897   
Iteration 9000: Cost 0.0020952495092537446   

updated parameters: w:[8.21 8.01], b:-22.305241709195236
```

## Making a prediction

Now's the easy part, all we need to do to make our prediction is just apply the sigmoid function. Remember, the z value in the sigmoid is the dot product of the training data along with the weights and bias that we calculated earlier.

```python
def predict(X, w, b): 
    """
    Predict whether the label is 0 or 1 using learned logistic
    regression parameters w
    
    Args:
      X : (ndarray Shape (m,n)) data, m examples by n features
      w : (ndarray Shape (n,))  values of parameters of the model      
      b : (scalar)              value of bias parameter of the model

    Returns:
      p : (ndarray (m,)) The predictions for X using a threshold at 0.5
    """
    # number of training examples
    m, n = X.shape   
    p = np.zeros(m)
    # Loop over each example
    for i in range(m):   
        f_wb_i = sigmoid(np.dot(X[i],w) + b)
        # Apply the threshold
        p[i] = 1 if f_wb_i>=0.5 else 0
    return p
```

Now we just call the function

```python
# Test your predict code
np.random.seed(1)
tmp_w = np.random.randn(2)
tmp_b = 0.3    
tmp_X = np.random.randn(4, 2) - 0.5

tmp_p = predict(tmp_X, tmp_w, tmp_b)
print(f'Output of predict: shape {tmp_p.shape}, value {tmp_p}')
```

## Conclusion

Here we've implemented logistic regression. To reiterate, we couldn't use linear regression directly for classification which I posted on [last week](https://billjellesmacoding.netlify.app/blog/20240817_unsupervised_linear_regression) but we can use logistic regression which builds on the idea.