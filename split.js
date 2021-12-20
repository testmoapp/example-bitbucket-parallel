const glob = require('glob');

if (!process.env.BITBUCKET_PARALLEL_STEP_COUNT) {
    console.error('No envrionment variable BITBUCKET_PARALLEL_STEP_COUNT defined');
    process.exit(1);
}

if (!process.env.BITBUCKET_PARALLEL_STEP) {
    console.error('No envrionment variable BITBUCKET_PARALLEL_STEP defined');
    process.exit(1);
}

function splitChunks(items, total) {
    let chunks = [];

    let currentChunk = 0;
    for (let currentItem = 0; currentItem < items.length; currentItem++) {
        if (!chunks[currentChunk]) {
            chunks[currentChunk] = [];
        }

        chunks[currentChunk].push(items[currentItem]);

        currentChunk++;
        if (currentChunk >= total) {
            currentChunk = 0;
        }
    }

    return chunks;
}

const files = glob.sync('tests/**/*.js');
const chunks = splitChunks(files, process.env.BITBUCKET_PARALLEL_STEP_COUNT);

if (chunks[process.env.BITBUCKET_PARALLEL_STEP]) {
    for (file of chunks[process.env.BITBUCKET_PARALLEL_STEP]) {
        process.stdout.write(file + "\n");
    }
}
