import * as fs from "fs";
import * as path from "path";
import * as csv from "csv";
import type { Data } from "./types";

const playlistPath = path.join(__dirname, "data", "playlist.csv");
const dataPath = path.join(__dirname, "data", "data.json");

function randGenre(): string {
  const genres = [
    "Dubstep",
    "Trap",
    "Future Bass",
    "Drum & Bass",
    "House",
    "Electro",
    "Glitch Hop",
    "Drumstep",
    "Hard Dance",
    "Nu Disco",
    "Indie Dance",
    "Hardcore",
    "Trance",
    "Downtempo",
    "Chillout",
    "Ambient",
    "Future Garage",
    "Breaks",
    "Midtempo",
    "Neurofunk",
    "Liquid",
    "Techstep",
    "Jump Up",
    "Neurohop",
    "Neuro",
    "Phonk",
  ];

  return genres[Math.floor(Math.random() * genres.length)];
}

function dirtify(text: string, authors: string[]): Data["dirty"] {
  const len = text.length;

  const dirty: [string, number, number][] = [];

  let randAuthorLen = 0;

  function randAuthor() {
    return authors[Math.floor(Math.random() * authors.length)];
  }

  function sRandAuthor() {
    const author = randAuthor();
    randAuthorLen = author.length;
    return author;
  }

  function a(text: string, start: number) {
    dirty.push([text, start, len]);
  }

  a(text, 0);
  a(`${text} (feat. ${randAuthor()})`, 0);
  a(`${text} (ft. ${randAuthor()})`, 0);
  a(`${text} (with ${randAuthor()})`, 0);
  a(`${text} (${randAuthor()})`, 0);
  a(`${sRandAuthor()} - ${text} (${randAuthor()})`, randAuthorLen + 3);
  a(`${sRandAuthor()} | ${text} (${randAuthor()})`, randAuthorLen + 3);
  a(`${sRandAuthor()} - ${text} ${randAuthor()}`, randAuthorLen + 3);
  a(`${sRandAuthor()} | ${text} ${randAuthor()}`, randAuthorLen + 3);
  a(`${sRandAuthor()} - ${text} (ft. ${randAuthor()})`, randAuthorLen + 3);
  a(`${sRandAuthor()} | ${text} (ft. ${randAuthor()})`, randAuthorLen + 3);
  a(`${sRandAuthor()} - ${text} ft. ${randAuthor()}`, randAuthorLen + 3);
  a(`${sRandAuthor()} | ${text} ft. ${randAuthor()}`, randAuthorLen + 3);
  a(`${sRandAuthor()} - ${text} (feat. ${randAuthor()})`, randAuthorLen + 3);
  a(`${sRandAuthor()} | ${text} (feat. ${randAuthor()})`, randAuthorLen + 3);
  a(`${sRandAuthor()} - ${text} feat. ${randAuthor()}`, randAuthorLen + 3);
  a(`${sRandAuthor()} | ${text} feat. ${randAuthor()}`, randAuthorLen + 3);
  a(`${sRandAuthor()} - ${text} (with ${randAuthor()})`, randAuthorLen + 3);
  a(`${sRandAuthor()} | ${text} (with ${randAuthor()})`, randAuthorLen + 3);
  a(`${text} - ${randGenre()}`, 0);
  a(`${text} | ${randGenre()}`, 0);
  a(`${text} (${randGenre()} Remix)`, 0);
  a(`${text} (${randAuthor()} Remix)`, 0);
  a(`${text} - ${randAuthor()} Remix`, 0);
  a(`${text} | ${randAuthor()} Remix`, 0);
  a(`${text} - ${randAuthor()} ${randGenre()} Remix`, 0);
  a(`${text} | ${randAuthor()} ${randGenre()} Remix`, 0);

  return dirty;
}

async function prepare() {
  const dirty: Data[] = [];
  const authors: string[] = [];
  const parser = fs.createReadStream(playlistPath).pipe(csv.parse());

  for await (const record of parser) {
    const [_vidId, clean, author] = record;
    dirty.push({ clean, dirty: clean });
    authors.push(author);
  }

  dirty.forEach((d) => {
    d.dirty = dirtify(d.clean, authors);
  });

  fs.writeFileSync(dataPath, JSON.stringify(dirty, null, 0));

  console.log("Done!");

  const longestDirty = dirty.flatMap((d) => d.dirty).reduce((a, b) => (a[0].length > b[0].length ? a : b));

  console.log("Longest dirty:", longestDirty[0].length);
}

prepare();
