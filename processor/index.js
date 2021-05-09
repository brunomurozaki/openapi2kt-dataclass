import capitalize from '../utils/capitalize.js'

export default function parse2object(inputObject) {

    const schemaList = inputObject.components.schemas;

    var classes = {};

    for(var schemaName in schemaList) {

        var schemaObj = schemaList[schemaName]

        if(schemaObj.type != "object" && !schemaObj.enum) {
            console.error("Schema " + schemaName + " is not an Object nor ENUM!");
            continue;
        }

        initClass(classes, schemaName);
        classes[schemaName].fillClass(schemaObj);
    }

    return classes;
}

function initClass(classes, schemaName) {
    classes[schemaName] = {
        "name": schemaName,
        "properties": {},
        "innerClasses": {},
        "isEnum": false,
        "values": [],
        "fillClass": function(schemaObj) {
            
            if(schemaObj.type != "object" && schemaObj.enum) {
                this.isEnum = true;
                this.values = schemaObj.enum;
                return;
            }

            var properties = schemaObj.properties;

            for(var pName in properties) {
                var p = properties[pName];

                initProperty(this, this.properties, pName);
                this.properties[pName].fillProperty(p);

                if(schemaObj.required && schemaObj.required.includes(pName)) {
                    this.properties[pName].required = true;
                }
            }
        }
    }
}

function initProperty(parent, properties, propertyName) {
    properties[propertyName] = {
        "parent": parent,
        "name": propertyName,
        "type": "",
        "required": false,
        "fillProperty": function(pObj) {
            if(pObj.type == "object") {
                initClass(parent.innerClasses, this.name);
                parent.innerClasses[this.name].fillClass(pObj);
                this.type = capitalize(this.name);
            } else if(pObj.type == "array") {

                if(pObj.items.type == "object") {
                    initClass(parent.innerClasses, this.name);
                    parent.innerClasses[this.name].fillClass(pObj.items);
                    this.type = "List<" + capitalize(this.name) + ">";
                } else if(pObj.items.type === undefined && pObj.items["$ref"]) {
                    var ref = pObj.items["$ref"].split("/");
                    this.type = "List<" + ref[ref.length -1] + ">";    
                }
                else if(pObj.items.enum) {
                    initClass(parent.innerClasses, "Enum" + capitalize(this.name));
                    parent.innerClasses["Enum" + capitalize(this.name)].fillClass(pObj.items);
                    this.type = "List<Enum" + capitalize(this.name) + ">";
                }
                else {
                    this.type = "List<" + parseDataType(pObj.items, "List ->" + this.name) + ">";
                }

            } else if(pObj.type === undefined && pObj["$ref"]){
                var ref = pObj["$ref"].split("/");
                this.type = ref[ref.length -1];
            } 
            else {
                this.type = parseDataType(pObj, this.name);
            }
        }
    }
}

function parseDataType(pObj, pName) {

    var dataType
    switch(pObj.type) {
        case "string": {
            dataType = "String";
        }
        break;
        case "integer": {
            dataType = "Int";
        }
        break;
        case "number": {
            if(pObj.format == "double") {
                dataType = "Double"; 
            } else {
                dataType = "Int"; 
            }
        }
        break;
        case "boolean": {
            dataType = "Boolean";
        }
        break;
        default: {
            dataType = "Any";
            console.log(pName);
        }
            
    }

    if(dataType === undefined)
        console.log(pName);


    return dataType;
}