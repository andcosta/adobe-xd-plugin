/*
 * Sample plugin scaffolding for Adobe XD.
 *
 * Visit http://adobexdplatform.com/ for API docs and more sample code.
 */


 // https://adobexdplatform.com/plugin-docs/reference/scenegraph.html
const clipboard = require("clipboard");

// https://adobexdplatform.com/plugin-docs/reference/scenegraph.html
const { Artboard, Rectangle, Ellipse, Line, Path, Text, Color } = require("scenegraph");

// https://adobexdplatform.com/plugin-docs/reference/commands.html
const commands = require("commands"); 

// https://adobexdplatform.com/plugin-docs/reference/uxp/storage-index.html
// https://adobexdplatform.com/plugin-docs/reference/uxp/module/storage.html
const fs = require("uxp").storage.localFileSystem; 


const { alert, error } = require("./dialogs.js");



async function infoDocumentXD(selection, documentRoot) {

    console.log("documentRoot: ", documentRoot);
    console.log("selection.items: ", selection.items);
    console.log("\n");
    console.log("\n");

    documentRoot.children.forEach(node => {                             
        if (node instanceof Artboard) {                                  
            let artboard = node;

            console.log(`Nome da artboard: ${artboard.constructor.name}`);
            console.log(artboard);
            console.log(`A Artboard "${artboard.name}" possuir: ${artboard.children.length} elementos`);
            console.log("\n");

            const url = "https://dog.ceo/api/breeds/image/random"; 
            // const response = await fetch(url);
            
            fetch(url)                                   
            .then(response => {
                console.log(`response: ${ JSON.stringify(response.json()) }`);    
            })
            .catch(erro => {
                console.log(`erro: ${erro}`);      
            });

            artboard.children.forEach(childNode => {
                let children = childNode;

                if(children.name === 'teste 1') {
                    children.fill = new Color("blue");

                    console.log(`children.locked: ${children.locked}`)

                    // alert(`children.locked: ${children.locked}`);
                }

                console.log(children);
            });

            console.log("\n");

            

            // let rectangles = artboard.children.filter(artboardChild => {
            //     return artboardChild instanceof Rectangle;
            // })
            // rectangles.forEach(rectangle => {                           
            //     rectangle.fill = new Color("red");
            // })
        }
    })
}


async function createElements(selection, documentRoot) {
   
    const shape1 = new Rectangle();
    shape1.width = 100;
    shape1.height = 100;
    shape1.fill = new Color("#f00", .3);
    shape1.moveInParentCoordinates(20, 20);
    selection.insertionParent.addChild(shape1);
    
    const label1 = new Text();
    label1.text = "label 1!";
    label1.fontSize = 50;
    label1.styleRanges = [{
        fontSize: 12,
        fill: new Color("red"),
        length: label1.text.length
    }];
    label1.moveInParentCoordinates(100, 400);
    selection.insertionParent.addChild(label1);


    selection.items = [shape1, label1];
    commands.group();
    commands.alignRight();
    // let group = selection.items[0];

    // selection.items = [shape1, label1];
    // commands.createMaskGroup();
    // console.log(selection.items);  // [Group]
    


    // await info(selection, documentRoot);
}

async function fsReadHandler(selection, documentRoot) {
    const tempFolder = await fs.getTemporaryFolder();
    const developFolder = await fs.getPluginFolder();  // read-only access to the plugin's install folder
    const pluginSettingsFolder = await fs.getDataFolder();  // folder to store settings

    let userNameFile;

    // Ler aquivo
    try {
        userNameFile = await pluginSettingsFolder.getEntry("mock/user-name.txt");
        const userNameRead = await userNameFile.read();
        console.log(userNameRead);

        const userNameDevelopFolderFile = await developFolder.getEntry("mock/user-name.txt");
        const userNameDevelopFolderRead = await userNameDevelopFolderFile.read();
        console.log(userNameDevelopFolderRead);
    }
    catch(e) {
        console.log(`ERRO: ${e}`);
    }


    alert("Manipular arquivos",
        "<b>Info arquivos:</b>",
        "nome arquivo: "+ userNameFile.name +"<br />isFile: "+ userNameFile.isFile +"<br />isFolder: "+ userNameFile.isFolder,
        
        "<br />",
        "<b>tempFolder:</b>"+ tempFolder,
        "<b>developFolder:</b>"+ developFolder,
        "<b>pluginSettingsFolder:</b>"+ pluginSettingsFolder
    );
}


async function fsImportHandler(selection, documentRoot) {

    const pluginSettingsFolder = await fs.getDataFolder();  // folder to store settings
    
    let fileOpen;
    let fileOpenRead;

    // Ler aquivo do computador
    try {
        fileOpen = await fs.getFileForOpening();
        fileOpenRead = await fileOpen.read();
    }
    catch(e) {
        console.log(`ERRO: ${e}`);
    }


    alert("Importando arquivos",
        "<b>fileOpen:</b>"+ fileOpen,
        "<b>fileOpenRead:</b>"+ fileOpenRead
    );
}


async function fsSaveHandler(selection, documentRoot) {

    const pluginSettingsFolder = await fs.getDataFolder();  // folder to store settings
    
    let saveFile

    // Salvar aquivo
    try {
        saveFile = await fs.getFileForSaving("nome-do-arquivo.txt", { types: [ "txt" ]});

        await saveFile.write("It was a dark and stormy night");
    }
    catch(e) {
        console.log(`ERRO: ${e}`);
    }

    alert("Salvando arquivos",
        "<b>saveFile:</b>"+ saveFile
    );
}



/**
 * Show the about dialog
 */
function aboutPlugin() {
    alert("About React-native export",
        "Colorize Text is a plugin that provides several text colorizing utilities:",
        "• Gradient: applies a gradient between the first and last characters in a text node",
        "• Repeat: repeats a color pattern in a text node",
        "• Randomize: applies random colors to each character in a text node",
        "For more information, please see:",
        "https://github.com/AdobeXD/Plugin-Samples/tree/master/e2e-colorize-text"
    );
}


module.exports = {
    commands: {
        infoDocumentXD,
        createElements,
        fsReadHandler,
        fsImportHandler,
        fsSaveHandler,
        aboutPlugin
    }
};
