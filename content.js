'use strict';

var injectedKey = '__injected_' + chrome.runtime.id;

function renderTax(teams) {
    var elements = document.querySelectorAll('.ghx-heading');
    elements.forEach(el => {
        var teamTitle = el.firstChild.textContent;
        if (teams[teamTitle]) {
            var taxEl = document.createElement('span');
            taxEl.style = 'display: inline-block; margin-left: 10px;'
            taxEl.innerHTML = 'Tax: <span style="' + (teams[teamTitle][1] < 27 ? ' font-weight: bold; color: #f00;' : '') + '">' +
                              teams[teamTitle][1] +
                              ' %</span>';
            el.appendChild(taxEl);
        }
    });
}

if (!window[injectedKey]) {
    window[injectedKey] = true;

    chrome.runtime.sendMessage(null, 'getTaxData', {}, function (teams) {
        var root = document.getElementById('ghx-rabid');
        var config = {childList: true, subtree: true};
        var observer = new MutationObserver(mutations => {
            for (var mutation of mutations) {
                if (mutation.target && mutation.target.className === 'ghx-column') {
                    renderTax(teams);
                    observer.disconnect();
                    break;
                }
            }
        });
        observer.observe(root, config);

    });

}
