import { parseString } from 'xml2js';

export default function parseXML(rawText) {
  return new Promise((resolve, reject) => {
    parseString(rawText, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
