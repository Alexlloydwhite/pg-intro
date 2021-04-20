$(document).ready(onReady);

function onReady() {
    getMusicData();
    // listen for add song clicks
    $('#add').on('click', postMusicData);
    //listen for up vote clicks
    $('#musicTableBody').on('click', '.vote-up', putUpVoteHandler)
    // listen for down vote clicks
    $('#musicTableBody').on('click', '.vote-down', putDownVoteHandler)
    // listen for delete song clicks
    $('#musicTableBody').on('click', '.delete-song', deleteSongHandler);
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
                        <button type="button" class="vote-up" data-id="${response[i].id}">
                            Up Vote
                        </button>
                        <button type="button" class="vote-down" data-id="${response[i].id}">
                            Down Vote
                        </button>
                        <button type="button" class="delete-song" data-id="${response[i].id}">
                            Delete Song
                        </button>
                    </td>
                </tr>
            `);
            // assign key/value pair with songId into jQuery data property:
            // newRow.data('id', response[i].id);
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

// handle the button click for voting up a song
// passes songId and vote direction to the API PUT call
function putUpVoteHandler(){
    voteOnSong( $(this).data("id", "up") );
}

// handle the button clicks for voting down a song
// Passes songId and vote direiton to API PUT call
function putDownVoteHandler(){
    voteOnSong( $(this).data("id", "down") );
}

// make the PUT API call and modify the vote on the song!
function voteOnSong(songId, voteDirection) {
    $.ajax({
        method: 'PUT',
        url: `/musicLibrary/${songId}`,
        data: {
            direction: voteDirection // use value from the function arguments in 78
        }
    })
    .then(response => {
        getMusicData();
    })
    .catch(error => {
        console.log('error on vote song.', error);
    })
}


function deleteSongHandler(){
    deleteSong( $(this).data("id") )
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