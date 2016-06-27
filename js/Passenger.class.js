'use strict';

const KEY_PASSENGERS = 'passengers';
const INITIAL_PASSENGERS = [{"name":"Alejandro Alfonso Quaron  ","birthdate":"1982-02-07T00:00:00.000Z","email":"alehandro@gmail.com","tel":"053422722","id":1,"pin":36468,"flights":[]},{"name":"Mhmut Devutulu","birthdate":"1966-06-15T00:00:00.000Z","email":"mhmut.dev@hotmail.com","tel":"07674534","id":2,"pin":74609,"flights":[]},{"name":"Ayaturu Hanzu","birthdate":"1948-02-17T00:00:00.000Z","email":"aiazu@gmail.com","tel":"099076758","id":3,"pin":84680,"flights":[]},{"name":"Dov Hanin","birthdate":"1964-06-18T00:00:00.000Z","email":"yuyo@gmail.com","tel":"07897564","id":4,"pin":89096,"flights":[]},{"name":"biatris kido","birthdate":"1966-06-16T00:00:00.000Z","email":"bibi@gmail.com","tel":"89696352","id":5,"pin":27405,"flights":[]},{"name":"moshik afia","birthdate":"1987-05-14T00:00:00.000Z","email":"moshmosh.com","tel":"86545637","id":6,"pin":38331,"flights":[]},{"name":"tut anah amon ","birthdate":"1983-06-15T00:00:00.000Z","email":"tutanah@gmail.com","tel":"8969865","id":7,"pin":97067,"flights":[]},{"name":"samuel herbert","birthdate":"1908-07-22T00:00:00.000Z","email":"sam@gmail.com","tel":"6845632","id":8,"pin":21199,"flights":[]},{"name":"ron prosor","birthdate":"1972-06-08T00:00:00.000Z","email":"ron.com","tel":"785673246","id":9,"pin":88595,"flights":[]},{"name":"yuval noah har ","birthdate":"1960-06-27T00:00:00.000Z","email":"fgfkj@gmail.com","tel":"647763472","id":10,"pin":78622,"flights":[]}]

// This is a constructor function
function Passenger(name, birthdate, email, tel, id, pin, flights ) {
    this.name = name;
    this.birthdate = new Date(birthdate);
    this.email = (email)? email : null;
    this.tel = (tel)? tel : null;
    this.id = (id)? id : Passenger.nextId();
    this.pin = (pin)? pin : randomPin();
    this.flights = (flights)? flights : [];
}

// static methods:
Passenger.nextId = function () {
    let result = 1;
    let jsonPassengers = Passenger.loadJSONFromStorage();
    if (jsonPassengers.length) result = jsonPassengers[jsonPassengers.length - 1].id + 1;
    return result;
}

Passenger.findById = function (pId) {
    let result = null;
    let passengers = Passenger.query()
        .filter(p => p.id === pId);
    if (passengers.length) result = passengers[0];
    return result;
}

Passenger.loadJSONFromStorage = function () {
    let passengers = getFromStorage(KEY_PASSENGERS);
    if (!passengers) passengers = INITIAL_PASSENGERS;
    saveToStorage(KEY_PASSENGERS, passengers);
    return passengers;
}

Passenger.query = function () {

    if (Passenger.passengers) return Passenger.passengers;
    
    let jsonPassengers = Passenger.loadJSONFromStorage();

    Passenger.passengers = jsonPassengers.map(jsonPassenger => {
        return new  Passenger(jsonPassenger.name, jsonPassenger.birthdate,
                    jsonPassenger.email, jsonPassenger.tel, jsonPassenger.id, jsonPassenger.pin, jsonPassenger.flights);
    })

    return Passenger.passengers;
}

Passenger.save = function (formObj) {
    let passengers = Passenger.query();
    let passenger;
    if (formObj.pid) {
        passenger = Passenger.findById(+formObj.pid);
        passenger.name = formObj.pname;
        passenger.birthdate = new Date(formObj.pdate);
        passenger.email = formObj.pEmail;
        passenger.tel = formObj.pTel;
    } else {
        passenger = new Passenger(formObj.pname, formObj.pdate, formObj.pEmail, formObj.pTel);
        passengers.push(passenger);
    }
    Passenger.passengers = passengers;
    saveToStorage(KEY_PASSENGERS, passengers);
}

Passenger.remove = function (pId, event) {
    event.stopPropagation();
    let passengers = Passenger.query();
    passengers = passengers.filter(p => p.id !== pId)
    saveToStorage(KEY_PASSENGERS, passengers);
    Passenger.passengers = passengers;
    Passenger.render();
}

Passenger.render = function () {

    let passengers = Passenger.query();
    var strHtml = passengers.map(p => {
        return `<tr onclick="Passenger.select(${p.id}, this)">
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>
                ${moment(p.birthdate).format('DD-MM-YYYY')}
                ${(p.isBirthday()) ? '<i class="glyphicon glyphicon-gift"></i>' : ''}
            </td>
            <td>
                <button class="btn btn-danger" onclick="Passenger.remove(${p.id}, event)">
                    <i class="glyphicon glyphicon-trash"></i>
                </button>
                 <button class="btn btn-info" onclick="Passenger.editPassenger(${p.id}, event)">
                    <i class="glyphicon glyphicon-edit"></i>
                </button>
            </td>
        </tr>`

    }).join(' ');
    $('.tblPassengers').html(strHtml);
}

Passenger.select = function (pId, elRow) {
    $('.active').removeClass('active success');
    $(elRow).addClass('active success');
    $('.details').show();
    let p = Passenger.findById(pId);
    $('.pDetailsName').html(p.name);
    $('.pDetailsContent').html(`<div class="row">Pin: ${p.pin}</div>
                                <div class="row">Email: ${p.email}</div><div class="row">Tel: ${p.tel}</div>`)
}

Passenger.savePassenger = function () {
    var formObj = $('form').serializeJSON();
    console.log('formObj', formObj); // TODO: remove log
    Passenger.save(formObj);
    Passenger.render();
    $('#modalPassenger').modal('hide');
}

Passenger.editPassenger = function (pId, event) {
    if (event) event.stopPropagation();
    if (pId) {
        $('.modal-title').html('Update passenger details');
        let passenger = Passenger.findById(pId);
        $('#pid').val(passenger.id);
        $('#pname').val(passenger.name);
        $('#pdate').val(moment(passenger.birthdate).format('YYYY-MM-DD'));
        $('#pEmail').val(passenger.email);
        $('#pTel').val(passenger.tel);
    } else {
        $('.modal-title').html('Add passenger');
        $('#pid').val('');
        $('#pname').val('');
        $('#pdate').val('');
        $('#pEmail').val('');
        $('#pTel').val('');
    }


    $('#modalPassenger').modal('show');

}

// instance methods:
Passenger.prototype.isBirthday = function () {
    let now = new Date();
    return (this.birthdate.getMonth() === now.getMonth() &&
        this.birthdate.getDate() === now.getDate());
}

Passenger.prototype.checkPin = function (pin) {
    return pin === this.pin;
}
