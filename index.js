import jsonfile from 'jsonfile'
import parse2object from './processor/index.js'
import output2KtDataClass from './file-output/index.js'

const args = process.argv.slice(2);
const inputFile = args[0];

jsonfile.readFile(inputFile, function (err, obj) {
    var ktClasses = parse2object(obj);
    output2KtDataClass(ktClasses, "./output/");
})