// chrome.devtools.panels.create("CAS", "128.png", "devTools/devPanel.html", function(CAS) {
//     // Panel creation callback

//     CAS.onShown.addListener(function(window) {
//         console.log(chrome.windows);
//         console.log(chrome.devtools);
//     });
// });

chrome.devtools.panels.elements.createSidebarPane("CAS", function(CAS) {
    // Panel creation callback
    CAS.setPage('devTools/dev_panel.html');
    CAS.setHeight('8ex');  
});




 


