import unidecode from "unidecode";
import * as tf from "@tensorflow/tfjs-node";
import * as fs from "fs";
import * as path from "path";
import { Data } from "./types";

/*
export type Data = {
  clean: string;
  dirty: [text: string, start: number, len: number][];
}
*/

const dataPath = path.join(__dirname, "data", "data.json");

async function main() {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8")) as Data[];

    const dirtyData = data.flatMap((d) => d.dirty);
    const inputData = dirtyData.map((d) => unidecode(d[0]).padEnd(128, " ")).map((d) =>
      d.split("").map((c) => c.charCodeAt(0))
    );
    const outputData = dirtyData.map((d) => [d[1], d[2]]);
    const input = tf.tensor2d(
      inputData,
      [inputData.length, 128]
    );
    const output = tf.tensor2d(
      outputData,
      [outputData.length, 2]
    );

    const model = tf.sequential();
    model.add(tf.layers.embedding({ inputDim: 256, outputDim: 128, inputLength: 128 }));
    model.add(tf.layers.lstm({ units: 128, activation: "relu" }));
    model.add(tf.layers.dense({ units: 2, activation: "linear" }));

    model.compile({
      loss: "meanSquaredError",
      optimizer: "adam",
    });

    await model.fit(input, output, {
      epochs: 100,
      batchSize: 32,
    });

    const sampleTitle = "Beyond Eternity (feat. Skye Light)";
    const sampleInput = sampleTitle.padEnd(128, " ").split("").map((c) => c.charCodeAt(0));
    const sampleTensor = tf.tensor2d([sampleInput], [1, 128]);

    const predictions = model.predict(sampleTensor) as tf.Tensor;
    predictions.print();
  } catch (error) {
    console.error("Error:", error);
  }
}

main();