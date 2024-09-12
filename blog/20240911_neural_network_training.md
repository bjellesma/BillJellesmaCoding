---
title: "Neural Network Advanced Concepts"
date: "2024-09-12 00:00:00"
updateTime: "2024-09-12 00:00:00"
author: "Bill Jellesma"
authorImage: ../../assets/images/author/author-bjellesma.jpg
image: ../../assets/images/20240912_advanced_neural_networks.png
tagline: "Optimization, Numerical Stability"
published: True
tags:
  - Math
  - Machine Learning
  - Neural Network
  - Artificial Intelligence
  - numpy
  - tensorflow
---
# Neural Network Advanced Concepts

In my previous post on [introducing neural networks](https://billjellesmacoding.netlify.app/blog/20240903_neural_network_intro), I introduced the basics of neural networks, including their structure, activation functions, and a brief introduction to TensorFlow. Now, we can expand on these concepts and explore some more advanced topics in neural network architecture and training.

## Building a Neural Network: TensorFlow vs NumPy

Let's begin by revisiting the process of building a neural network, comparing implementations in TensorFlow and NumPy. This will help solidify our understanding of the underlying operations before we move on to more complex topics.

### TensorFlow Implementation

TensorFlow, with its high-level Keras (Remember Keras was a separate ML library originally that Google eventually integrated into tensorflow) API, makes it straightforward to build a neural network. Notice that during the model compilation step, we're using Adam which we will define in more detail later. The naming of [BinaryCrossentropy](https://www.tensorflow.org/api_docs/python/tf/keras/losses/BinaryCrossentropy) for the loss function has it's roots in statistics. Binary just emphasizes that this is based on two possible classes and cross entropy is a statisical term just indicating the loss between the true value and predicted value.

```python
import tensorflow as tf
from tensorflow.keras.layers import Dense, Input

# Define the model
model = tf.keras.Sequential([
    tf.keras.Input(shape=(2,), batch_size=32),
    Dense(3, activation='sigmoid', name='layer1'),
    Dense(1, activation='sigmoid', name='layer2')
])

# Compile the model
model.compile(
    loss=tf.keras.losses.BinaryCrossentropy(),
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.01),
)

# Train the model
model.fit(
    X_train, y_train,            
    epochs=10,
)
```

This TensorFlow code defines a simple neural network with one hidden layer (3 neurons) and an output layer (1 neuron), both using sigmoid activation functions.

### Equivalent NumPy Implementation

Now, let's look at how we might implement the same network structure using NumPy:

```python
import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def forward_pass(X, W1, b1, W2, b2):
    # Layer 1 (Dense layer with sigmoid activation)
    Z1 = np.dot(W1, X) + b1
    A1 = sigmoid(Z1)
    
    # Layer 2 (Output layer with sigmoid activation)
    Z2 = np.dot(W2, A1) + b2
    A2 = sigmoid(Z2)
    
    return A2  # This is the output of the forward pass

# Initialize weights and biases
W1 = np.random.randn(3, 2)  # 3x2 for 3 neurons in hidden layer, 2 input features
b1 = np.zeros((3, 1))
W2 = np.random.randn(1, 3)  # 1x3 for 1 output neuron, 3 neurons in hidden layer
b2 = np.zeros((1, 1))

# Forward pass
output = forward_pass(X_train, W1, b1, W2, b2)

# Note: This doesn't include the training process, which would involve 
# implementing backpropagation and gradient descent
```

This NumPy implementation explicitly shows the matrix operations happening in each layer of the network.

### Comparison

While the TensorFlow implementation abstracts away many details, the NumPy implementation gives us a clearer picture of what's happening "under the hood". In both cases:

1. We're defining a network structure (input -> hidden layer -> output layer)
2. We're using sigmoid activation functions
3. We're performing matrix multiplications (dot products) and adding biases

The key difference is that TensorFlow handles a lot of the complexity for us, including the backpropagation (more on this later) and optimization processes during training.


## Revisiting Activation Functions

We previously discussed the sigmoid activation function and it's use in binary classification. But when it comes to activation functions, sigmoid is not the only game in town.

### Review of the Sigmoid Function

The sigmoid function, defined as 

$$
g(z) = \frac{1}{1+e^{-z}}
$$

maps input to a value between 0 and 1. This makes it particularly useful for binary classification tasks where we want to interpret the output as a probability.

Key characteristics of the sigmoid function:
- Smooth and differentiable: Useful for gradient-based optimization methods.
- Output range between 0 and 1: Ideal for binary classification.
- Potential issue: Vanishing gradient problem in very deep networks.

### ReLU (Rectified Linear Unit)

ReLU, defined as 

$$
f(x) = \max(0, x)
$$

 has become the go-to activation function for hidden layers in modern deep learning models.

ReLU is a simple function but provides a unique feature in that it only has one point where it can flatten out as shown in the image below. This translates to only having half as many minima as the sigmoid. This means that gradient descent will have an easier time reaching that global minimum thus the learning rate will be better.

<img src="https://github.com/bjellesma/Notes/raw/master/Coursera/Machine-Learning-Specialization/image-49.png" alt="ReLU" style="max-width:100%; height:auto;">

### Linear Activation

Linear activation functions are what we're used to and are just

$$
z = \vec{w} \cdot \vec{x} + b
$$

### Choosing Activation Functions

- For hidden layers: ReLU is typically the best choice due to its computational efficiency and ability to handle gradients. It's also faster because if the output is negative, we can just write 0.
- For output layers:
  - Sigmoid for binary classification
  - Linear activation for regression tasks where our values can be positive or negative like predicting the stock market
  - ReLU is a solid choice if we know that our values can only ever be positive like predicting the price of a house

<img src="https://github.com/bjellesma/Notes/raw/master/Coursera/Machine-Learning-Specialization/image-48.png" alt="Choosing an activation" style="max-width:100%; height:auto;">

## Multiclass Classification with Softmax

While our previous post focused on binary classification, many real-world problems involve multiple classes. This is where the softmax function comes in.

The **softmax function** takes a vector of arbitrary real-valued scores and squashes it to a vector of values between 0 and 1 that sum to 1. This makes it perfect for multi-class classification where we want to interpret the outputs as probabilities.

<img src="https://github.com/bjellesma/Notes/raw/master/Coursera/Machine-Learning-Specialization/image-50.png" alt="Multiclass example" style="max-width:100%; height:auto;">

The softmax function is defined as:

$$ a_j = \frac{e^{z_j}}{\sum_{k=1}^{N} e^{z_k}} = P(y = j | \vec{x}) $$

where

$$
z_j = \vec{w}_j \cdot \vec{x} + b_j \quad j = 1, \dots, N
$$

Suppose we have 4 possible outputs, P1 through P4, using the softmas the probabilities for all of these will have to sum to 1. Below are examples of those 4. Notice the denominator is the same for all 4.

## $a_1 = \frac{e^{z_1}}{e^{z_1} + e^{z_2} + e^{z_3} + e^{z_4}} = P(y = 1 \mid \vec{x}) = 0.30$

## $a_2 = \frac{e^{z_2}}{e^{z_1} + e^{z_2} + e^{z_3} + e^{z_4}} = P(y = 2 \mid \vec{x}) = 0.20$

## $a_3 = \frac{e^{z_3}}{e^{z_1} + e^{z_2} + e^{z_3} + e^{z_4}} = P(y = 3 \mid \vec{x}) = 0.15$

## $a_4 = \frac{e^{z_4}}{e^{z_1} + e^{z_2} + e^{z_3} + e^{z_4}} = P(y = 4 \mid \vec{x}) = 0.35$

One important takeaway is that if we use a softmax regression model on only two possible outcomes, we arrive at the same answer as using the sigmoid. This means that logistic regression is really just a special case of softmax regression.

Switching over to the loss and cost function, this becomes a piecewise function now where we're taking -log for every a value that we compute using softmax regression

$$
loss(a_1, \dots, a_N, y) = 
\begin{cases} 
    -\log a_1 & \text{if } y = 1 \\
    -\log a_2 & \text{if } y = 2 \\
    \vdots & \\
    -\log a_N & \text{if } y = N
\end{cases}
$$

### Implementing Softmax in NumPy

Here's a simple implementation of the softmax function:

```python
def my_softmax(z):  
    a = np.zeros_like(z)
    n = len(z)
    for j in range(0,n):
        denominator = 0
        for k in range(0,n):
            denominator += np.exp(z[k])
        a[j] = np.exp(z[j])/denominator
    return a
```

### Softmax in TensorFlow

In TensorFlow, we can easily incorporate softmax into our model:

```python
model = Sequential(
    [ 
        Dense(25, activation = 'relu'),
        Dense(15, activation = 'relu'),
        Dense(4, activation = 'softmax') 
    ]
)
model.compile(
    loss=tf.keras.losses.SparseCategoricalCrossentropy(),
    optimizer=tf.keras.optimizers.Adam(0.001),
)

model.fit(
    X_train,y_train,
    epochs=10
)
```

Notice that we've now used [SparseCategoricalCrossentropy](https://www.tensorflow.org/api_docs/python/tf/keras/losses/SparseCategoricalCrossentropy) which we use for multiclass losses.

## Advanced Neural Network Concepts

### Adaptive Moment Estimation (Adam)

In our previous TensorFlow example, we used the Adam optimizer. **Adam** (Adaptive Moment Estimation) is an advanced optimization algorithm that adapts the learning rate for each parameter.

Adam keeps track of a moving average of past gradients to adjust its learning rate. This often leads to faster convergence and better performance across a wide range of tasks. This can also help to prevent overfitting.

### Convolutional Neural Networks (CNNs)

While we previously focused on dense (fully connected) layers, convolutional layers offer significant advantages for certain types of data, particularly in image processing tasks.

Convolutional layers work by having different neurons look at different parts of the input data. This approach has several advantages:
- Requires less training data
- Faster computation, as each neuron only processes a portion of the input
- Can capture spatial hierarchies in the data

Here's an example of how a CNN might be used to analyze EKG data for heart disease prediction:

<img src="https://github.com/bjellesma/Notes/raw/master/Coursera/Machine-Learning-Specialization/image-59.png" alt="CNN for EKG" style="max-width:100%; height:auto;">

*CNN architecture for EKG data analysis. This diagram shows a neural network with two convolutional hidden layers and a final output layer using the sigmoid activation function for binary classification of heart disease indicators.*

In this example:
1. The input EKG data is rotated 90 degrees.
2. The first convolutional layer has 9 units, each looking at a different window of the data.
3. The second convolutional layer has 3 units, each looking at a subset of the outputs from the first layer.
4. The final layer uses these processed features to make a prediction.

## Numerical Accuracy and Stability

When working with neural networks, especially deep ones, numerical accuracy becomes crucial. Roundoff errors due to how computers store floating-point numbers can accumulate over many computations.

To address this, particularly in large or deep models, we can use a technique called logits. Instead of applying the softmax activation in the output layer, we output raw scores (**logits**) by just specifying a linear function as the activation and apply softmax afterwards.

In TensorFlow, this looks like:

```python
model = Sequential(
    [ 
        Dense(25, activation = 'relu'),
        Dense(15, activation = 'relu'),
        Dense(4, activation = 'linear')   # Note: linear activation here
    ]
)
model.compile(
    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
    optimizer=tf.keras.optimizers.Adam(0.001),
)
```

When predicting, we then need to apply softmax separately:

```python
logits = model.predict(X_test)
probabilities = tf.nn.softmax(logits).numpy()
```

This approach can lead to more stable and accurate results, especially in deep networks.

## Multilabel Classification

While we've discussed binary and multiclass classification, there's another important type of classification task: multilabel classification. In **multilabel classification**, each input can be associated with multiple output labels simultaneously. For example, a movie can be both action and comedy. 

One way to deal with this is just to have multiple neural networks but this may or may not be viable depending on the number of labels.

### Understanding Multilabel Classification

In multilabel classification:
- Each sample can belong to more than one class
- The classes are not mutually exclusive
- The model needs to predict the presence or absence of multiple labels

A classic example of multilabel classification is image tagging. An image might contain multiple objects, and the model needs to identify all of them.

[IMAGE PLACEHOLDER: image-57.png]
*Figure 2: Illustration of multilabel classification. This image likely shows how a single input can be associated with multiple labels, contrasting with multiclass classification where each input belongs to only one class.*

### Example: Image Classification

Let's consider an example of multilabel classification for image recognition:

<img src="https://github.com/bjellesma/Notes/raw/master/Coursera/Machine-Learning-Specialization/image-55.png" alt="Multilabel" style="max-width:100%; height:auto;">

*Example of multilabel classification in image recognition. This image demonstrates how a single image might be classified with multiple labels such as "Car", "Bus", and "Pedestrian".*

In this example, the model needs to detect the presence of multiple objects in the image. Each output label (Car, Bus, Pedestrian) is treated as a separate binary classification problem.

### Neural Network Architecture for Multilabel Classification

For multilabel classification, we typically use a neural network with:
- As many output neurons as there are possible labels
- Sigmoid activation function in the output layer (instead of softmax)

<img src="https://github.com/bjellesma/Notes/raw/master/Coursera/Machine-Learning-Specialization/image-56.png" alt="Diagram example for multilabel" style="max-width:100%; height:auto;">

*Neural network structure for multilabel classification. This diagram shows how the output layer of a neural network is structured for multilabel classification, with each output unit corresponding to a different label.*

The key differences in the network architecture for multilabel classification are:

1. Output Layer: The number of neurons in the output layer equals the number of possible labels.
2. Activation Function: We use sigmoid activation for each output neuron instead of softmax. This allows each neuron to output a probability independently of the others.
3. Loss Function: Binary cross-entropy is typically used for each label, and the total loss is the sum of the individual losses.

### Quick Example of Multilabel Classification

Let's consider a practical example of multilabel classification using a movie genre prediction task. In this scenario, a movie can belong to multiple genres simultaneously (e.g., a film could be both "Action" and "Comedy").

Here's a simple implementation:

```python
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Sample data: movie features (e.g., keywords, runtime, release year)
X = np.array([
    [1, 120, 2020],
    [0, 90, 2019],
    [1, 110, 2021],
    [0, 100, 2018]
])

# Labels: each movie can belong to multiple genres
# Genres: Action, Comedy, Drama, Sci-Fi
y = np.array([
    [1, 1, 0, 0],  # Action and Comedy
    [0, 1, 1, 0],  # Comedy and Drama
    [1, 0, 0, 1],  # Action and Sci-Fi
    [0, 0, 1, 0]   # Only Drama
])

# Define the model
model = Sequential([
    Dense(8, activation='relu', input_shape=(3,)),
    Dense(4, activation='sigmoid')  # 4 output neurons for 4 genres
])

# Compile the model
model.compile(
    loss=tf.keras.losses.BinaryCrossentropy(),
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.01),
)

# Train the model
model.fit(X, y, epochs=100, verbose=0)

# Make predictions
new_movie = np.array([[1, 105, 2023]])  # New movie features
predictions = model.predict(new_movie)

print("Genre Predictions:")
genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi']
for genre, pred in zip(genres, predictions[0]):
    print(f"{genre}: {pred:.2f}")
```

In this example:

1. We have a dataset of movies, where each movie is represented by three features (e.g., a keyword indicator, runtime, and release year).
2. Each movie can belong to multiple genres (Action, Comedy, Drama, Sci-Fi).
3. We create a simple neural network with one hidden layer and an output layer with four neurons (one for each genre).
4. The model uses sigmoid activation in the output layer, allowing each neuron to output a probability independently.
5. We train the model on our sample data.
6. Finally, we use the trained model to predict the genres of a new movie.

The output might look something like this:

```
Genre Predictions:
Action: 0.72
Comedy: 0.31
Drama: 0.15
Sci-Fi: 0.58
```

This output indicates that the model predicts the new movie is likely to be an Action and Sci-Fi film, with a lower probability of being a Comedy, and unlikely to be a Drama.

This example demonstrates how multilabel classification allows a single input (a movie in this case) to be associated with multiple output labels (genres) simultaneously, each with its own probability.

## Conclusion

By building on our previous introduction to neural networks, we've now explored more advanced concepts like multiclass classification with softmax, the Adam optimizer, convolutional neural networks, and techniques for improving numerical stability.

These concepts form the foundation for many state-of-the-art neural network architectures used in industry today. As you continue your journey in deep learning, you'll find these concepts recurring and combining in novel ways to solve increasingly complex problems.

Remember, the field of neural networks and deep learning is vast and rapidly evolving. Keep experimenting, stay curious, and never stop learning!

