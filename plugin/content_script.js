// Create a connection to the service worker
const port = chrome.runtime.connect({ name: "content" });

// messging
port.onMessage.addListener(function (msg) {
    console.log('I got message:', msg);

    if(msg.getSheetObject === 'curr') {
        console.log('get curr obj at:', msg.route);

        port.postMessage({
            [msg.getSheetObject]: getSheetObject()
        })
        return;
    }
    
    if(msg.getSheetObject === 'init') {
        console.log('get init obj at:', msg.route);
        port.postMessage({
            sheetPickeroptions: createSheetPickerOptions(),
            [msg.getSheetObject]: getSheetObject()
        })

        return;
    }

    if (msg.background) {
        console.log(msg.background)
    }
})

// function block
function createSheetPickerOptions() {
    const pageSheets = [...document.styleSheets];

    let accumulator = '';
    pageSheets.forEach((sheet, i)=> {
        const fileName = sheet.href ? sheet.href.replace(/^https?\:(\/.+\/)/, '') : `file${i}`;

        accumulator = `${accumulator}\n<option value='${fileName}'>${fileName}</option>`;
    })   

    return accumulator;
}

function getSheetObject() {
    const pageSheets = [...document.styleSheets];

    const object = {}

    pageSheets.forEach((sheet, i) => {
        const fileName = sheet.href ? sheet.href.replace(/^https?\:(\/.+\/)/, '') : `file${i}`;

        object[fileName] = {};
        createObjectFromDocumentStylsheet([...sheet.cssRules], object[fileName]);
    })
   
    return object;

    function createObjectFromDocumentStylsheet(sheet, finalObj) {
        sheet.forEach(style => {
            if (style.cssText.includes('@font-face')) {
                return;                
            }
    
            if (style.selectorText !== undefined ) {
                const separetion = finalObj[`${style.selectorText}`]?.length ? finalObj[`${style.selectorText}`] : []
    
                finalObj[`${style.selectorText}`] = [...style.cssText
                    .replace(`${style.selectorText} `, '')
                    .replace(/[\{|\}|"|'|]+/g, '')
                    .replace(/;\s+/g, ';')
                    .trim()
                    .split(';')
                    .filter(arr => arr !== '')
                    .map(arr => {
                        return arr.split(': ');
                    }), ...separetion];
            }
                
            if (style.cssText.includes('@media')) {
                if (finalObj['@media'] === undefined) finalObj['@media'] = {};
                if (finalObj['@media'][`${style.conditionText}`] === undefined) finalObj['@media'][`${style.conditionText}`] = {};
    
                Object.values(style.cssRules).forEach( rule => {
                    finalObj['@media']
                            [`${style.conditionText}`]
                            [`${rule.selectorText}`] = rule.cssText
                                                            .replace(`${rule.selectorText} `, '')
                                                            .replace(/[\{|\}|"|'|]+/g, '')
                                                            .replace(/;\s+/g, ';')
                                                            .trim()
                                                            .split(';')
                                                            .filter(arr => arr !== '')
                                                            .map(arr => {
                                                                return arr.split(': ');
                                                            });
                
                })                    
            }
            
        })
        finalObj['viewPort'] = [['max-width', `${window.innerWidth}`], ['max-height', `${window.innerHeight}`]]
    }
}




