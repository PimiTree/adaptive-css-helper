(()=>{
    const calcButton = document.createElement('div');
    calcButton.classList.add('calcButton');
    calcButton.style.cssText = `
        position: fixed;
        bottom: 50px;
        right: 50px;
        background-color: #fff;
        z-index: 9999999;`
    calcButton.textContent = 'get sec object';
    document.body.append(calcButton);
    
    const resultWindow = document.createElement('div');
    calcButton.classList.add('resultWindow');
    resultWindow.style.cssText = `
        padding: 25px;
        position: fixed;
        top: 50px;
        let: 50px;
        background-color: #fff;
        z-index: 9999999;`
    document.body.append(resultWindow);

    const firstObj = {};
    const secObj = {};
    const deference = {};

    getSheetObject(firstObj);
    getViewPortDimension(firstObj);

    getSheetObject(secObj);
    getViewPortDimension(secObj);

    calcButton.onclick = () => {
        getSheetObject(secObj);
        getViewPortDimension(secObj);

        console.log(secObj);
        [...document.styleSheets[1].cssRules].forEach(rule => {
            console.log(rule.selectorText)
        });
        // getDeference(firstObj, secObj);
    };

    function createObjectFromDocumentStylsheet(sheet, finalObj) {
        sheet.forEach(style => {
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
        })
    }

    function getSheetObject(object) {
        const currentStylesheet = [...document.styleSheets[1].cssRules];

        createObjectFromDocumentStylsheet(currentStylesheet, object);
        getViewPortDimension(object);
    }
    function getDeference(initObj, currObj) {
        const keys = Object.keys(initObj);

        keys.forEach(key => {
            const init = initObj[`${key}`];
            const curr = currObj[`${key}`];

            init.forEach((prop, i)=> {
                if (prop[1] !== curr[i][1]) {
                    deference[`${key}`] ??= [];
                    if (key === 'viewPort' && prop[1] > curr[i][1]) {
                        deference[`${key}`][i] = [prop[0], prop[1]];
                    } else {
                        deference[`${key}`][i] = [curr[i][0], curr[i][1]];
                    }
                    deference[`${key}`] = deference[`${key}`].filter(item => item !== null && item !== undefined);
                }

            })

        })
        deference.mediaQuery = deference['viewPort'] ? [[`@media (${deference['viewPort'][0][0]}: ${deference['viewPort'][0][1]}px) {`],['}']] : null;
        createCssStyleText();
    }

    function getViewPortDimension(obj) {
        obj['viewPort'] = [['max-width', `${window.innerWidth}`], ['max-height', `${window.innerHeight}`]]
    }

    function createCssStyleText() {
        const keys = Object.keys(deference);
        deference.cssStyleText = ``;

        keys.forEach(prop => {
            if (prop.search(/[.:*]|(main)/) === -1) return;

            let ruleString = '';

            deference[`${prop}`].forEach(rule => {
                if (ruleString.indexOf(`${rule[0]}: ${rule[1]}`) !== - 1) return;
                ruleString +=
`   ${rule[0]}: ${rule[1]};
`
            })

            deference.cssStyleText +=
`   ${prop} {
        ${ruleString}
    }
`
        })

        deference.cssStyleText =
`
${deference.mediaQuery?.[0] ? deference.mediaQuery?.[0] : ''}
    ${deference.cssStyleText.trim()}
${deference.mediaQuery?.[1] ? deference.mediaQuery?.[1] : ''}
`
        resultWindow.innerHTML = `<pre>${deference.cssStyleText}</pre>`;
    }

    function createCssLock() {
        const a = `calc(${endPoint}rem + ${fontSizetMax - fontSizetMin} * (100vw - ${viewportMin}px) / ( ${viewportMax} - ${viewportMin}) * ${fontSizeInit()} / 16 );`
    }
    
   
    
    
    
    
})();