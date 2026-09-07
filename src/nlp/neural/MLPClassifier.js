/**
 * MLPClassifier.js - Multi-Layer Perceptron Neural Network for Text Classification
 * Implements Dense layers, ReLU activations, Softmax output, and Cross-Entropy loss.
 */

class MLPClassifier {
  constructor(inputDim, hiddenDim, outputDim, learningRate = 0.01) {
    this.lr = learningRate;
    this.inputDim = inputDim;
    this.hiddenDim = hiddenDim;
    this.outputDim = outputDim;

    // Xavier/Glorot weight initialization
    this.W1 = Array.from({ length: hiddenDim }, () =>
      new Float64Array(inputDim).map(() => (Math.random() - 0.5) * 2 * Math.sqrt(6 / (inputDim + hiddenDim)))
    );
    this.b1 = new Float64Array(hiddenDim);

    this.W2 = Array.from({ length: outputDim }, () =>
      new Float64Array(hiddenDim).map(() => (Math.random() - 0.5) * 2 * Math.sqrt(6 / (hiddenDim + outputDim)))
    );
    this.b2 = new Float64Array(outputDim);
  }

  static relu(x) {
    return Math.max(0, x);
  }

  static softmax(logits) {
    const maxLogit = Math.max(...logits);
    const exp = logits.map(l => Math.exp(l - maxLogit));
    const sumExp = exp.reduce((a, b) => a + b, 0);
    return exp.map(e => e / (sumExp || 1));
  }

  forward(x) {
    // Hidden layer
    const h = new Float64Array(this.hiddenDim);
    for (let i = 0; i < this.hiddenDim; i++) {
      let sum = this.b1[i];
      for (let j = 0; j < this.inputDim; j++) {
        sum += this.W1[i][j] * (x[j] || 0);
      }
      h[i] = MLPClassifier.relu(sum);
    }

    // Output logits
    const logits = new Float64Array(this.outputDim);
    for (let i = 0; i < this.outputDim; i++) {
      let sum = this.b2[i];
      for (let j = 0; j < this.hiddenDim; j++) {
        sum += this.W2[i][j] * h[j];
      }
      logits[i] = sum;
    }

    const probabilities = MLPClassifier.softmax(Array.from(logits));
    return { h, probabilities };
  }

  trainStep(x, targetClassIdx) {
    const { h, probabilities } = this.forward(x);

    // Output gradient (Softmax + Cross-Entropy)
    const dLogits = new Float64Array(this.outputDim);
    for (let i = 0; i < this.outputDim; i++) {
      dLogits[i] = probabilities[i] - (i === targetClassIdx ? 1.0 : 0.0);
    }

    // Backprop W2, b2
    const dH = new Float64Array(this.hiddenDim);
    for (let i = 0; i < this.outputDim; i++) {
      this.b2[i] -= this.lr * dLogits[i];
      for (let j = 0; j < this.hiddenDim; j++) {
        dH[j] += dLogits[i] * this.W2[i][j];
        this.W2[i][j] -= this.lr * dLogits[i] * h[j];
      }
    }

    // Backprop W1, b1 (ReLU derivative)
    for (let i = 0; i < this.hiddenDim; i++) {
      const reluGrad = h[i] > 0 ? 1 : 0;
      const grad = dH[i] * reluGrad;
      this.b1[i] -= this.lr * grad;
      for (let j = 0; j < this.inputDim; j++) {
        this.W1[i][j] -= this.lr * grad * (x[j] || 0);
      }
    }

    const loss = -Math.log(Math.max(1e-15, probabilities[targetClassIdx]));
    return loss;
  }
}

module.exports = MLPClassifier;
