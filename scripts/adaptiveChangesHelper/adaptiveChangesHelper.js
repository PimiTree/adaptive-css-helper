import getDeference from "./getDeference.js";
import createObjectFromDocumentStylsheet from "./createObjectFromDocumentStylsheet.js";
import createView from "./view.js";
import createCssStyleText from "./createCssText.js"

window.addEventListener('DOMContentLoaded', () => {
    const calcButton = createView().querySelector('.calcButton');

    const initObj = {};
    const currObj = {};
    let deference = {};
    

    getSheetObject(initObj);


    calcButton.onclick = () => {
        // deference = {};

        getSheetObject(currObj);
        getDeference(initObj, currObj, deference, false, [initObj.viewPort,  currObj.viewPort]);

        deference['@media'] = {};

        Object.keys(initObj['@media']).forEach(media => {
            deference['@media'][`${media}`] = [];

            getDeference(initObj['@media'][`${media}`], currObj['@media'][`${media}`], deference['@media'][`${media}`], true, [initObj.viewPort,  currObj.viewPort]);
        })

        createCssStyleText(deference);
    };

    function getSheetObject(object) {
        const currentStylesheet = [...document.styleSheets[1].cssRules];

        createObjectFromDocumentStylsheet(currentStylesheet, object);
    }
})



