
var ajaxUrl, ajaxMethodType, ajaxDataType, DOMstrings;

ajaxUrl = 'http://api.openweathermap.org/data/2.5/weather?q=London&appid=c7e046393dff25b4214066924f7f7ffb';
ajaxMethodType = 'GET';
ajaxDataType = 'json';

DOMstrings = {
    temp: '.temp',
    town: '.town',
    location: '.location',
    form: 'form'
};


UIControler = (function (params) {
    
})();
function getTemp(wheatherData) {
    return wheatherData.main.temp;
}

// var agregateInfo = function agregateData(data) {
//     return data;
// }

function ajaxSuccessCallback(data) {
    console.log('%c success', 'background-color: green');
    console.log('%c ----------------------------', 'color: blue');
    console.log(data);
    document.querySelector('.temp').textContent = data.main.temp;
}

function ajaxFailCallback(data) {
    console.log('%c failed', 'background-color: orange');
}

function makeJqueryAjaxCall(url, methodType, dataType, succCallback, failCallback) {
    

    $.when(
        $.ajax({
            url: url,
            type: methodType,
            dataType: dataType,
            success: succCallback,
            error: failCallback
        })
     ).then(function( data, textStatus, jqXHR ) {
        alert( data.main.temp ); // Alerts 200
      });
}

function makeAjaxCall(url, methodType, dataType, succCallback) {
    var xhr = new XMLHttpRequest();
    xhr.open(methodType, url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            succCallback(xhr.response);
        } 
    };
    xhr.send();
}



function getLocationName() {
    return document.querySelector(DOMstrings.location).value;
}
function createWheatherAPIquery(town) {
    const wheatherAPIKey = 'c7e046393dff25b4214066924f7f7ffb';
    const wheatherMainAPIUrl = 'http://api.openweathermap.org/data/2.5/weather?';

    return wheatherMainAPIUrl + 'q=' + town + '&appid=' + wheatherAPIKey;
}

function queryData(data) {
    console.log(data);
    return data;
}


function getWeather(e) {
    e.preventDefault();
    var inputLocation = getLocationName();
    var createdApiUrl = createWheatherAPIquery(inputLocation);
    
    makeJqueryAjaxCall(createdApiUrl, ajaxMethodType, ajaxDataType, ajaxSuccessCallback, ajaxFailCallback, queryData);

    

}
document.querySelector(DOMstrings.form).addEventListener('submit', getWeather);

document.querySelector('.test-data').addEventListener('click', function () {
    // makeJqueryAjaxCall(ajaxUrl, ajaxMethodType, ajaxDataType, ajaxSuccessCallback, ajaxFailCallback);
    // makeAjaxCall(ajaxUrl, ajaxMethodType, ajaxDataType, ajaxSuccessCallback, ajaxFailCallback);
});




/* opcje
    1. sprawdzanie czy jest takie miasto i walidacja
    2. podpowiedzi miast
    
    4. wybór opcji wyświetlania informacji (aktualna, 3 dniowa itd)

    6. get my location

    8. dodanie kolejnych lokacji/wyszukań/dni nie kasując starych
    9. promisy?
    10. 
*/