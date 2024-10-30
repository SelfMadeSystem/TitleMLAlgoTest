# Machine Learning title finder

This is a simple project that uses a machine learning model to predict the real title from a raw title. Example: `F.O.O.L & JNATHYN - Tension (Official Audio)` -> `Tension`.

## How to use

### Pre-requisites

- [bun](https://bun.sh)
- A CPU (hopefully you have one)

### Running

1. Clone the repository
2. Run `bun ./index.ts` in the terminal
3. Follow the instructions

## Built with

- [bun](https://bun.sh) - A simple and fast TypeScript runtime
- [TensorFlow.js](https://www.tensorflow.org/js) - A JavaScript library for training and deploying machine learning models in the browser and on Node.js (and subsequently bun)

## How it works

The model is a simple neural network with 3 layers. The input layer has 1 neuron for each character in the alphabet, the hidden layer has 128 neurons and the output layer has 1 neuron for each character in the alphabet. The model is trained with a dataset of 1000 titles and their respective real titles.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
