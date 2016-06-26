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
    let strHTML = airports.map(ap => `<option value="${ap}">${ap}</option>`).join('');
    $elFromArprt.append(strHTML);
}

$(document).ready(()=>{

    console.log('document loaded');

});