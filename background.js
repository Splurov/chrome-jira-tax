'use strict';

chrome.runtime.onMessage.addListener(function(message, _, sendResponse) {
    if (message === 'getTaxData') {
        fetch('http://tax.dev.pyn.ru/index.json').then(function(response) {
            return Promise.resolve(response.json());
        }).then(function(data) {
            sendResponse(data);
        }).catch(function(e) {
            console.error(e);
        });
    }
    return true;
});
