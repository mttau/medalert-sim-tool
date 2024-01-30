document.getElementById('deactivateButton').addEventListener('click', function() {
    fetch('mapping.json')
        .then(response => response.json())
        .then(mappingArray => {
            const mapping = mappingArray.reduce((acc, item) => {
                acc[item["SIM SN"]] = item["ICCID"];
                return acc;
            }, {});

            var simSns = document.getElementById('simNumbers').value.split('\n');
            simSns.forEach(function(simSn) {
                if (simSn.trim() !== '' && mapping[simSn.trim()]) {
                    scheduleDeactivation(mapping[simSn.trim()]);
                } else {
                    console.error('ICCID not found for SIM S/N:', simSn);
                }
            });
        })
        .catch(error => {
            console.error('Error loading mapping:', error);
        });
});

function encodeCredentials(username, apiKey) {
    return btoa(username + ':' + apiKey);
}

function scheduleDeactivation(iccid) {
    const url = `https://restapi10.jasper.com/rws/api/v1/devices/${iccid}`;
    const encodedCredentials = encodeCredentials('matthewtalia2', 'd988024b-9e25-4493-9c2b-e5b6c92fe041');
    const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Basic " + encodedCredentials
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 364);
    const effectiveDate = tomorrow.toISOString().split('T')[0] + 'Z';

    const data = {
        "status": "DEACTIVATED",
        "effectiveDate": effectiveDate
    };

    fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
