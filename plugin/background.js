const connectedPorts = {};

chrome.runtime.onConnect.addListener(function(port) {  
    if (port.name === `content`) {
        connectedPorts[port.sender.tab.id] = port;
        connectedPorts[port.sender.tab.id]['id'] = port.sender.tab.id;
        connectedPorts[port.sender.tab.id].postMessage({
            background: `It was connected as ${ port.sender.tab.id}`
        }) 
        connectedPorts[port.sender.tab.id].onMessage.addListener(function(msg, sender, sendResponse) {
            connectedPorts.devtools.postMessage(msg);
        })
    }
    if (port.name === 'devtools') {
        connectedPorts[port.name] = port;
        connectedPorts[port.name].postMessage({
            background: `It was connected as ${port.name}`
        }) 
        connectedPorts[port.name].onMessage.addListener(function(msg, sender, sendResponse) {
            console.log(msg);

            if (msg.route) {
                    connectedPorts[msg.route].postMessage(msg); 
                    return;
            }
        })

    }

    port.onDisconnect.addListener(function () {
        if (port.name === `content`) {
            delete connectedPorts[port.sender.tab.id];
        }
        if (port.name === 'devtools') {
            delete connectedPorts[port.name];
        }
    }); 

})
