function createView() {
    const extensionWindow = document.createElement('div');
    extensionWindow.classList.add('adaptiveSuporterWindow');
    extensionWindow.innerHTML = 
    `
    <link rel="stylesheet" href="./scripts/popup.css">
    <pre class="resultWindow"></pre>
    <button class="calcButton">Calculate Deference</button>
        
    `
    document.body.append(extensionWindow);
    return extensionWindow;
}

export default createView;

