import capitalize from '../utils/capitalize.js'

export default function outputDataClass(ktClasses, outputFolder) {
    
    for(var ktClzz in ktClasses) {
        console.log(writeClass(ktClasses[ktClzz]));
    }
}

function writeClass(classObj) {

    var content = "data class " + capitalize(classObj.name) + " (\n";
    var properties = classObj.properties;

    content += writeProperties(properties);

    content += "\n)";

    if(classObj.innerClasses && Object.keys(classObj.innerClasses).length === 0 && classObj.innerClasses.constructor === Object) {
        return content;
    }

    content += "\n{\n";

    for(var inClzz in classObj.innerClasses) {
        content += writeClass(classObj.innerClasses[inClzz]) + ",";
    }

    content = content.slice(0, -1);

    content += "\n}\n";

    return content;
}

function writeProperties(properties) {

    var content = "";

    for(var p in properties) {
        content += "\n\tvar " + properties[p].name + ": " + properties[p].type + ",";
    }

    content = content.slice(0, -1);

    return content;
}