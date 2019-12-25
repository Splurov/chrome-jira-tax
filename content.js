'use strict';

var injectedKey = '__injected_' + chrome.runtime.id;

function renderTax(teams) {
    var elements = document.querySelectorAll('.ghx-heading');
    elements.forEach(el => {
        var swimlaneTitle = el.firstChild.textContent;
        var team = teams.find((team) => swimlaneTitle.indexOf(team.name) !== -1);
        if (team) {
            var taxEl = document.createElement('span');
            taxEl.style = 'display: inline-block; margin-left: 10px;'
            taxEl.innerHTML = 'Tax: <span style="' + (team.warning_level ? ' font-weight: bold; color: #f00;' : '') + '">' + team.percent_tax + ' %</span>';
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
