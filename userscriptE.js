// ==UserScript==
// @name         ErogameScape searx.perennialte.ch 検索ボタン追加+
// @namespace    https://erogamescape.dyndns.org/
// @version      2.2
// @description  ゲームタイトルをコピーし、searx.perennialte.chで攻略検索ボタンを追加
// @match        https://erogamescape.dyndns.org/*
// @match        https://erogamescape.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addSearchButtons() {
        let table = document.getElementById('basic_information_table');
        if (!table) return;

        let titleElement = document.querySelector('span.bold');
        if (!titleElement) return;

        let title = titleElement.textContent.trim(); // ゲームタイトルを取得

        let searchUrls = [
            { url: `https://searx.perennialte.ch/search?q=${encodeURIComponent(title)}+攻略`, label: '攻略' },
            { url: `https://searx.perennialte.ch/search?q=${encodeURIComponent(title)}+おすすめ攻略順`, label: '攻略順' },
            { url: `https://searx.perennialte.ch/search?q=${encodeURIComponent(title)}+聖地`, label: '聖地' }
        ];

        let downloadUrls = [
            { url: `https://sukebei.nyaa.si/?f=0&c=1_3&q=${encodeURIComponent(title)}`, label: 'torrent' },
            { url: `https://desonovel.vnlx.org/search?q=${encodeURIComponent(title)}`, label: 'DDL' }
        ];

        let vndbLink = document.querySelector('a[target="_blank"][href*="vndb.org"]');
        if (vndbLink) {
            searchUrls.push({ url: vndbLink.href, label: 'VNDB' });
        } else {
            searchUrls.push({ url: `https://vndb.org/v?sq=${encodeURIComponent(title)}`, label: 'VNDB' });
        }

        function createRow(title, links) {
            let newRow = document.createElement('tr');

            let headerCell = document.createElement('th');
            headerCell.textContent = title;
            headerCell.style.whiteSpace = 'nowrap';
            newRow.appendChild(headerCell);

            let dataCell = document.createElement('td');

            links.forEach(({ url, label }) => {
                let button = document.createElement('a');
                button.href = url;
                button.target = '_blank';
                button.textContent = label;
                button.style.marginRight = '5px';
                button.style.padding = '3px 5px';
                button.style.background = '#007bff';
                button.style.color = '#fff';
                button.style.borderRadius = '3px';
                button.style.textDecoration = 'none';
                button.style.fontSize = '10px';
                dataCell.appendChild(button);
            });

            newRow.appendChild(dataCell);

            let tbody = table.querySelector('tbody') || table; // `<tbody>` がない場合の対策
            let similarSearchRow = [...tbody.querySelectorAll('th')].find(th => th.textContent.includes('類似検索'));

            if (similarSearchRow) {
                tbody.insertBefore(newRow, similarSearchRow.parentNode);
            } else {
                tbody.appendChild(newRow);
            }
        }

        createRow('検索', searchUrls);
        createRow('DL', downloadUrls);
    }

    function fillSearchBoxAndSubmit() {
        let inputBox = document.getElementById('word');
        if (!inputBox) return;

        let titleElement = document.querySelector('span.bold');
        let title = titleElement ? titleElement.textContent.trim() : '';

        if (title) {
            inputBox.value = title; // ゲームタイトルを入力
            setTimeout(() => {
                let searchButton = document.querySelector('button[onclick="search()"]');
                if (searchButton) {
                    searchButton.click(); // 自動で検索ボタンをクリック
                }
            }, 500);
        }
    }

    function autoAcceptPopup() {
        let observer = new MutationObserver(() => {
            let alertButton = document.querySelector('button[onclick="ok()"]');
            if (alertButton) {
                alertButton.click(); // ポップアップのOKを自動クリック
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function autoConfirmDialog() {
        window.confirm = () => true; // 「OK」を自動選択
        window.onbeforeunload = null; // 離脱確認を無効化
    }

    if (window.location.href.includes('usersql_exec.php?sql_id=1734')) {
        window.addEventListener('load', () => {
            autoConfirmDialog(); // 自動でOKを押す
            fillSearchBoxAndSubmit();
            autoAcceptPopup();
        });
    } else {
        window.addEventListener('load', addSearchButtons);
    }
})();
