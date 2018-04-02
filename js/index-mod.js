

var dataReceivingController = (function() {
    const connectionSettings = {
        ajaxUrl: 'http://api.openweathermap.org/data/2.5/weather?q=London&appid=c7e046393dff25b4214066924f7f7ffb',
        ajaxMethodType: 'GET',
        ajaxDataType: 'json'
    }
    function createWheatherAPIquery(town) {
        const wheatherAPIKey = 'c7e046393dff25b4214066924f7f7ffb';
        const wheatherMainAPIUrl = 'http://api.openweathermap.org/data/2.5/weather?';
    
        return wheatherMainAPIUrl + 'q=' + town + '&appid=' + wheatherAPIKey;
    }

    
    return {
        getConnectionSettings: function(location) {
            return function() {
                var conectionObj = Object.assign({}, connectionSettings);
                conectionObj.ajaxUrl = createWheatherAPIquery(location);
            }
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
    }
})();

var UIController = (function() {
    var DOMStrings = {
        temp: '.temp',
        town: '.town',
        location: '.location',
        form: 'form'
    };

    function getLocationName() {
        return document.querySelector(DOMStrings.location).value;
    }

    return {
        getDOMStrings: function() {
            return DOMStrings;
        },
        getLocation: function() {
            return getLocationName;
        }
    }
})();

var appController = (function(dataCtrl, UICtrl) {
    var connect = dataReceivingController.getConnectionSettings('Warsaw');
    function ajaxSuccessCallback(data) {
        console.log('%c success', 'background-color: green');
        console.log('%c ----------------------------', 'color: blue');
        console.log(data);
        document.querySelector('.temp').textContent = data.main.temp;
    }

    
    
    function ajaxFailCallback(data) {
        console.log('%c failed', 'background-color: orange');
    }
    function mainCall() {
        console.log(connect)
        // dataReceivingController.makeJqueryAjaxCall(connect.ajaxUrl, connect.ajaxMethodType, connect.ajaxDataType, ajaxSuccessCallback);
    }
    function test() {
        document.querySelector('.test-data').addEventListener('click', mainCall);
    }
    return {
        init: function() {
            test();
        }
    }
    
})(dataReceivingController, UIController);

appController.init();