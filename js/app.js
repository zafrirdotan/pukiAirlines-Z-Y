'use strict';

const airports =    [
                        'TLV',
                        'PAR',
                        'LON',
                        'JFK',
                        'BER',
                        'BKK',
                        'TOK',
                        'MEX'
                    ];

function renderSRC() {
    let $elFromArprt = $('#fromArprt');
    let strHTML = (airports.map(ap => `<option value="${ap}">${ap}</option>`).join(''));
    $elFromArprt.append(strHTML);
}

function renderDEST() {
    let src = $('#fromArprt').val();
    let $elToArprt = $('#toArprt');
    
    let strHTML = '<option value="">Choose</option>';
    strHTML += (airports.filter(ap => ap !== src).map(ap => `<option value="${ap}">${ap}</option>`).join(''));
    console.log('strHTML:', strHTML);
    
    $elToArprt.html(strHTML);
}

function renderPlaneIds() {
    let planeIds = Plane.query().map(p => p.id);
    console.log('planeIds:', planeIds);
    let strHTML = planeIds.map(pid => `<option value="${pid}">${pid}</option>`).join('');
    console.log('strHTML:', strHTML);
    
    $('#fplaneId').html(strHTML);
}

$(document).ready(()=>{

    console.log('document loaded');

});