var compiledTpl={};

function render(templateName,data){
    if((templateName in compiledTpl)==false){
        compiledTpl[templateName]=doT.template(document.getElementById(templateName).text);
    }
    return compiledTpl[templateName](data);
}