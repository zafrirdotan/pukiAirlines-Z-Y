'use strict';

const KEY_FLIGHTS = 'flights';

// This is a constructor function 
function Flight(src ,dest, departure, plane, seatsLeft, id) {
    
    this.src = src;
    this.dest = dest;
    this.departure = new Date(departure);
    this.plane = plane;
    this.seatsLeft = seatsLeft;
    this.id = (id) ? id : Flight.nextId();

}

// static methods:

Flight.nextId = function () {
    let result = 1;
    let jsonFlights = Flight.loadJSONFromStorage();
    if (jsonFlights.length) result = jsonFlights[jsonFlights.length - 1].id + 1;
    return result;
}

Flight.findById = function (fId) {
    let result = null;
    let flights = Flight.query()
        .filter(f => f.id === fId);
    if (flights.length) result = flights[0];
    return result;
}

Flight.loadJSONFromStorage = function () {
    let flights = getFromStorage(KEY_FLIGHTS);
    if (!flights) flights = [];
    return flights;
}


// id, src , dest, departure, plane, seatsLeft
Flight.query = function () {

    if (Flight.flights) return Flight.flights;
    let jsonFlights = Flight.loadJSONFromStorage();
    console.log('jsonFlights: ', jsonFlights);
    
    Flight.flights = jsonFlights.map(jsonFlight => {
        return new Flight( jsonFlight.src, jsonFlight.dest, jsonFlight.departure, jsonFlight.plane , jsonFlight.seatsLeft, jsonFlight.id);
    })

    return Flight.flights;
}

Flight.save = function (formObj) {

    let flights = Flight.query();
    let flight;
    if (formObj.fid) {
        flight = Flight.findById(+formObj.fid);
        flight.source = formObj.fsource; 
        flight.dest = formObj.fdest;
        flight.departure = new Date(formObj.fdate);
    } else {
        flight = new Flight(formObj.fsource, formObj.fdest, formObj.fdate, formObj.fplaneId);
        flights.push(flight);
    }
    Flight.flights = flights;
    saveToStorage(KEY_FLIGHTS, flights);
}

Flight.remove = function (fId, event) {
    event.stopPropagation();
    let flights = Flight.query();
    flights = flights.filter(f => f.id !== fId)
    saveToStorage(KEY_FLIGHTS, flights);
    Flight.flights = flights;
    Flight.render();
}

Flight.render = function () {

    let flights = Flight.query();
    var strHtml = flights.map(f => {
        return `<tr onclick="flight.select(${f.id}, this)">
            <td>${f.id}</td>
            <td>${f.src}</td>
            <td>${f.dest}</td>
            <td>
                ${moment(f.departure).format('DD-MM-YYYY')}
            </td>
            <td>${f.plane}</td>
             <td>${f.seatsLeft}</td>
            <td>
                <button class="btn btn-danger" onclick="Flight.remove(${f.id}, event)">
                    <i class="glyphicon glyphicon-trash"></i>
                </button>
                 <button class="btn btn-info" onclick="Flight.editFlight(${f.id}, event)">
                    <i class="glyphicon glyphicon-edit"></i>
                </button>
            </td>
        </tr>`

    }).join(' ');
    $('.tblFlights').html(strHtml);
}

Flight.flight = function (fId, elRow) {
    $('.active').removeClass('active success');
    $(elRow).addClass('active success');
    $('.details').show();
    let f = Flight.findById(fId);
    // $('.FDetailsName').html(f.name);
}


Flight.saveFlight = function () {
    var formObj = $('form').serializeJSON();
    console.log('formObj', formObj);


    Flight.save(formObj);
    Flight.render();
    $('#modalFlight').modal('hide');
}

Flight.editFlight = function (fId, event) {
    if (event) event.stopPropagation();
    console.log('fId:',fId);
    
    if (fId) {
        let flight = Flight.findById(fId);
        $('#fid').val(flight.id);
        $('#fsource').val(flight.source);
        $('#fdest').val(flight.dest);
        $('#fdate').val(moment(flight.departure).format('YYYY-MM-DD'));
    } else {
        $('#fid').val('');
        $('#fsource').val('');
        $('#fdest').val('');
        $('#fdate').val('');
    }

    $('#modalFlight').modal('show');

}

// instance methods:



// fsource

// fdest
// fplaneId
// pdate