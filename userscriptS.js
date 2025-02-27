// ==UserScript==
// @name         ErogameScape 検索ボタン追加
// @namespace    https://kdroidwin.hatenablog.com
// @version      1.31
// @author       Kdroidwin
// @license      GPL-3.0 license
// @description  ゲームタイトルをコピーし、ゲームの攻略方法などをPriv.au で検索するボタンを追加
// @match        https://erogamescape.dyndns.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528212/ErogameScape%20%E6%A4%9C%E7%B4%A2%E3%83%9C%E3%82%BF%E3%83%B3%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/528212/ErogameScape%20%E6%A4%9C%E7%B4%A2%E3%83%9C%E3%82%BF%E3%83%B3%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSearchButtons() {
        let table = document.getElementById('basic_information_table');
        if (!table) return;

        let titleElement = document.querySelector('span.bold');
        if (!titleElement) return;
        let title = titleElement.textContent.trim();

        let searchUrls = [
            { url: `https://priv.au/search?q=${encodeURIComponent(title)}+攻略`, label: '攻略' },
            { url: `https://priv.au/search?q=${encodeURIComponent(title)}+おすすめ攻略順`, label: '攻略順' },
            { url: `https://priv.au/search?q=${encodeURIComponent(title)}+聖地`, label: '聖地' },
            { url: `https://priv.au/search?q=${encodeURIComponent(title)}+vndb`, label: 'vndb' },
            { url: `https://sukebei.nyaa.si/?f=0&c=1_3&q=${encodeURIComponent(title)}`, label: 'DL' }
        ];

        let newRow = document.createElement('tr');
        let headerCell = document.createElement('th');
        headerCell.textContent = '検索';
        headerCell.style.whiteSpace = 'nowrap';
        newRow.appendChild(headerCell);

        let dataCell = document.createElement('td');
        searchUrls.forEach(({ url, label }) => {
            let button = document.createElement('a');
            button.href = url;
            button.target = '_blank';
            button.textContent = label;
            button.style.marginRight = '10px';
            button.style.padding = '5px';
            button.style.background = '#007bff';
            button.style.color = '#fff';
            button.style.borderRadius = '5px';
            button.style.textDecoration = 'none';
            button.style.fontSize = '12px';
            dataCell.appendChild(button);
        });
        newRow.appendChild(dataCell);

        table.querySelector('tbody').appendChild(newRow);
    }

    window.addEventListener('load', addSearchButtons);
})();
