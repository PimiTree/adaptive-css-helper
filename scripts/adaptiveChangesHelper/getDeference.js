function getDeference(initObj, currObj, lastobj, isMedia = false) {
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
                    def[`${key}`] ??= [];                  
                    def[`${key}`][i] =  [secArray[i][0], secArray[i][1]]
                    console.log(key, secArray[i][1])
                    // def[`${key}`] = def[`${key}`].filter(item => item !== null && item !== undefined);
                }
                
               
            })
        }
    })
    if (!isMedia) {
        lastobj.mediaQuery = lastobj['viewPort'] ? [[`@media (${lastobj['viewPort'][0][0]}: ${lastobj['viewPort'][0][1]}px) {`],['}']] : null;  
    }
     
}

export default getDeference;



