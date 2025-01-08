// ==UserScript==
// @name         Discogs Catalog Tracker
// @namespace    http://tampermonkey.net/
// @version      2025-01-01
// @description  Keep track of releases you visit on Discogs label pages.
// @author       splatert
// @match        https://www.discogs.com/release/*
// @match        https://www.discogs.com/master/*
// @match        https://www.discogs.com/label/*
// @match        https://www.discogs.com/artist/*
// @match        https://www.discogs.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discogs.com
// @grant        none
// ==/UserScript==


var scriptLoadTime = 2; // in seconds.



var pageType = null;
var changesWereMade = false;


// related to local storage
var history = [];
var historyLoaded = false;



// HTML dom elements
var catalogItemDom = 'title_oY1q1';
var catalogItemDomLink = 'link_1ctor';
var otherVersions = 'versions_1t0s2';
var filterBtn = 'filterButtonContainer_29Eug';
var searchSortTop = 'sort_top';
var pagerDiv = '_pager_14baz_1';
var paginationDiv2 = 'paginationContainer_eb72D';


var greyBtn = `
    display: inline-block !important;
    padding: 3px !important;
    color: #333;
    border: 2px solid #d5d5d5 !important;
    background: linear-gradient(#f2f2f2,#eaeaea);
    cursor: pointer;
`;

var redBtn = 'button-red';


// images
var imgVisited = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/wgALCAAQACEBASIA/8QAGAABAQADAAAAAAAAAAAAAAAABgEAAgP/2gAIAQEAAAABWWwyi5Zuf//EABoQAAIDAQEAAAAAAAAAAAAAAAABAgMTERL/2gAIAQEAAQUC7BR7UhOpjdantadrHmyWUj1D1jaf/8QAJhAAAQMBBgcBAAAAAAAAAAAAAgABERIDITEzQZEjMkJRcYGh8P/aAAgBAQAGPwJ5HAanWAzfdcunmp9pggZd8FmHugqMWcdJTs1uEPP1Zwa6903Gs6WKY/eVlnsv/8QAIBAAAgICAQUBAAAAAAAAAAAAAREAITFBkVFxsdHx8P/aAAgBAQABPyFyESMizn1C40msxT9QQ0FrLbEDIqhoxROJ9LCcbMEL7cgcRADAJsM2PXT/ADggoV5akyCiNwBzwuDZe34T6Wf/2gAIAQEAAAAQcD//xAAfEAEBAQACAQUBAAAAAAAAAAABESEAMUFRgZHB8GH/2gAIAQEAAT8QInPqoTye3ffqcMIABgDCmzy7STZGM08gJYR7mUO4nGMMBj2PbwHvz9/98zxcKYjRSI/4dLwwRooCIXMRTLjEEcmACZikqZxmyYi7xIIbVo2OMq+B/eft/rn/2Q==';
var warning = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAACIlBMVEVHcEyngwCklk8AAAAAAAAAAACnfwAAAAAAAAAAAACnggCkmE8AAACklU8AAAAAAAAAAAAAAAAAAACmfQByWACkmFHetQAAAADevA/7zQByYxv7zACklEaelVcAAAChdwD87I0AAAAAAAAAAAAAAADy6bAAAABYUzHYz5kAAABQOQAAAAAAAADWnwD1uAAAAAAAAAD+ywD6yQD931f931b7vgD+wAAAAAD/ywD/xQD/zgD/1Qr/zwD/0QD0ygD/zAD/1AD0xAD/0wD/0gr0xwD0wgD/2Ar/1gD/zwr0zQD/1wD/ygD/2wr/2AD/yAD/zQr00AD/2gD/xwD0vwD/2wD/3Ar/ygr/yAr/wwD/3AD00QD0vAD01AD/3gD0ugD/wgD/////3QD/3gr/6W//4Qr/3wD/xgsBAQH/52//3zH/4AD01QD/wQD/yQD6xwD7wQD6xAD/xgD65G3/40L/4TH/4UL65W364m37vwD/4zH/3jH/6m/00i//5nH/5W//4EL/3DEbGxv/53H/5DH01S//6nH/6XH64Gz/0QL/5W7z2S//4jH01i//2zH1xwD/63L/1yP30zn/3Dzz2jP/3UL/5kI0MjD/xAD75nAgICD/7sH/5TVeUSn87cb/5zr/6mL/5Sz/62dJRz9hXE6nhhU7OjZXTC7otgD3uwD1uQCUeB99dVmUiF+iklzbrwb/44RqZVOWiVtzbVVSUEb/5I2Fe1mT59QoAAAAN3RSTlMAv74OEwG/UgUDv75RvjBphycGwKi+42Dj+6j7vrs2w/xPM3Qp9H+g3WOzNFbl95qE/v7+/v7+pcTqIQAAAdVJREFUOMtjYCAJqGiqqWmq4JZXVNdQVdVQV8Qhzckuq7Bwwbz5CrLsnNjlRWfMzs7KzprcL4pNBSc7d/XU1BQQbG7lxlQBlC+rjImFwK5kDBWc7EzJxYlJieZAkJSY1N3GhKoCKF9UEhUZFQlSAKJ7klFUAOUzSkNCgRCkAESHZjYhqeBk5y3PDAgEQZACCKslgxemAihfV+/rA4bp5ubpEJZPVS1MBY9Me4OnFwTONDdvhLFrOmV4QPJ8UiZT3N2gcKm5+TQY263XWIoPqIBfYpKdAwxuNjdfhOBNlOAHKhCQtLZ2gsEN5uaLEbwJkgIgBdK2LnC42tx8E4LXJw1SwC9m4wyHa8zNtyJ4HWIgK/hEDB2tYHCtuflGBM9IhA/sTUYrew8oXJ+QsMUDzmMEe5OBg53RwhULzGNk52CAq/D2B8N15ubL/aFsuDxIBZdfMBiuMjdfAmEVcCHkwSpyg8KAcJm5+ZwwMAtFHqSCzTIaCOcmJMwC0flsqPJgFYWW4XCIIQ9WEREHhRVY5BkYhNiFp8engaEwuxCmPCsHi7i82YqclTmm8uIsHKyYCpgF5ZS1dPX0dLWU5QSZsSpQ0tYx0Nc30NFWwqqAg5kFDpgRVgAAsyShXtDBMjYAAAAASUVORK5CYII=';
var proj = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA1UlEQVQ4y7XTMUpDQRSF4U98kFokamEnuAFtJXXcgavIErIAd5I9CNpHIQt4qaIgYvVQEERtjqJDHIjE082c/1zmztxhjRqjwxyDJf4gXhf2h47RYhenAUvNMQzTJqOJ2ccC97jOulQfN2EWJdPDFFepPv6lxTbMNBllkQuMKvc0CvMVbr6ZL3jEXaXAHmZhwUYBTPCGd2wW3hYOcILbZSf41CHO8VrsP+ESz7VZmOBsleFpikvcxs5fprCX9689Y1XDhGXSulVbeMB+wkdZr/0z/Y8+ACw6L6uTqqIrAAAAAElFTkSuQmCC';


// colors
var blue = '#2653d9';


function about(){
    console.log('Discogs Catalog Tracker');
}




function loadItems(){

    var items = localStorage.getItem('ctracker-items');
    
    if (items == null || items == '') {
        items = '[]';
    }

    history = JSON.parse(items);


    console.log('ctracker | Loading discogs history...');
    console.log(history);

    historyLoaded = true;
}


function saveItems() {
    var items = JSON.stringify(history);
    localStorage.setItem('ctracker-items', items);

    changesWereMade = false;
    console.log('ctracker | Saved discogs history.');
}


function pageIsInHistory(url) {
    if (historyLoaded) {

        if (url) {
            var encodedURL = encodeURIComponent(url);

            if (history.includes(encodedURL)) {
                return true;
            }
            else {
                return false;
            }

        }

    }
    else {
        console.log('ctracker | Please load data first.');
        return 'err-notloaded';
    }
}




function exportHistory() {
    var fileContent = JSON.stringify(history);
    var myFile = new Blob([fileContent], {type: 'text/plain'});
    var downloadUrl = window.URL.createObjectURL(myFile);
    window.open(downloadUrl);
}



function addItemToHistory(url) {
    if (historyLoaded) {
        var encodedURL = encodeURIComponent(url);
        if (!history.includes(encodedURL)) {
            history[history.length] = encodedURL;
            console.log('ctracker | Added -> ' + encodedURL);
            console.log(history);
        }
        else {
            console.log('ctracker | Item already exists. Skipping...');
        }
    }
}



function removeItemFromHistory(url) {
    if (historyLoaded) {
        var encodedURL = encodeURIComponent(url);
        if (history.includes(encodedURL)) {

            console.log('ctracker | Item found. Removing...');

            for (let i=0; i<history.length; i++) {
                if (history[i] == encodedURL) {
                    history.splice(i, 1);
                    console.log('ctracker | Item has been removed.');
                    console.log(history);
                }
            }

            changesWereMade = true;
        }
    }
}




function ctrackerMsg(msg) {
    var warningText = document.getElementsByClassName('ctracker-msg')[0];
    if (warningText) {
        warningText.style.display = 'block';
        warningText.lastElementChild.innerText = msg;
    }
}



function createSettingsWindow() {

    var winContainer = document.createElement('div');
    winContainer.style.position = 'fixed';
    winContainer.style.top = '0'; winContainer.style.left = '0';
    winContainer.style.width = '100%'; winContainer.style.height = '100%';
    winContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.55)';
    winContainer.style.zIndex = '998';

    var win = document.createElement('div');
    win.style.margin = '14% auto'; win.style.padding = '10px';
    win.style.width = '50%'
    win.style.backgroundColor = 'white'; win.style.boxShadow = '0px 1px 3px black';


    var srcLink = document.createElement('a');
    srcLink.href = "https://github.com/splatert/Discogs-Catalog-Tracker";
    srcLink.target = "_blank";
    srcLink.style.display = 'block';
    srcLink.style.float = 'right';
    srcLink.style.fontWeight = 'bold';
    srcLink.style.fontSize = '18px';

    srcLink.innerHTML = '<img style="position:relative;top:1.6px;filter: brightness(0) saturate(100%) invert(21%) sepia(92%) saturate(3344%) hue-rotate(223deg) brightness(93%) contrast(81%);" src="'+proj+'">';
    

    var closeBtn = document.createElement('a');
    closeBtn.innerText = 'X';
    closeBtn.href = '#';
    closeBtn.style.marginLeft = '15px';
    closeBtn.style.display = 'block';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.fontSize = '18px';
    closeBtn.style.color = blue;
    closeBtn.style.float = 'right';

    closeBtn.onclick = function(){
        if (winContainer) {
            winContainer.remove();
            if (changesWereMade) {
                saveItems();
            }
        }
    }

    win.appendChild(closeBtn);
    win.appendChild(srcLink);


    var winTitle = document.createElement('span');
    winTitle.innerText = 'Discogs Catalog Tracker';
    winTitle.style.width = '100%'; winTitle.style.display = 'block';
    winTitle.style.fontSize = '16px'; winTitle.style.fontWeight = 'bold';

    var warningText = document.createElement('div');
    warningText.className = 'ctracker-msg';
    warningText.innerHTML = '<img src="'+warning+'"><span style="position:relative;bottom:10px;margin-left:5px;">Warning text.</span>';
    warningText.style.display = 'none';

    var br = document.createElement('br');

    var categoryTitle1 = document.createElement('span');
    categoryTitle1.innerText = 'Release history';
    categoryTitle1.style.width = '100%';

    var ht_container = document.createElement('div');
    ht_container.style.overflowY = 'Scroll';
    ht_container.style.maxHeight = '275px';
    
    var historyTable = document.createElement('table');
    historyTable.className = 'ctracker-historyTable';
    historyTable.style.borderColor = '#ccc';
    historyTable.style.width = '100%';

    var ht_body = document.createElement('tbody');


    var tr = document.createElement('tr');
    var td = document.createElement('td');

    var td1 = td.cloneNode(true);
    td1.innerText = 'URL';

    var td2 = td.cloneNode(true);
    td2.innerText = 'Delete';
    td2.style.width = '75px;';

    td1.style.backgroundColor = '#eee';
    td1.style.borderBottom = '1px gray';
    td2.style.backgroundColor = '#eee';
    td2.style.borderBottom = '1px gray';

    historyTable.appendChild(ht_body);
    ht_body.appendChild(tr);
    ht_container.appendChild(historyTable);

    tr.appendChild(td1);
    tr.appendChild(td2);
    
    win.appendChild(winTitle);
    win.appendChild(warningText);

    var saveOptions = document.createElement('div');
    saveOptions.style.display = "flex";
    saveOptions.style.marginTop = "15px";
  

    saveOptions.innerHTML = `
    <br>
        <input id="ctracker-importHis" type="file" style="display:none;">
        <label for="ctracker-importHis" style="`+greyBtn+` margin-right: 5px;" class="ctracker-importHistory">Import History</label>

        <span style="`+greyBtn+` margin-right: 5px;" class="ctracker-exportHistory">Export History</span>
        <span style="`+greyBtn+` margin-right: 5px;" class="ctracker-clearHistory" style="color:red;">Clear History</span>
    `;

    win.appendChild(saveOptions);
    win.appendChild(br);
    win.appendChild(categoryTitle1);
    win.appendChild(ht_container);

    winContainer.appendChild(win);
    document.body.appendChild(winContainer);


    // "import history" button
    var importHistoryBtn = document.getElementById('ctracker-importHis');
    importHistoryBtn.addEventListener('change', function(a) {
        
        var file = a.target.files[0];
        var reader = new FileReader();

        reader.onload = function() {
            var contents = reader.result;
            clearAllHistory();

            var newHistory = JSON.parse(contents);
            if (typeof newHistory == 'object') {
                history = newHistory;
                drawHistoryItems();
            }


        };
        reader.readAsText(file);
    });




    var exportHistoryBtn = document.getElementsByClassName('ctracker-exportHistory')[0];
    exportHistoryBtn.onclick = function() {
        exportHistory();
    }

    var clearHistoryBtn = document.getElementsByClassName('ctracker-clearHistory')[0];
    clearHistoryBtn.onclick = function(){
        clearAllHistory();
    }


    drawHistoryItems();
}




function drawHistoryItems() {

    for (var i=history.length; i--;) {

        var ht_body = document.getElementsByClassName('ctracker-historyTable')[0];


        var tr2 = document.createElement('tr');
        tr2.className = 'ctracker-entryItem';

        var td3 = document.createElement('td');
        var decodedUrl = decodeURIComponent(history[i]);
        td3.innerText = decodedUrl;

        var td4 = document.createElement('tr');
        

        var a = document.createElement('a');
        a.innerText = 'Delete';
        a.style.color = blue;
        a.href = '#';

        var tbDecodedUrl = document.createElement('input')
        tbDecodedUrl.type = 'text';
        tbDecodedUrl.value = decodedUrl;
        tbDecodedUrl.style.display = 'none';
        a.appendChild(tbDecodedUrl);


        a.onclick = function(){
            removeItemFromHistory(this.firstElementChild.value);
            this.parentNode.parentNode.remove();
            ctrackerMsg('Close this dialog to save changes.');
        }

        td4.appendChild(a);


        tr2.appendChild(td3);
        tr2.appendChild(td4);

        ht_body.appendChild(tr2);

    }
}





function clearAllHistory() {
    var entries = document.getElementsByClassName('ctracker-entryItem');

    for (let i=entries.length; i--;) {
        entries[i].parentNode.removeChild(entries[i]);
    }

    history = []
    changesWereMade = true;
    ctrackerMsg('Close this window to confirm changes.');
}




function createHistoryButton() {
    var btnHistory = document.createElement('a');
    btnHistory.innerText = 'History';
    btnHistory.href = '#';


    btnHistory.onclick = function(){
        createSettingsWindow();
    }


    if (pageType != 'search') {
        var searchFiltersBtn = document.getElementsByClassName(filterBtn)[0];
        if (searchFiltersBtn) {
            searchFiltersBtn.parentNode.insertBefore(btnHistory, searchFiltersBtn);
        }
    }
    else  {
        var searchTop = document.getElementsByClassName(searchSortTop)[0];
        if (searchTop) {
            searchTop.parentNode.insertBefore(btnHistory, searchTop);
        }
    }
    
}




function markVisitedItems() {

    console.log('ctracker | Getting dom elements...')
    
    var domLink = null;
    var url = null;

    if (pageType == 'label' || pageType == 'artist') {
        
        var catalogLinks = document.getElementsByClassName(catalogItemDom);
        for (let i=0; i<catalogLinks.length; i++) {

            if (catalogLinks[i].children[0].tagName == 'A') {
                domLink = catalogLinks[i].getElementsByClassName(catalogItemDomLink)[0];
                url = domLink.href;
            }
            else if (catalogLinks[i].children[0].tagName == 'SPAN') {
                var dl = catalogLinks[i].firstElementChild.getElementsByClassName(catalogItemDomLink);
                domLink = dl[dl.length - 1];

                url = domLink.href;
            }
            drawIndicator(url, domLink);
        }
    }
    else if (pageType == 'search') {

        var searchResults = document.getElementsByClassName('search_result_title');
        for (let i=0; i<searchResults.length; i++) {

            domLink = searchResults[i];
            url = searchResults[i].href;
            drawIndicator(url, domLink);
        }

    }

}



function waitForDynamicElement(element) {
    
    var foundDom = false;

    for (let i=0; i<20; i++) {
        
        if (!foundDom) {
            dom = document.getElementsByClassName(element);
            if (dom) {
                foundDom = true;
            }
            else {
                console.log('ctracker | Waiting for dynamic element...');
            }
    
            if (foundDom) {
                console.log('ctracker | Found dynamic element.');
                return dom;
            }
        }

    }

}






function drawIndicator(url, domLink) {

    console.log('ctracker | Checking if link is saved in localstorage...');
    
    if (domLink) {
        var parent = domLink.parentElement;
        var siblings = parent.getElementsByClassName(catalogItemDomLink);

        for (let i=0; i<siblings.length; i++) {
            if (siblings[i].tagName == 'A') {
                siblings[i].style.color = blue;
            }
        }
    }

    var catItemExists = pageIsInHistory(url);
    if (catItemExists == true) {

        domLink.parentNode.parentNode.style.opacity = .5;

        var indicator = document.createElement('a');
        var img = document.createElement('img');

        indicator.className = 'ctracker-visited';
        indicator.href = '#';
        indicator.style = "position: relative;top: 3px;margin-left: 5px;";

        img.src = imgVisited;

        indicator.appendChild(img);
        domLink.parentNode.insertBefore(indicator, domLink.nextSibling);
    }
    else {
        domLink.parentNode.parentNode.style.opacity = 1;
    }
}




function getPageType(){
    var thisUrl = window.location.href;
    var splitUrl = thisUrl.split('https://www.discogs.com/');

    if (splitUrl[1]) {
        splitUrl = splitUrl[1].split('/');
        splitUrl = splitUrl[0];

        if (splitUrl == 'label' || splitUrl == 'release' || splitUrl == 'master' || splitUrl == 'artist' || splitUrl == 'search') {
            pageType = splitUrl;
            whatPageType();
        }
        else {
            if (splitUrl.startsWith('search?')) {
                pageType = 'search';
                whatPageType();
            }
            else {
                console.log('ctracker | Error getting page type.');
                console.log(splitUrl);
            }
        }

    }

    function whatPageType() {
        console.log('ctracker | This is a ' + pageType + ' page.');
    }

}




function pagerBtnEvents() {

    function redraw() {
        clearExistingVisitTags();

        setTimeout(() => {
            markVisitedItems();
        }, scriptLoadTime * 1000);
    }

    var pager = document.getElementsByClassName(pagerDiv)[0];
    var pager2 = document.getElementsByClassName(paginationDiv2)[0];

    if (pager2) {
        var btns = pager2.getElementsByTagName('button');
        for (b in btns) {
            btns[b].onclick = function(){
                redraw();
            }
        }
    }

    if (pager) {
        var btns = pager.getElementsByTagName('a');
        for (b in btns) {
            btns[b].onclick = function(){
                redraw();
            }
        }
    }
}



function clearExistingVisitTags(){
    var tags = document.getElementsByClassName('ctracker-visited');
    for (let i=tags.length; i--;) {
        tags[i].remove();
    }
}



(function() {


    setTimeout(() => {
        about();
        getPageType();
        createHistoryButton();
        loadItems();
        clearExistingVisitTags();
        markVisitedItems();
        pagerBtnEvents();

        if (pageType == 'release' || pageType == 'master') {
            var pageIsSaved = pageIsInHistory(window.location.href);
            if (!pageIsSaved) {
                addItemToHistory(window.location.href);
                saveItems();
            }
        }

    }, scriptLoadTime * 1000);

})();