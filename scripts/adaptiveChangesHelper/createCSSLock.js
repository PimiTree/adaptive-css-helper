function createCssLock(itemDimensionMax, itemDimensionMin,  viewportMax, viewportMin) {
    const a = `calc(${__PXtoRem(itemDimensionMin)}rem + ${itemDimensionMax - itemDimensionMin} * (100vw - ${viewportMin}px) / ( ${viewportMax} - ${viewportMin}))`

    return a;
}

function __PXtoRem(px) {   
    console.log(parseInt(window.getComputedStyle(document.body).fontSize, 10)) 
    return px / parseInt(window.getComputedStyle(document.body).fontSize, 10);
}


export default createCssLock;