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
}

export default createObjectFromDocumentStylsheet;