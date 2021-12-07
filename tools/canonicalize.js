const ttl_read = require('@graphy/content.ttl.read');
const ttl_write = require('@graphy/content.ttl.write');
const dataset = require('@graphy/memory.dataset.fast');
const { once } = require('events');
const commander = require("commander");
const fs = require('fs');
const path = require('path');

main();
async function main() {
    // command line
    const program= new commander.Command();
    program
      .requiredOption("-i, --input <filename>", "Input file (*.ttl)")
      .requiredOption("-o, --output <filename>", "Output file (*.ttl)")
      .parse(process.argv);
    const options = program.opts();
    const stream = fs.createReadStream(path.resolve(__dirname, options.input));
    const outStreamPretty = fs.createWriteStream(path.resolve(__dirname, options.output));
    const myDataset = dataset();
    stream.pipe(ttl_read())
        .pipe(myDataset);
    await Promise.all([
        once(myDataset, 'finish'),
    ]);
    myDataset.canonicalize()
        .pipe(ttl_write())
        .pipe(outStreamPretty).on('end', () => {
            console.timeStamp('done');
            resolve();
        });
}
