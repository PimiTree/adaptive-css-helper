(() => {

const extensionWindow = createView();
const calcButton = extensionWindow.querySelector('.calcButton');

// const initObj = {};
// const currObj = {};
// let deference = {};

// getSheetObject(initObj);

// calcButton.onclick = () => {
//     // deference = {};

//     getSheetObject(currObj);
//     getDeference(initObj, currObj, deference, false, [initObj.viewPort,  currObj.viewPort]);

//     deference['@media'] = {};

//     Object.keys(initObj['@media']).forEach(media => {
//         deference['@media'][`${media}`] = [];

//         getDeference(initObj['@media'][`${media}`], currObj['@media'][`${media}`], deference['@media'][`${media}`], true, [initObj.viewPort,  currObj.viewPort]);
//     })

//     createCssStyleText(deference);
// };

// initUIInteractions()

function initUIInteractions() {
    const dragable = extensionWindow.querySelector('.dragable');

    let isTouch;
    let prevY;
    let prevX;

    let initialY = 0;
    let initialX = 0;
    let currY = extensionWindow.getBoundingClientRect().y;
    let currX = extensionWindow.getBoundingClientRect().x;

    dragable.addEventListener('mousedown', dragInit);                      
    dragable.addEventListener('touchstart', dragInit, {'passive':true});
    dragable.addEventListener('mouseup', removeListeners);
    dragable.addEventListener('mouseout', removeListeners);
    dragable.addEventListener('touchend', removeListeners, {'passive':true});
}

function removeListeners() {
    dragable.removeEventListener('mousemove', draging);
    dragable.removeEventListener('touchmove', draging, {'passive':true} );
}

function dragInit(e) {
    isTouch = e.type === 'touchstart';
    initialY = isTouch ? e.touches[0].clientY : e.clientY;
    initialX = isTouch ? e.touches[0].clientX : e.clientX;

    prevY = currY;
    prevX = currX;

    const eventOptions = isTouch ? {'passive':true} : {'passive':false};
    dragable.addEventListener(isTouch ? 'touchmove' : 'mousemove', draging, eventOptions);
}

function draging(e)  {
    if (!isTouch) e.preventDefault();

    const deferenceY = initialY - (isTouch ? e.touches[0].clientY : e.clientY);
    const deferenceX = initialX - (isTouch ? e.touches[0].clientX : e.clientX);

    currY = prevY - deferenceY;
    currX = prevX- deferenceX;

    setExtensionWindowPosition();
}
function setExtensionWindowPosition() {
    extensionWindow.style.top = `${currY}px`;
    extensionWindow.style.left = `${currX}px`;
}

function getSheetObject(object) {
    const currentStylesheet = [...document.styleSheets[1].cssRules];

    createObjectFromDocumentStylsheet(currentStylesheet, object);
}

function createView() {
    const extensionWindow = document.createElement('div');
    extensionWindow.classList.add('adaptiveSuporterWindow');
    extensionWindow.innerHTML = 
    `
    <style>
    .adaptiveSuporterWindow {
        padding:  0 25px 25px;
        position: fixed;
        top: 0;
        left: 0;
        display: grid;
        grid-template: auto fit-content(100%) / auto;
        gap: 20px;
        width: 550px;
        height: 600px;
        resize: both;
        background-color: #F1F4F9;
        border-radius: 10px;
        overflow: hidden;
        z-index: 999999999;
    }
    .resultWindow {
        width: 100%;
        height: calc(100% - 25px);
        border-radius: 10px;
        background-color: #fff;
    }
    .calcButton {
       padding: 10px 0;
       background-color: #fff;
       border-radius: 10px;
    }
    .dragable {
        width: 100%;
        height: 25px;
        cursor: grab;
    }
    .top-container {
        display: flex;
        align-items: center;
    }
    .close-button {
        position: absolute;
        right: 0;
        top: 0;
        padding: 0 10px;
        width: 45px;
        height: 25px;
        cursor: pointer;
    }
    .hide {
        display: none;
    }
    </style>
    <svg class="close-button" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>
       
    <div class="extension-container">
        <div class="dragable"></div>
        <pre class="resultWindow"></pre>
        
    </div>
    <button class="calcButton">Calculate Deference</button>
        
    `
    document.body.append(extensionWindow);
    return extensionWindow;
}

function getDeference(initObj, currObj, lastobj, isMedia = false, viewPort) {
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
                    const cssLocksText = __insertCSSLock(key, array[i-shift][1], secArray[i][1], viewPort);
                    const isNeedCSSLocks = cssLocksText.length !== 0;

                    def[`${key}`] ??= [];    
                    def[`${key}`][i] =  [secArray[i][0], isNeedCSSLocks ? cssLocksText : secArray[i][1]];

                  
                    // def[`${key}`] = def[`${key}`].filter(item => item !== null && item !== undefined);
                }               
            })
        }
    })
    if (!isMedia) {
        lastobj.mediaQuery = lastobj['viewPort'] ? [[`@media (${lastobj['viewPort'][0][0]}: ${lastobj['viewPort'][0][1]}px) {`],['}']] : null;  
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
    console.log(parseInt(window.getComputedStyle(document.body).fontSize, 10)) 
    return px / parseInt(window.getComputedStyle(document.body).fontSize, 10);
}

function createObjectFromDocumentStylsheet(sheet, finalObj) {
    sheet.forEach(style => {
        if (style.cssText.includes('@font-face')) {
            return;                
        }

        if (style.selectorText !== undefined ) {
            finalObj[`${style.selectorText}`] = style.cssText
                .replace(`${style.selectorText} `, '')
                .replace(/[\{|\}|"|'|]+/g, '')
                .replace(/;\s+/g, ';')
                .trim()
                .split(';')
                .filter(arr => arr !== '')
                .map(arr => {
                    return arr.split(': ');
                });
        }
        
        if (style.cssText.includes('@media')) {
            if (finalObj['@media'] === undefined) finalObj['@media'] = {};
            if (finalObj['@media'][`${style.conditionText}`] === undefined) finalObj['@media'][`${style.conditionText}`] = [];

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

function createCssStyleText(deference) {
    const resultWindow = document.querySelector('.resultWindow')
    deference.cssStyleText = ``;

    assemblyCss(deference);
    assemblyMediaCss(deference['@media']);
    resultWindow.innerHTML = `${deference.cssStyleText}`;

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
            if (prop.search(/[.:*]|(main)/) === -1) return;
            
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

})()

