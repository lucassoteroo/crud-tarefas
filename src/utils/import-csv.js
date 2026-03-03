import fs from "node:fs";
import { parse } from "csv-parse";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const processFile = async () => {
    const records = []
    const filePath = join(__dirname, '..', 'tasks.csv');

    const parser = fs.createReadStream(filePath).pipe(
      parse({
        columns: true,
        skip_empty_lines: true
      }),
    );

    for await (const record of parser) {
      records.push(record);
    }

    return records
}

(async () => {
  const records = await processFile();
})();