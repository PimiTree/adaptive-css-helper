import getDeference from "./getDeference.js";
import createObjectFromDocumentStylsheet from "./createObjectFromDocumentStylsheet.js";
import createView from "./view.js";
import createCssStyleText from "./createCssText.js"

window.addEventListener('DOMContentLoaded', () => {
    const calcButton = createView().querySelector('.calcButton');

    console.log(document.styleSheets)

    const firstObj = {};
    const secObj = {};
    let deference = {};

    getSheetObject(firstObj);

    calcButton.onclick = () => {
        // deference = {};

        getSheetObject(secObj);

        getDeference(firstObj, secObj, deference);

        deference['@media'] = {};

        Object.keys(firstObj['@media']).forEach(media => {
            deference['@media'][`${media}`] = [];
            getDeference(firstObj['@media'][`${media}`], secObj['@media'][`${media}`], deference['@media'][`${media}`], true);
        })

        createCssStyleText(deference);
    };

    function getSheetObject(object) {
        const currentStylesheet = [...document.styleSheets[1].cssRules];

        createObjectFromDocumentStylsheet(currentStylesheet, object);
        getViewPortDimension(object);
    }
    
    function getViewPortDimension(obj) {
        obj['viewPort'] = [['max-width', `${window.innerWidth}`], ['max-height', `${window.innerHeight}`]]
    }

    function createCssLock() {
        const a = `calc(${endPoint}rem + ${fontSizetMax - fontSizetMin} * (100vw - ${viewportMin}px) / ( ${viewportMax} - ${viewportMin}) * ${fontSizeInit()} / 16 );`
    }

})



