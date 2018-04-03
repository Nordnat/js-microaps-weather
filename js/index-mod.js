
var cookieScripts = (function() {
    return {
        createCookie: function (name, value, days) {
            var date, expires;
            if (days) {
                date = new Date();
                date.setTime(date.getTime() +  (days*24*60*60*100));
                expires = "; expires" + date.toGMTString();
            } else {
                expires = "";
            }
            document.cookie = name + "=" + value + expires + "; path=/";
        },
        getCookie: function (name) {
            var regexp = new RegExp("(?:^" + name + "|;\s*"+ name + ")=(.*?)(?:;|$)", "g");
            var result = regexp.exec(document.cookie);
            return (result === null) ? null : result[1];
        },
        deleteCookie: function(name) {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    };
})();

var dataReceivingController = (function() {
    const connectionSettings = {
        ajaxUrl: 'http://api.openweathermap.org/data/2.5/weather?q=London&appid=c7e046393dff25b4214066924f7f7ffb',
        ajaxMethodType: 'GET',
        ajaxDataType: 'json'
    };
    function createWheatherAPIquery(town, units) {
        const urlOptions = {
            APIKey: 'c7e046393dff25b4214066924f7f7ffb',
            APIUrl: 'http://api.openweathermap.org/data/2.5/weather?',
            APIUnitsFormat: {
                metric: '&units=metric',
                imperial: '&units=imperial',
                usa: ''
            } 
        };
        
    
        return urlOptions.APIUrl + 'q=' + town + '&appid=' + urlOptions.APIKey + urlOptions.APIUnitsFormat[units];
    }

    return {
        getConnectionSettings: function(location, units) {

            const connectionObj = Object.assign({}, connectionSettings);
            connectionObj.ajaxUrl = createWheatherAPIquery(location, units);
            return connectionObj;
        },
        makeJqueryAjaxCall: function (url, methodType, dataType, succCallback, failCallback) {
            $.when(
                $.ajax({
                    url: url,
                    type: methodType,
                    dataType: dataType
                })
            ).then(function( data, textStatus, jqXHR ) {
                // alert( data.main.temp ); 
                succCallback(data);
                
                
            });
        }
    };
})();

var UIController = (function() {
    var DOMStrings = {
        temp: '.temp',
        town: '.town',
        location: '.location',
        form: 'form',
        units: '.units',
        remember: '.remember-choice',
        lastSearch: '.search-list'
    };

    return {
        getDOMStrings: function() {
            return DOMStrings;
        },
        getLocation: function() {
            return document.querySelector(DOMStrings.location).value;
        },
        setLocation: function(townToSet) {
            document.querySelector(DOMStrings.location).value = townToSet;
        },
        getUnits: function () {
            var unitsRadios = document.querySelector(DOMStrings.units + ':checked').value;
            return unitsRadios;
        }
    };
})();

var appController = (function(dataCtrl, UICtrl) {
    var DOM, storedLocations;
    
    DOM = UICtrl.getDOMStrings();
    storedSearch = [];
    
    function arrayToObj(arr) {
        var obj = {};
        for(let i = 0; i < arr.length; i++) {
            obj[i] = arr[i];
        }
        return obj;
    }
    
    function objToArry(obj) {
        var arr = Object.keys(obj).map(function (key) { return obj[key]; });
        return arr;
    }

    function saveSearch() {
        if(storedSearch.length < 3) {
            storedSearch.push(UICtrl.getLocation());
        } else {
            storedSearch.shift();
            storedSearch.push(UICtrl.getLocation());
        }
        // if (localStorage.getItem('lastSearch')) {
            displaySavedSearchElements(storedSearch);
        // }
        
        savedSerch();
    }

    function displaySavedSearchElements(storedSearch) {
        document.querySelector(DOM.lastSearch).innerHTML = '';
        storedSearch.forEach(element => {
            var node = document.createElement('li');
            node.innerHTML = element;
            document.querySelector(DOM.lastSearch).appendChild(node);
        });
    }

    function clickPreviouslySearched() {
        document.querySelector(DOM.lastSearch).addEventListener('click', function (e) {
            var clickedLocation = e.target.innerHTML;
            console.log(clickedLocation);
            UICtrl.setLocation(clickedLocation);
            console.log('%c -------- clickPreviouslySearched ------------', 'background-color: plum; color: white');
            setConnection();
            console.log('%c -------- clickPreviouslySearched ------------', 'background-color: plum; color: white');
        });
    }

    function savedSerch() {
        localStorage.setItem('lastSearch', JSON.stringify(arrayToObj(storedSearch)));
    }

    function getSavedSearch() {
        return JSON.parse(localStorage.getItem('lastSearch'));
    }

    function getStorageListArr() { 
        return objToArry(getSavedSearch());
    }

    function ajaxSuccessCallback(data) {
        console.log('%c success', 'background-color: green');
        console.log('%c -------- Data ------------', 'background-color: blue; color: white');
        console.log(data);
        console.log('%c -------- Data ------------', 'background-color: blue; color: white');
        document.querySelector('.temp').textContent = data.main.temp;
    }

    function ajaxFailCallback(data) {
        console.log('%c failed', 'background-color: orange');
    }

    
    function mainCall(connect) {
        console.log('%c -------- Connection object ------------', 'background-color: magenta; color: white');
        console.log(connect);
        console.log('%c -------- Connection object ------------', 'background-color: magenta; color: white');
        dataCtrl.makeJqueryAjaxCall(connect.ajaxUrl, connect.ajaxMethodType, connect.ajaxDataType, ajaxSuccessCallback);
    }

    function rememberedCity() {
        if (cookieScripts.getCookie('weatherTown')) {
            UICtrl.setLocation(cookieScripts.getCookie('weatherTown'));
            document.querySelector(DOM.remember).setAttribute('checked', true);
            console.log('%c -------- rememberedCity ------------', 'background-color: violet; color: white');
            setConnection();
            console.log('%c -------- rememberedCity ------------', 'background-color: violet; color: white');
        } 
    }

    function onChangeRemember() {
        document.querySelector(DOM.remember).addEventListener('change', function() {
            if (UICtrl.getLocation().length > 0 && document.querySelector(DOM.remember + ':checked')) {
                cookieScripts.createCookie('weatherTown', UICtrl.getLocation(), 30);
            } else if (!(document.querySelector(DOM.remember + ':checked'))) {
                cookieScripts.deleteCookie('weatherTown');
            }
        });
    }

    function setConnection() {
        var connect = dataReceivingController.getConnectionSettings(UICtrl.getLocation(), UICtrl.getUnits());
        mainCall(connect);
    }

    function onLocationSubmit() {
        document.querySelector(DOM.form).addEventListener('submit', function(e) {
            e.preventDefault();
            saveSearch();
            setConnection();
        });
    }
    return {
        init: function() {
            rememberedCity();
            if(localStorage.getItem('lastSearch')) {
                storedSearch = [...getStorageListArr()]
                displaySavedSearchElements(storedSearch);
            }
            clickPreviouslySearched();
            onChangeRemember();
            onLocationSubmit();
            
        }
    };
    
})(dataReceivingController, UIController);

appController.init();