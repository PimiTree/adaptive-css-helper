const connectedPortsObject = {};
const connectedPorts = new Proxy(connectedPortsObject, {
    set: (target, key, value, receiver) => {
        Reflect.set(target, key, value, receiver)
        console.log('changes was', target)
        return true;
    },
    get(target, key, receiver) {
        return Reflect.get(target, key, receiver);
    }
})
let isEnabled = true;

chrome.runtime.onConnect.addListener(function(port) {
    if (port.name === `content`) {
        connectedPorts[port.sender.tab.id] = port;
        connectedPorts[port.sender.tab.id]['id'] = port.sender.tab.id;

        const msg = {backgroundHandshake: `It was connected as ${ port.sender.tab.id}`}
        relativePostMessage(connectedPorts[port.sender.tab.id], msg);

        connectedPorts[port.sender.tab.id].onMessage.addListener(function(msg, sender, sendResponse) {
            console.log(`${port.sender.tab.id} msg at bg:`, msg);
            relativePostMessage(connectedPorts[`devtools${port.sender.tab.id}`], msg);
        })
    }
    if (port.name.includes('devtools')) {
        connectedPorts[port.name] = port;

        const msg = {
            backgroundHandshake: `It was connected as ${port.name}`
        };
        relativePostMessage(connectedPorts[port.name], msg);

        connectedPorts[port.name].onMessage.addListener(portOnMessageHandler(port));
        chrome.webNavigation.onCompleted.addListener(portOnCompleteHandler(port))
    }
    port.onDisconnect.addListener(function (port) {
        if (port.name === `content`) {
            delete connectedPorts[port.sender.tab.id];
            console.log('content port closed')
        }
        if (port.name.includes('devtools')) {
            delete connectedPorts[port.name]
            console.log('devtools closed')
        }
    });
    console.log('Ports', connectedPorts)
})

function portOnMessageHandler(port) {
    return (msg, sender, sendResponse) => {
        if (msg.getEnabledStatus) port.postMessage({enable: isEnabled});

        msg.route
            ? relativePostMessage(connectedPorts[msg.route], msg)
            : () => {throw 'Message to background must have "route" field'} ;
    }
}
function portOnCompleteHandler(port) {
    return (e) => {
        console.log('Some tab was reloaded...', e);

        const msg = {
            id: port.name,
            reset: true
        };
        try {
            relativePostMessage( connectedPorts[`devtools${e.tabId}`], msg);
        } catch(e) {}
    }
}
chrome.action.onClicked.addListener(function(e) {
    isEnabled = !isEnabled;

    Object.values(connectedPorts).forEach(port => {
        console.log(port);
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
