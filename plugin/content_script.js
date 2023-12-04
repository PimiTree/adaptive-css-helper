
// const initObj = {};  done
// const currObj = {};  done
// let deference = {};  done


// createSheetPickerOptions();  done

// getSheetObject(initObj);  done

// calcButton.onclick = () => {
//     getSheetObject(currObj);  done

//     Object.keys(currObj).forEach(fileName => {
//         deference[fileName] = {};
//         getDeference(initObj[fileName], currObj[fileName], deference[fileName], false, [initObj[fileName].viewPort,  currObj[fileName].viewPort]);
     
//         deference[fileName]['@media'] = {};

//         Object.keys(initObj[fileName]['@media'] || []).forEach(media => {
//             deference[fileName]['@media'][`${media}`] = [];
    
//             getDeference(initObj[fileName]['@media'][`${media}`], currObj[fileName]['@media'][`${media}`], deference[fileName]['@media'][`${media}`], true, [initObj[fileName].viewPort,  currObj[fileName].viewPort]);
//         })
    
//         createCssStyleText(deference[fileName]);
//         updateResultWindowText();
//     })

// };
// updateResultWindowText();
// chooseDeference();


// functions block;


// function chooseDeference() {
//     const sheetPicker =  extensionWindow.querySelector('.sheetPicker');
//     sheetPicker.onchange = () => {
//         updateResultWindowText();
        
//     };
// }

// function updateResultWindowText() {
//     const resultWindow = extensionWindow.querySelector('.resultWindow');
//     const sheetPicker =  extensionWindow.querySelector('.sheetPicker');

//     const has = Object.prototype.hasOwnProperty.call(deference, sheetPicker.value);

//     resultWindow.textContent = has ? deference[sheetPicker.value].cssStyleText : 'null';
// }



// function getDeference(initObj, currObj, lastobj, isMedia = false, viewPort) {
//     const keys = Object.keys(currObj);
   
//     keys.forEach(key => {
//         const init = initObj[`${key}`];
//         const curr = currObj[`${key}`];
        
//         if (Array.isArray(curr)) {
//             arrayDeference(init, curr, lastobj)
//         } 
        
//         function arrayDeference(array, secArray, def) {
//             let shift = 0;
//             secArray.forEach((prop, i)=> {              
//                 if (secArray[i][0] !== array[i-shift]?.[0]) {
//                     shift += 1;
//                 }
                
//                 if (secArray[i][1] !== array[i-shift]?.[1]) {
//                     const cssLocksText = array[i-shift]?.[1] !== undefined ? __insertCSSLock(key, array[i-shift][1], secArray[i][1], viewPort) : false;

//                     def[`${key}`] ??= [];    
//                     def[`${key}`][i] =  [secArray[i][0], cssLocksText ? cssLocksText : secArray[i][1]];
//                     def[`${key}`] = def[`${key}`].filter(item => item !== null && item !== undefined);
//                 }               
//             })
//         }
//     })
//     if (!isMedia) {
//         lastobj.mediaQuery = lastobj['viewPort'] ? [[`@media (${lastobj['viewPort'][0][0]}: ${lastobj['viewPort'][0][1]}px) {`],['}']] : '';  
//     }  
// }

// function  __insertCSSLock(param, before, after, viewPort) {
//     const setOfBefore = before.split(' ');
//     const setOfAfter = after.split(' ');

//     let newAfter = '';

//     setOfAfter.forEach((prop, i)=> {
//         if (prop.includes('px')) {
//             const viewportMax = viewPort[0][0][1] >= viewPort[1][0][1] ? viewPort[0][0][1] : viewPort[1][0][1];
//             const viewportMin = viewPort[0][0][1] <= viewPort[1][0][1] ? viewPort[0][0][1] : viewPort[1][0][1];
//             const initValue = parseInt(setOfBefore[i], 10);
//             const currValue = parseInt(prop, 10);
    

//             if (viewportMax !== viewportMin && currValue !== initValue) {
//                 const cssLock = createCssLock(currValue, initValue , viewportMax, viewportMin);
//                 newAfter += `${cssLock} `;
//                 return;
//             }

//             newAfter += `${prop} `;           
//         }
//     })

//     return newAfter;
// }

// function createCssLock(itemDimensionMax, itemDimensionMin,  viewportMax, viewportMin) {
//     const a = `calc(${__PXtoRem(itemDimensionMin)}rem + ${itemDimensionMax - itemDimensionMin} * (100vw - ${viewportMin}px) / ( ${viewportMax} - ${viewportMin}))`

//     return a;
// }

// function __PXtoRem(px) {   
//     return px / parseInt(window.getComputedStyle(document.body).fontSize, 10);
// }


// function createCssStyleText(deference) {
//     deference.cssStyleText = '';

//     assemblyCss(deference);
//     assemblyMediaCss(deference['@media']);

//     function assemblyCss(obj, isExistMedia = true) {
//         const keys = Object.keys(obj);

//         assemblyRules(keys, obj)
        
//         if (isExistMedia) deference.cssStyleText =`${deference.mediaQuery?.[0] ? '//new mediaQuery\n' : ''}${deference.mediaQuery?.[0] ? deference.mediaQuery?.[0] + '\n' : ''}${deference.cssStyleText.trim()}\n${deference.mediaQuery?.[1] ? deference.mediaQuery?.[1] + '\n' : ''}`
//     }
//     function assemblyMediaCss(obj) {
//         const mediaQuery = Object.keys(obj);
        
//         let text = '';
        
//         mediaQuery.forEach(query => {
//             const mediaRules = Object.keys(obj[`${query}`]);

//             if (mediaRules.length > 0) {
//                 text = `\n //changes in exist media \n@media ${query} {\n`;
//                 text += assemblyRules(mediaRules, obj[`${query}`], true)
//                 text += '\n}' 
//                 deference.cssStyleText += text
//             }
//         })
        
//     } 


//     function assemblyRules(keys, obj, isExistMedia = false) {
//         let cssStyleText = ''
        
//         keys.forEach(prop => {
//             if (prop.search(/^[.:#[*a-zA-Z]{1}/) === -1) return;
//             if (prop === 'cssStyleText') return;
//             if (prop === 'mediaQuery') return;
//             if (prop === 'viewPort') return;
            
//             let ruleString = '';
//             obj[`${prop}`].forEach(rule => {
//                 if (ruleString.indexOf(`${rule[0]}: ${rule[1]}`) !== - 1) return;
//                 ruleString +=`    ${rule[0]}: ${rule[1]};\n`})
    
//             if (isExistMedia) cssStyleText +=`  ${prop} {\n    ${ruleString}\n    }`
//             if(!isExistMedia) deference.cssStyleText +=`${prop} {\n${ruleString}\n}\n`
//         })
//         return cssStyleText;
//     }   
// }


// Create a connection to the service worker

const port = chrome.runtime.connect({ name: "content" });


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


// dev_panel mounted    71337
// content mounted      48487
// background mounted   48555

// second tab
// content mounted      889026
// dev_panel mounted    903555
// background mounted   748555




