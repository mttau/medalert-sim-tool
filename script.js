document.getElementById('deactivateButton').addEventListener('click', function() {
    console.log('Button clicked'); // Debugging console log

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
                    console.log('Scheduling deactivation for SIM SN:', simSn.trim()); // Debugging console log
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

function scheduleDeactivation(iccid) {
    console.log('scheduleDeactivation called with ICCID:', iccid); // Debugging console log

    const proxyUrl = 'https://medalert-proxy-render.onrender.com/deactivate';
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 364);
    const effectiveDate = tomorrow.toISOString().split('T')[0] + 'Z';

    const data = {
        iccid: iccid,
        effectiveDate: effectiveDate
    };

    fetch(proxyUrl, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
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
