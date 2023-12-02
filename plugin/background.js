const connectedPorts = {};

chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === 'content') {
        connectedPorts[port.name] = port;       
    }
    if (port.name === 'devtools') {
        connectedPorts[port.name] = port;
    }

    port.onDisconnect.addListener(function () {
        delete connectedPorts[port.name];
    }); 

    if (Object.hasOwn(connectedPorts, 'devtools') && Object.hasOwn(connectedPorts, 'content')) {
        connectedPorts.content.onMessage.addListener(function (msg) {
            if (msg.handshake) {
                connectedPorts.devtools.postMessage({
                    handshake: msg.handshake
                })
                return;
            }
            if (msg) {
                console.log('Background get from content:', msg);
                connectedPorts.devtools.postMessage(msg)
            }
            
        });

        connectedPorts.devtools.onMessage.addListener(function (msg) {
            if (msg.handshake) {
                connectedPorts.content.postMessage({
                    handshake: msg.handshake
                })
                return;
            }
            if (msg) {
                console.log('Background get from devtools:', msg);
                connectedPorts.content.postMessage(msg)
            }
        });
    }     
})
