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


export default createCssStyleText;