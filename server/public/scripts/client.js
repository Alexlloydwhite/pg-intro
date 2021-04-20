$(document).ready(onReady);

function onReady() {
    getMusicData();
    $('#add').on('click', postMusicData);
}

// get artist data from the server
function getMusicData() {
    $("#musicTableBody").empty();
    $.ajax({
        type: 'GET',
        url: '/musicLibrary'
    }).then(function (response) {
        console.log("skjfhsd", response);
        // append data to the DOM
        
        // loop through response
        for (let i = 0; i < response.length; i++) {
            // create a new row from each record ...
            let newRow = $(`
                <tr>
                    <td>${response[i].artist}</td>
                    <td>${response[i].track}</td>
                    <td>${response[i].rank}</td>
                    <td>${response[i].published}</td>
                    <td>    
                        <button type="button" class="edit-btn">Edit</button>
                        <button type="button class="delete-btn">Delete Song</button>
                    </td>
                </tr>
            `);
            // assign key/value pair with songId into jQuery data property:
            newRow.data('id', response[i].id);
            // add each song to the DOM...
            $('#musicTableBody').append(newRow);
        }
    });
}

function postMusicData() {
    let payloadObject = {
        artist: $('#artist').val(),
        track: $('#track').val(),
        rank: $('#rank').val(),
        published: $('#published').val()
    }
    $.ajax({
        type: 'POST',
        url: '/musicLibrary',
        data: payloadObject
    }).then( function (response) {
        $('#artist').val(''),
        $('#track').val(''),
        $('#rank').val(''),
        $('#published').val('')
        getMusicData();
    });
}

function deleteSong(songId) {
    $.ajax({
        method: 'DELETE',
        url: ` /musicLibrary/${songId}`
    })
    .then(response => {
        console.log('deleted It, WOOT!');
        getMusicData(); 
    })
    .catch(error => {
        alert(`Error on delete line 50`, error);
    })
}