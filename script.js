//API con autenticazione tramite key
function maprequest(){
    L.mapquest.key = 'IKbJ8SOFhuV0qZDFutDEtlrLzBTvuwfL';

    L.mapquest.map('map', {
        center: [37.5242796,15.0688174], 
        layers: L.mapquest.tileLayer('map'), zoom: 12 
    });
}

maprequest();

//API con autenticazione tramite OAuth
function onJson(json) {
    const library = document.querySelector('#vista');
    library.innerHTML = '';

    const results = json.playlists.items;
    let num_results = results.length;
    if(num_results > 12)num_results = 12;

    for(let i=0; i<num_results; i++){
        const playlist_data = results[i];
        const title = playlist_data.name;
        const selected_image = playlist_data.images[0].url;

        const playlist = document.createElement('div');
        playlist.classList.add('playlist');

        const img = document.createElement('img');
        img.src = selected_image;

        const caption = document.createElement('span');
        caption.textContent = title;

        playlist.appendChild(img);
        playlist.appendChild(caption);
        library.appendChild(playlist);
    }
}

function onResponse(response) {
    console.log('Risposta ricevuta');
    return response.json();
}

function search(event){
    event.preventDefault();

    const playlist_input = document.querySelector('#insert');
    const playlist_value = encodeURIComponent(playlist_input.value);
    console.log('Eseguo ricerca: ' + playlist_value);

    fetch("https://api.spotify.com/v1/search?type=playlist&q=" + playlist_value,{
        headers:{
            'Authorization': 'Bearer ' + token
        }
    }).then(onResponse).then(onJson);
}

function onTokenJson(json){
    console.log(json)
    token = json.access_token;
}

function onTokenResponse(response){
    return response.json();
}

function request(){
    const client_id = '640961609b854f50af25a992598736a2';
    const client_secret = 'c890caeb796b431c9b4d03bac590c71e';

    fetch("https://accounts.spotify.com/api/token",{
        method: "post",
        body: 'grant_type=client_credentials',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        }
    }).then(onTokenResponse).then(onTokenJson);

    const form = document.querySelector('form');
    form.addEventListener('submit', search);
}

let token;
request();