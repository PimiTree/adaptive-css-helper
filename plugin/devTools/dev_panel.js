// messaging
const port = chrome.runtime.connect({ name: `devtools${chrome.devtools.inspectedWindow.tabId}` });

port.name = `devtools${chrome.devtools.inspectedWindow.tabId}`;

// console.log(chrome.devtools.inspectedWindow.tabId)

port.onMessage.addListener(function(msg, sender, sendResponse) {
    console.log('dev_panel msg', msg)
    console.log('dev_panel sender', sender)
    if (msg.curr) {
        currObj = msg.curr;
        getDererence();
        console.log('currObkject',  currObj);
        return;
    }
    
    if (msg.init) {
        sheetPicker.innerHTML = msg.sheetPickeroptions;
        initObj = msg.init;
        console.log('initObkject',  initObj);
        return;
    }
    if(msg.reset && port.name == msg.id) {
        resetData();
        port.postMessage({ 
            route: chrome.devtools.inspectedWindow.tabId,
            getSheetObject: 'init' 
        });
        return;
    }

    if((msg.background)) {
        console.log(msg.background)
    }
})

port.postMessage({ handshake: "devtools" });
// messaging

// bussines logic
const calcButton = document.querySelector('.calcButton');
const resultWindow = document.querySelector('.resultWindow');
const sheetPicker = document.querySelector('.sheetPicker');
const tadIdContainer = document.querySelector('.tabId');
tadIdContainer.textContent = chrome.devtools.inspectedWindow.tabId;

let initObj = {};
let currObj = {};
let deference = {};
let sheets = [];

// get initObject
port.postMessage({ 
    route: chrome.devtools.inspectedWindow.tabId,
    getSheetObject: 'init' 
});


calcButton.onclick = () => {
    console.log(port.id);
    port.postMessage({ 
        route: chrome.devtools.inspectedWindow.tabId,
        getSheetObject: 'curr' 
    });
}
updateResultWindowText();

sheetPicker.onchange = () => {
    updateResultWindowText(); 
};


// bussines logic

// functions block;
function resetData() {
    resultWindow.innerHTML = '';
    sheetPicker.innerHTML = '';
    initObj = {};
    currObj = {};
    deference = {};
    sheets = [];
}
function createSheetPickerOptions() {
    const pageSheets = [...document.styleSheets];

    pageSheets.forEach(sheet => {
        const fileName = sheet.href.replace(/^https?\:(\/.+\/)/, '');

        sheetPicker.innerHTML = `${sheetPicker.innerHTML}<option value='${fileName}'>${fileName}</option>`;
    })   
}

function getDererence() {
    Object.keys(currObj).forEach(fileName => {
        deference[fileName] = {};
        getPartialDeference(initObj[fileName], currObj[fileName], deference[fileName], false, [initObj[fileName].viewPort,  currObj[fileName].viewPort]);
        
        deference[fileName]['@media'] = {};

        Object.keys(initObj[fileName]['@media'] || []).forEach(media => {
            deference[fileName]['@media'][`${media}`] = [];
    
            getPartialDeference(initObj[fileName]['@media'][`${media}`], currObj[fileName]['@media'][`${media}`], deference[fileName]['@media'][`${media}`], true, [initObj[fileName].viewPort,  currObj[fileName].viewPort]);
        })
        
        createCssStyleText(deference[fileName]);
        updateResultWindowText();
    })
}

function getPartialDeference(initObj, currObj, lastobj, isMedia = false, viewPort) {
    const keys = Object.keys(currObj);
   
    keys.forEach(key => {
        const init = initObj[`${key}`];
        const curr = currObj[`${key}`];
        
        if (Array.isArray(curr)) {
            arrayDeference(init, curr, lastobj)
        } 
        
        function arrayDeference(array, secArray, def) {
            let shift = 0;
            secArray.forEach((prop, i)=> {              
                if (secArray[i][0] !== array[i-shift]?.[0]) {
                    shift += 1;
                }
                
                if (secArray[i][1] !== array[i-shift]?.[1]) {
                    const cssLocksText = array[i-shift]?.[1] !== undefined ? __insertCSSLock(key, array[i-shift][1], secArray[i][1], viewPort) : false;

                    def[`${key}`] ??= [];    
                    def[`${key}`][i] =  [secArray[i][0], cssLocksText ? cssLocksText : secArray[i][1]];
                    def[`${key}`] = def[`${key}`].filter(item => item !== null && item !== undefined);
                }               
            })
        }
    })
    if (!isMedia) {
        lastobj.mediaQuery = lastobj['viewPort'] ? [[`@media (${lastobj['viewPort'][0][0]}: ${lastobj['viewPort'][0][1]}px) {`],['}']] : '';  
    }  
}

function  __insertCSSLock(param, before, after, viewPort) {
    const setOfBefore = before.split(' ');
    const setOfAfter = after.split(' ');

    let newAfter = '';

    setOfAfter.forEach((prop, i)=> {
        if (prop.includes('px')) {
            const viewportMax = viewPort[0][0][1] >= viewPort[1][0][1] ? viewPort[0][0][1] : viewPort[1][0][1];
            const viewportMin = viewPort[0][0][1] <= viewPort[1][0][1] ? viewPort[0][0][1] : viewPort[1][0][1];
            const initValue = parseInt(setOfBefore[i], 10);
            const currValue = parseInt(prop, 10);
    

            if (viewportMax !== viewportMin && currValue !== initValue) {
                const cssLock = createCssLock(currValue, initValue , viewportMax, viewportMin);
                newAfter += `${cssLock} `;
                return;
            }

            newAfter += `${prop} `;           
        }
    })

    return newAfter;
}

function createCssLock(itemDimensionMax, itemDimensionMin,  viewportMax, viewportMin) {
    const a = `calc(${__PXtoRem(itemDimensionMin)}rem + ${itemDimensionMax - itemDimensionMin} * (100vw - ${viewportMin}px) / ( ${viewportMax} - ${viewportMin}))`

    return a;
}

function __PXtoRem(px) {   
    return px / 16;
}


function createCssStyleText(deference) {
    deference.cssStyleText = '';

    assemblyCss(deference);
    assemblyMediaCss(deference['@media']);

    function assemblyCss(obj, isExistMedia = true) {
        const keys = Object.keys(obj);

        assemblyRules(keys, obj)
        
        if (isExistMedia) deference.cssStyleText =`${deference.mediaQuery?.[0] ? '//new mediaQuery\n' : ''}${deference.mediaQuery?.[0] ? deference.mediaQuery?.[0] + '\n' : ''}${deference.cssStyleText.trim()}\n${deference.mediaQuery?.[1] ? deference.mediaQuery?.[1] + '\n' : ''}`
    }
    function assemblyMediaCss(obj) {
        const mediaQuery = Object.keys(obj);
        
        let text = '';
        
        mediaQuery.forEach(query => {
            const mediaRules = Object.keys(obj[`${query}`]);

            if (mediaRules.length > 0) {
                text = `\n //changes in exist media \n@media ${query} {\n`;
                text += assemblyRules(mediaRules, obj[`${query}`], true)
                text += '\n}' 
                deference.cssStyleText += text
            }
        })
        
    } 


    function assemblyRules(keys, obj, isExistMedia = false) {
        let cssStyleText = ''
        
        keys.forEach(prop => {
            if (prop.search(/^[.:#[*a-zA-Z]{1}/) === -1) return;
            if (prop === 'cssStyleText') return;
            if (prop === 'mediaQuery') return;
            if (prop === 'viewPort') return;
            
            let ruleString = '';
            obj[`${prop}`].forEach(rule => {
                if (ruleString.indexOf(`${rule[0]}: ${rule[1]}`) !== - 1) return;
                ruleString +=`    ${rule[0]}: ${rule[1]};\n`})
    
            if (isExistMedia) cssStyleText +=`  ${prop} {\n    ${ruleString}\n    }`
            if(!isExistMedia) deference.cssStyleText +=`${prop} {\n${ruleString}\n}\n`
        })
        return cssStyleText;
    }   
}

function updateResultWindowText() {
    const has = Object.hasOwn(deference, sheetPicker.value);
    
    resultWindow.textContent = has ? deference[sheetPicker.value].cssStyleText : 'null';
}



