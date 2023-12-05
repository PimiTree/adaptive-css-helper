const connectedPorts = {};
let isEnabled = true;


chrome.runtime.onConnect.addListener(function(port) {  
    if (port.name === `content`) {
        connectedPorts[port.sender.tab.id] = port;
        connectedPorts[port.sender.tab.id]['id'] = port.sender.tab.id;

        const msg = {background: `It was connected as ${ port.sender.tab.id}`}
        relativePostMessage(connectedPorts[port.sender.tab.id], msg);

        connectedPorts[port.sender.tab.id].onMessage.addListener(function(msg, sender, sendResponse) {
            console.log(`${port.sender.tab.id} msg at bg:`, msg);
            relativePostMessage(connectedPorts[`devtools${port.sender.tab.id}`], msg);
        })
    }
    if (port.name.includes('devtools')) {
        console.log(port);

        connectedPorts[port.name] = port;
        
        const msg = {
            background: `It was connected as ${port.name}`
        };
        relativePostMessage(connectedPorts[port.name], msg)
   
        connectedPorts[port.name].onMessage.addListener(function(msg, sender, sendResponse) {
            if (msg.getEnabledStatus) port.postMessage({enable: isEnabled});

            console.log('devtools msg at bg:', msg);

            msg.route 
                ? relativePostMessage(connectedPorts[msg.route], msg)
                : () => {throw 'Message to backgroud must have "route" field'} ;
        });

        chrome.webNavigation.onCompleted.addListener(function(e) {
            console.log('Some tab was reloaded...', e);

            const msg = {
                id: port.name,
                reset: true
            };
            try {
                relativePostMessage( connectedPorts[`devtools${e.tabId}`], msg); 
            } catch(e) {}
                       
        })
    }

    port.onDisconnect.addListener(function () {
        if (port.name === `content`) {
            connectedPorts[port.sender.tab.id] = {};
        }    
        if (port.name === `devtools`) {
            console.log('devtools closed')
        }
    }); 

})


chrome.action.onClicked.addListener(function(e) {
    isEnabled = !isEnabled;

    Object.values(connectedPorts).forEach(port => {
        port.postMessage({
            enable: isEnabled
        })
    })

    isEnabled 
        ? chrome.action.setIcon({path: {"48": "icons/48.png"}})
        : chrome.action.setIcon({path: {"48": "icons/grayscale/48.png"}});
})



function relativePostMessage(port, msgObj) {
    if (isEnabled) port.postMessage(msgObj);
}
