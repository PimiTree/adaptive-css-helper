const port = chrome.runtime.connect({ name: "content" });
const initObj = getSheetObject();

port.onMessage.addListener(function (msg) {
    msgLogger(msg);

    sendStyleSheet(msg, initObj);
})

// function block
function msgLogger(msg) {
    console.log('I got message:', msg);
}

const messageMap = {
    init(initObj) {
        return {
            type: 'init',
            obj: initObj,
            sheetPickerOptions: createSheetPickerOptions()
        }
    },
    curr() {
        return {
            type: 'curr',
            obj: getSheetObject()
        }
    }
}

function sendStyleSheet({getSheet}, initObj) {
    if (!getSheet) return;

    port.postMessage(
        messageMap[getSheet](initObj)
    );
}
function createSheetPickerOptions() {
    const pageSheets = [...document.styleSheets];

    let accumulator = '';

    pageSheets.forEach((sheet, i)=> {
        if(sheet.href === null || sheet.href.includes(window.location.origin)) {
            const fileName = sheet.href ? sheet.href.replace(/^https?\:(\/.+\/)/, '') : `file${i}`;

            accumulator = `${accumulator}\n<option value='${fileName}'>${fileName}</option>`;
        }

    })

    return accumulator;
}
function getSheetObject() {
    const pageSheets = [...document.styleSheets];

    const object = {}

    pageSheets.forEach((sheet, i) => {
        if ( sheet.href === null || sheet.href.includes(window.location.origin)) {
            const fileName = sheet.href
                                        ? sheet.href.replace(/^https?\:(\/.+\/)/, '')
                                        : `file${i}`;

            object[fileName] = {};
            createObjectFromDocumentStylsheet([...sheet.cssRules], object[fileName]);
        }
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
        // finalObj['viewPort'] = [['max-width', `${window.innerWidth}`], ['max-height', `${window.innerHeight}`]]
    }
}




