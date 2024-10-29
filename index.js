document.getElementById("emailForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var form = document.getElementById("emailForm");
    var formData = new FormData(form);

    var raw = {};
    formData.forEach(function(value, key){
        raw[key] = value;
    });
    raw['subject'] = 'Relay Transactional Email'; // Default subject

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    myHeaders.append("X-API-KEY", "<Your Segnivo API Key>");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow'
    };

    fetch("https://api.segnivo.com/v1/relay/send", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            // Handle success: show a success message or perform further actions
        })
        .catch(error => {
            console.error('Error sending email:', error);
            // Handle error: show an error message or log the error
        });
});
