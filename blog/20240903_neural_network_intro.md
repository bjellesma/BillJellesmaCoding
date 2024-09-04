---
title: "Neural Network Intro using numpy and tensorflow"
date: "2024-09-04 00:00:00"
updateTime: "2024-09-04 00:00:00"
author: "Bill Jellesma"
authorImage: ../../assets/images/author/author-bjellesma.jpg
image: ../../assets/images/2024-09-04-neural-network.png
tagline: "Numpy and Tensorflow"
published: True
tags:
  - Math
  - Machine Learning
  - Artificial Intelligence
  - numpy
  - tensorflow
---

# Neural Network Intro

The new hotness today, Neural networks date back to the 1950s but initially failed to gain traction due to hardware limitations. However, in the 1980s and 90s, neural networks gained attention for their ability to recognize hand-written digits in postal services.

By 2005, the resurgence of deep learning, led by pioneers like Jeff Hinton, enabled applications in speech recognition and image processing. Neural networks are now widely used in fields like **Natural Language Processing (NLP)** and **Computer Vision**.

In this post, let's get into a brief introduction of what a neural network actually is.

## What is a neural network

A neural network simulates a biological brain. Biological neural networks (as you might remember from high school biology) have **dendrites** which receive input from other neurons and send the data as output to other neurons through **axons**. When the neurons receive input from dendrites, they process the data and sends an **action potential** to the axon where it'll travel over to the other neurons.

Similarly, an artificial neural network takes input as an array of numbers and outputs another array of numbers. The neurons of an artificial neural network will each perform an **activation function** which can be thought of as the action potential in a biological neural network.

However, this idea is largely where similarities end between biological and artificial neural networks. Mostly this is due to the fact that we really don't fully understand the brain yet. For example, a person may become blind at a certain age and then that part of the brain devoted to sight will adapt to some other sensory input like touch. How does this happen? This is a question scientists have yet to answer.

Neurons in an artificial neural network are also organized into layers. This is to aid us to be able to create a structured flow of information and to model increasingly complex patterns. Each layer builds upon the previous one, transforming input data through multiple stages, which enables the network to learn and represent both simple and complex features. Larger neural networks (with more neurons and layers) also tend to perform better when fed with more data, because they can learn more intricate patterns and relationships In contrast, biological neural network perform largely the same regardless of the volume of data.

<img src="https://github.com/bjellesma/Notes/raw/master/Coursera/Machine-Learning-Specialization/image-29.png" alt="Neural Network Diagram" style="max-width:100%; height:auto;">


## Activation Functions and Layers

In artificial neural networks (ANNs), neurons are organized into **layers** to structure the flow of information and build increasingly complex representations of data. Each layer in a neural network performs a distinct transformation on the input data, allowing the network to learn progressively more abstract features. Let’s break down the role of different types of layers.

### 1. Input Layer
The **input layer** is the first layer of the neural network. It receives raw data and passes it to the next layer. This is typically the training data that you have to pass to the network in a vector form. The neurons in this layer correspond to the features in the dataset. For example, in an image recognition task, each neuron in the input layer might represent a pixel.

It's important to note here that the input layer **does not apply any transformations or functions**; it simply forwards the data to the subsequent layers.

### 2. Hidden Layers
The **hidden layers** are where most of the learning occurs. While you'll only have one input layer, you'll have one or more hidden layers which perform the activation functions using weights and biases that we've discussed previously in linear and logistic regression. The neurons in the hidden layers perform the following mathematical operations:

$$
z^{(l)} = W^{(l)} a^{(l-1)} + b^{(l)}
$$

Where:
- $ W^{(l)} $ are the weights for layer $ l $,
- $ a^{(l-1)} $ are the activations from the previous layer (or input data for the first hidden layer),
- $ b^{(l)} $ is the bias term.

Once the weighted sum is computed, it is passed through an **activation function** (more on this in a bit) to introduce non-linearity, which enables the network to model complex, non-linear relationships in the data.

#### Why Use Multiple Hidden Layers?
Each hidden layer extracts different levels of abstraction from the data:
- **Early layers** detect simple patterns (like edges in an image or basic correlations in data).
- **Middle layers** detect combinations of those simple patterns (like shapes or interactions between features).
- **Deeper layers** detect complex, high-level patterns (like objects in images or relationships between multiple features).

For instance, in a deep learning model for image recognition:
- The first hidden layer may detect edges.
- The second hidden layer could detect combinations of edges, such as shapes.
- The final hidden layers may detect complex patterns like entire objects.

Each layer builds on the features learned by the previous layer, which is why **deep networks** (networks with many hidden layers) are so powerful for tasks like image recognition, natural language processing (NLP), and more.

### 3. Output Layer
The **output layer** produces the final result of the network's computations. In a classification task, the network’s goal is to produce a probability. In a regression task, the output layer typically contains a single neuron that outputs a continuous value.

For a classification task, the output is typically computed using the **sigmoid function** to convert the raw scores into probabilities:

$$
 g(z) = \frac{1}{1+e^{-z}} 
$$

where 0 < g(z) < 1 and z is 

$$
z=\vec{w} \cdot \vec{x} + b
$$

### How Layers Contribute to Learning
The layers in a neural network work together to progressively transform the data. In early layers, the network learns simple patterns, while in deeper layers, it learns more complex patterns. This hierarchy of features is what allows neural networks to perform well on complex tasks like object recognition, language translation, and speech processing.

### Activation Function

The **activation function** is a crucial part of a neural network, as it determines whether a neuron should be activated based on the input it receives. Below are a couple of common activation functions.

#### 1. **Sigmoid Function**:
The **sigmoid activation function** maps the input to a value between 0 and 1. It is commonly used in **binary classification tasks** where the output is interpreted as a probability.

The sigmoid function is defined as:
$$
g(z) = \frac{1}{1+e^{-z}} 
$$

Key characteristics of the sigmoid function:
- **Smooth and differentiable**: This is useful for backpropagation.
- **Squashes output** to a range between 0 and 1, which is helpful for interpreting output as probabilities in classification tasks.
- **Vanishing gradient issue**: When the input $ z $ is very large or very small, the gradient of the function becomes close to zero, which can slow down learning in deep networks. This can act as a hindrance in some circumstances.

The sigmoid function was widely used in early neural networks, but has been largely replaced by ReLU and its variants in modern deep networks due to its issues with the vanishing gradient problem.

#### 2. **ReLU (Rectified Linear Unit)**:
The **ReLU (Rectified Linear Unit)** is one of the most popular activation functions used in deep learning today due to its simplicity and effectiveness. It is defined as:

$$
f(x) = \max(0, x)
$$

ReLU outputs the input directly if it is positive; otherwise, it returns zero. This introduces **non-linearity** in the network but keeps the function simple and computationally efficient.

**Advantages of ReLU**:
- **Computationally efficient**: ReLU only requires a simple thresholding operation, making it faster to compute compared to functions like sigmoid.
- **Mitigates vanishing gradient problem**: Unlike the sigmoid function, ReLU does not suffer from the vanishing gradient problem as much. Gradients are either zero (for negative inputs) or one (for positive inputs), which helps the network learn faster.

#### Why Are Activation Functions Important?

Without activation functions, each layer in the neural network would just be performing a linear transformation on the input. For example, a series of linear layers could always be reduced to a single linear transformation, limiting the model to learning only linear relationships in the data. Activation functions allow the network to learn complex, **non-linear** mappings, which is crucial for tasks like image recognition, natural language processing, and other problems with intricate patterns.

Each activation function plays a vital role in the network, helping it to approximate complex functions and learn the intricate relationships between inputs and outputs.

## Forward Propagation

In neural networks, **forward propagation** refers to the process of passing the input data through the network's layers, applying weights, biases, and activation functions at each neuron, until we arrive at the output. This process enables the network to compute predictions based on the input data. Sometimes, we also refer to this as making **inferences**.

## Step-by-Step Explanation of Forward Propagation

### 1. **Input Layer**
As stated previously, the input layer is where raw data enters the network. This can be data like pixel values in an image, numerical values in a dataset, or words in a sentence. In forward propagation, the input layer simply passes this data to the first hidden layer.

### 2. **Weighted Sum**
At each neuron in the hidden layers, the inputs from the previous layer are multiplied by the **weights** assigned to each connection and summed together. Additionally, a **bias** term is added to this sum, which allows the network to model more complex relationships.

Mathematically, the weighted sum for neuron $ j $ in layer $ l $ is calculated as:

$$
z_j^{(l)} = W^{(l)} \cdot a^{(l-1)} + b^{(l)}
$$

Where:
- $ W^{(l)} $ are the weights connecting neurons from layer $ l-1 $ to layer $ l $,
- $ a^{(l-1)} $ are the activations (outputs) from the previous layer. $ a^{(0)} $ is the same as the input $\vec{x}$
- $ b^{(l)} $ is the bias term for layer $ l $,
- $ z_j^{(l)} $ is the weighted sum at neuron $ j $ in layer $ l $.

### 3. **Activation Function**
Once the weighted sum is computed, it is passed through the activation function such as the sigmoid or RELU.

### 4. **Pass to Next Layer**
The output of each neuron (after applying the activation function) is passed to the next layer, and this process repeats across all the hidden layers of the network. The network continues to compute weighted sums and apply activation functions at each neuron, layer by layer.

### 5. **Output Layer**
Finally, the output layer receives the transformed data and produces the network's prediction. Depending on the task, different activation functions are applied here:
- **Sigmoid** for binary classification,
- **Softmax** for multi-class classification,
- **Linear activation** for regression tasks.

For a binary classification problem, the output neuron might use the **sigmoid** function to predict a probability that the input belongs to a certain class:

### Example: Forward Propagation Code in NumPy

Below is an example of forward propagation implemented in Python using NumPy. This example assumes a simple network with one hidden layer.

```python
import numpy as np

# Sigmoid activation function
def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Forward propagation function
def forward_propagation(X, W1, b1, W2, b2):
    # First layer
    z1 = np.dot(W1, X) + b1
    a1 = sigmoid(z1)

    # Second layer (output layer)
    z2 = np.dot(W2, a1) + b2
    a2 = sigmoid(z2)

    return a2

# Example inputs
X = np.array([[0.5], [0.2]])
W1 = np.array([[0.1, 0.4], [0.2, 0.3]])
b1 = np.array([[0.1], [0.1]])
W2 = np.array([[0.2, 0.5]])
b2 = np.array([[0.3]])

# Forward pass
output = forward_propagation(X, W1, b1, W2, b2)
print("Output:", output)
```

Which gives

```
[[0.66680455]]
```

This code illustrates a simple 2-layer neural network. The forward pass starts by computing the weighted sum for the first hidden layer and applying the sigmoid activation function. The process is repeated for the output layer.

## Brief dive into Tensorflow

Tensorflow is a machine learning package developed by Google. In 2019, Google released tensorflow 2.0 which integrated Keras, another machine learning package developed independantly.

Tensorflow (pytorch is another widely used Machine Learning Library) makes it trivial to setup a neural network by abstracting away a lot of the code. 

```python
import tensorflow as tf
from tensorflow.keras.layers import Dense, Input

rng = np.random.default_rng(2)
X = rng.random(400).reshape(-1,2) 

# optionally, you can choose to add normalization which can help if the data spans vast ranges
norm_l = tf.keras.layers.Normalization(axis=-1)
norm_l.adapt(X)

# in our model, we define 1 input layer and 2 hidden layers
model = Sequential(
    [
        tf.keras.Input(shape=(2,), batch_size=32),
        Dense(3, activation='sigmoid', name = 'layer1'),
        Dense(1, activation='sigmoid', name = 'layer2')
     ]
)

# Tile will simply just copy whatever already exists in the dataset for the specified number of times.
Xt = np.tile(Xn,(1000,1))
Yt= np.tile(Y,(1000,1))   

# we'll dive more deeply into model compilation and fit in a later aticle
model.compile(
    loss = tf.keras.losses.BinaryCrossentropy(),
    optimizer = tf.keras.optimizers.Adam(learning_rate=0.01),
)

model.fit(
    Xt,Yt,            
    epochs=10,
)
```

That's it, now we'll pass some new test data

```python
X_test = np.array([
    [200,13.9],  # positive example
    [200,17]])   # negative example
X_testn = norm_l(X_test)
predictions = model.predict(X_testn)
print("predictions = \n", predictions)

# use yhat as a tensor to store the binary classifications, 1 for yes andd 0 for no
yhat = np.zeros_like(predictions)
for i in range(len(predictions)):
    if predictions[i] >= 0.5:
        yhat[i] = 1
    else:
        yhat[i] = 0
print(f"decisions = \n{yhat}")
```

Your output will vary but should look similar to below. Notice that output (as well as `X-test` above) use 2D arrays or matrices. This is because tensorflow is a lot more efficient with matrix multiplication.

```
predictions = 
 [[9.63e-01]
 [3.03e-08]]
decisions = 
[[1.]
 [0.]]
 ```

## Vectorization

Now that we've mentioned matrix multiplication, we can explain why this is so efficient for a computer using the concept of **vectorization**. Before we chat about that, let's first do a quick review of **matrix multiplication** from linear algebra. We'll just created two equal length matrices.

### Problem Description: Matrix Multiplication

In this problem, we are given two matrices $ A $ and $ W $. The task is to compute the product of these matrices, resulting in a new matrix $ Z $.

#### Given:
- Matrix $ A $ is a $ 2 \times 2 $ matrix:
  $
  A = \begin{pmatrix} 
  1 & -1 \\
  2 & -2 
  \end{pmatrix}
  $
  
- Matrix $ W $ is a $ 2 \times 2 $ matrix:
  $
  W = \begin{pmatrix} 
  3 & 5 \\
  4 & 6 
  \end{pmatrix}
  $

#### Objective:
To compute the matrix product $ Z = A^T W $, where $ A^T $ is the transpose of matrix $ A $.

#### Steps:
1. **Transpose Matrix $ A $**: 
   The transpose of matrix $ A $, denoted $ A^T $, is obtained by swapping its rows and columns:
   $
   A^T = \begin{pmatrix} 
   1 & 2 \\
   -1 & -2 
   \end{pmatrix}
   $

2. **Matrix Multiplication**:
   To find matrix $ Z $, multiply each row of $ A^T $ by each column of $ W $, and sum the products to form the corresponding element in $ Z $.

   $
   Z = A^T W = \begin{pmatrix} 
   1 & 2 \\
   -1 & -2 
   \end{pmatrix} 
   \begin{pmatrix} 
   3 & 5 \\
   4 & 6 
   \end{pmatrix}
   $

   This results in:
   $
   Z = \begin{pmatrix} 
   (1 \times 3) + (2 \times 4) & (1 \times 5) + (2 \times 6) \\
   (-1 \times 3) + (-2 \times 4) & (-1 \times 5) + (-2 \times 6) 
   \end{pmatrix}
   $

3. **Compute the Elements**:
   - $ Z_{11} = 1 \times 3 + 2 \times 4 = 3 + 8 = 11 $
   - $ Z_{12} = 1 \times 5 + 2 \times 6 = 5 + 12 = 17 $
   - $ Z_{21} = -1 \times 3 + -2 \times 4 = -3 - 8 = -11 $
   - $ Z_{22} = -1 \times 5 + -2 \times 6 = -5 - 12 = -17 $

   Thus, the resulting matrix $ Z $ is:
   $
   Z = \begin{pmatrix} 
   11 & 17 \\
   -11 & -17 
   \end{pmatrix}
   $

Now that example also assumes two equal length matrices. What if we have differently sized matrices?

If the matrices are different shape, we use the number of rows of the first matrix and the number of columns of the 2nd matrix to get the dimensions of the resultant matrix

Given matrices $ A $ and $ W $:

$
A = \begin{bmatrix} 
1 & -1 & 0.1 \\
2 & -2 & 0.2 
\end{bmatrix},
\quad A^T = \begin{bmatrix} 
1 & 2 \\
-1 & -2 \\
0.1 & 0.2 
\end{bmatrix},
\quad W = \begin{bmatrix} 
3 & 5 & 7 & 9 \\
4 & 6 & 8 & 0 
\end{bmatrix}
$

The matrix multiplication $ Z = A^T W $ will result in a $ 3 \times 4 $ matrix. One requirement is that the number of columns of the first matrix and the number of rows of the second matrix must be equal or else you can't do matrix multiplication. This requirement is built on the idea that we're using the dot product when we're doing matrix multiplication and a requirement of the dot product is that the vectors have to be of equal length.

The element $ Z_{11} $ is computed as:

1. **Element $ Z_{11} $**:
   $
   Z_{11} = \vec{a}_1^T \vec{w}_1 = (1 \times 3) + (2 \times 4) = 3 + 8 = 11
   $

2. **Element $ Z_{12} $**:
   $
   Z_{12} = \vec{a}_1^T \vec{w}_2 = (1 \times 5) + (2 \times 6) = 5 + 12 = 17
   $

3. **Element $ Z_{13} $**:
   $
   Z_{13} = \vec{a}_1^T \vec{w}_3 = (1 \times 7) + (2 \times 8) = 7 + 16 = 23
   $

4. **Element $ Z_{14} $**:
   $
   Z_{14} = \vec{a}_1^T \vec{w}_4 = (1 \times 9) + (2 \times 0) = 9 + 0 = 9
   $

5. **Element $ Z_{21} $**:
   $
   Z_{21} = \vec{a}_2^T \vec{w}_1 = (-1 \times 3) + (-2 \times 4) = -3 - 8 = -11
   $

6. **Element $ Z_{22} $**:
   $
   Z_{22} = \vec{a}_2^T \vec{w}_2 = (-1 \times 5) + (-2 \times 6) = -5 - 12 = -17
   $

7. **Element $ Z_{23} $**:
   $
   Z_{23} = \vec{a}_2^T \vec{w}_3 = (-1 \times 7) + (-2 \times 8) = -7 - 16 = -23
   $

8. **Element $ Z_{24} $**:
   $
   Z_{24} = \vec{a}_2^T \vec{w}_4 = (-1 \times 9) + (-2 \times 0) = -9 + 0 = -9
   $

9. **Element $ Z_{31} $**:
   $
   Z_{31} = \vec{a}_3^T \vec{w}_1 = (0.1 \times 3) + (0.2 \times 4) = 0.3 + 0.8 = 1.1
   $

10. **Element $ Z_{32} $**:
    $
    Z_{32} = \vec{a}_3^T \vec{w}_2 = (0.1 \times 5) + (0.2 \times 6) = 0.5 + 1.2 = 1.7
    $

11. **Element $ Z_{33} $**:
    $
    Z_{33} = \vec{a}_3^T \vec{w}_3 = (0.1 \times 7) + (0.2 \times 8) = 0.7 + 1.6 = 2.3
    $

12. **Element $ Z_{34} $**:
    $
    Z_{34} = \vec{a}_3^T \vec{w}_4 = (0.1 \times 9) + (0.2 \times 0) = 0.9 + 0 = 0.9
    $

### Final Matrix $ Z $:

$
Z = \begin{bmatrix} 
11 & 17 & 23 & 9 \\
-11 & -17 & -23 & -9 \\
1.1 & 1.7 & 2.3 & 0.9 
\end{bmatrix}
$


Now that we've done just a few brief problems to go over matrix multiplication, let's just get into some code.


**Vectorization** is an idea that CPUs and GPUs (mostly GPUs) are very well optimized to handle matrix multiplication and we can take advantage of this idea by converting the weights of a model from a vector to a matrix. This is similar to the idea of what tensorflow actually does.

```python
def dense(A_in, W, B):
    # matmul can sometimes be written in code as Z = A_in @ W
    # remember that matmul is doing the matrix multiplication that we saw previously
    Z = np.matmul(A_in, W) + B
    A_out = sigmoid(Z)
    return A_out
```

Now that we've defined the dense layer using the matmul function, the rest is pretty much the same. We'll create a sequential model with three layers.

```python
def my_sequential_v(X, W, B):
    A1 = dense(X, W, B)
    return(A1)
```

We'll now run our data through

```python
X = np.array([[200, 17]])
W = np.array([[1, -3, 5], 
              [-2, 4, -6]])
B = np.array([[-1, 1, 2]])

Prediction = my_sequential_v(X, W, B)
```

For those wondering (I know I was), the `matmul` function is still using the dot product from linear algebra and not the cross product. This is because the dot product when performed on two equal length matrices will still result in a matrix of the same size.

<img src="https://github.com/bjellesma/Notes/raw/master/Coursera/Machine-Learning-Specialization/image-43.png" alt="Vectorization" style="max-width:100%; height:auto;">
