import jsonfile from 'jsonfile'
import parse2kt from './processor/index.js'
import outputDataClass from './file-output/index.js'

const args = process.argv.slice(2);
const inputFile = args[0];

jsonfile.readFile(inputFile, function (err, obj) {
    var ktClasses = parse2kt(obj);
    outputDataClass(ktClasses, "./output");
})