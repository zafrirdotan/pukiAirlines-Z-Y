'use strict';

const KEY_FLIGHTS = 'flights';

// This is a constructor function 
function Flight(id, src , dest, departure, plane, seatsLeft) {
    
    this.id = (id) ? id : Flight.nextId();
    this.src = src;
    this.dest = dest;
    this.departure = new Date(departure);
    this.plane = plane;
    this.seatsLeft = seatsLeft;

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
    let flights = flight.query()
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

    Flight.flights = jsonFlights.map(jsonFlight => {
        return new Flight(jsonFlight.id, jsonFlight.src, jsonFlight.dest, jsonFlight.departure, jsonFlight.plane , seatsLeft);
    })

    return Flight.flights;
}

Flight.save = function (formObj) {
    let flights = Flight.query();
    let flight;
    if (formObj.pid) {
        flight = flight.findById(+formObj.pid);
        flight.source = formObj.fsource; 
        flight.dest = formObj.fdest;
        flight.departureDate = new Date(formObj.fdate);
    } else {
        flight = new Flight(formObj.fsource, formObj.fdest, formObj.fdate);
        flights.push(Flight);
    }
    Flight.flights = flights;
    saveToStorage(KEY_FLIGHTS, flights);
}

Flight.remove = function (pId, event) {
    event.stopPropagation();
    let passengers = Passenger.query();
    passengers = passengers.filter(p => p.id !== pId)
    saveToStorage(KEY_FLIGHTS, passengers);
    Passenger.passengers = passengers;
    Passenger.render();
}

Flight.render = function () {

    let flights = Flight.query();
    var strHtml = flights.map(p => {
        return `<tr onclick="flight.select(${f.id}, this)">
            <td>${f.id}</td>
            <td>${f.src}</td>
            <td>
                ${moment(f.departureDate).format('DD-MM-YYYY')}
            </td>
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

Flight.select = function (pId, elRow) {
    $('.active').removeClass('active success');
    $(elRow).addClass('active success');
    $('.details').show();
    let p = Passenger.findById(pId);
    $('.pDetailsName').html(p.name);
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
    if (fId) {
        let flight = flight.findById(fId);
        $('#fid').val(flight.id);
        $('#fsource').val(flight.source);
        $('#fdest').val(flight.dest);
        $('#fdate').val(moment(passenger.departure).format('YYYY-MM-DD'));
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