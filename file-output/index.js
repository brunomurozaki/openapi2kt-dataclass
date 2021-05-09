import capitalize from '../utils/capitalize.js'
import fs from 'fs'

export default function output2KtDataClass(ktClasses, outputFolder = "./output/", packageName = "default") {
    
    for(var ktClzz in ktClasses) {

        var content = "package " + packageName + "\n\n";

        if(ktClasses[ktClzz].isEnum) {
            content += writeEnum(ktClasses[ktClzz]);
        } else {
            content += writeClass(ktClasses[ktClzz]);
        }

        fs.writeFile(outputFolder + ktClzz + ".kt", content, function(err) {
            if(err)
                console.error(err);
        })
    }
}

function writeEnum(enumObj, numOfTabs = 0) {
    var tabs = "\t".repeat(numOfTabs);
    var content = tabs + "enum class " + capitalize(enumObj.name) + " {\n";

    for(var i = 0; i < enumObj.values.length; i++) {
        content += "\n" + tabs + "\t" + enumObj.values[i] + ","
    }

    content = content.slice(0, -1);
    content += "\n}";

    return content;
}

function writeClass(classObj, numOfTabs = 0) {

    var tabs = "\t".repeat(numOfTabs);
    var content = tabs + "data class " + capitalize(classObj.name) + " (\n";
    var properties = classObj.properties;

    content += writeProperties(properties, numOfTabs + 1);

    content += "\n" + tabs + ")";

    if(classObj.innerClasses && Object.keys(classObj.innerClasses).length === 0 && classObj.innerClasses.constructor === Object) {
        return content;
    }

    content += "\n" + tabs + "{\n";

    for(var inClzz in classObj.innerClasses) {
        content += writeClass(classObj.innerClasses[inClzz], numOfTabs + 1) + "\n";
    }

    content = content.slice(0, -1);

    content += "\n" + tabs + "}\n";

    return content;
}

function writeProperties(properties, numOfTabs = 0) {

    var content = "";
    var tabs = "\t".repeat(numOfTabs);
    var nullablePart = "?";

    for(var p in properties) {
        content += "\n" + tabs + "var " + properties[p].name + ": " + properties[p].type;
        
        if(!properties[p].required)
            content += nullablePart;

        content += ",";
    }

    content = content.slice(0, -1);

    return content;
}
