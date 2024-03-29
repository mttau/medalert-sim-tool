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
                    updateFeedback('ICCID not found for SIM S/N: ' + simSn, 'error');
                }
            });
        })
        .catch(error => {
            console.error('Error loading mapping:', error);
            updateFeedback('Error loading mapping: ' + error.message, 'error');
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
        updateFeedback('Deactivation successful for ICCID: ' + iccid, 'success');
    })
    .catch(error => {
        console.error('Error:', error);
        updateFeedback('Deactivation failed for ICCID: ' + iccid + '. Error: ' + error.message, 'error');
    });
}

document.getElementById('setApnButton').addEventListener('click', function() {
    console.log('Button clicked'); // Debugging console log for sending APN settings SMS

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
                    console.log('Sending APN settings SMS to SIM SN:', simSn.trim()); // Debugging console log
                    sendApnSettings(mapping[simSn.trim()]); // Pass ICCID to sendApnSettings
                } else {
                    console.error('ICCID not found for SIM S/N:', simSn);
                    updateFeedback('ICCID not found for SIM S/N: ' + simSn, 'error');
                }
            });
        })
        .catch(error => {
            console.error('Error loading mapping:', error);
            updateFeedback('Error loading mapping: ' + error.message, 'error');
        });
});

function sendApnSettings(iccid) {
    const proxyUrl = 'https://medalert-proxy-render.onrender.com/sendSms';
    const messageText = 'pw,123456,apn,telstra.m2m,,,50501#';

    const data = {
        iccid: iccid,
        messageText: messageText,
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
        console.log('SMS Sent:', data);
        updateFeedback(`SMS sent successfully to ICCID: ${iccid}.`, 'success');
    })
    .catch(error => {
        console.error('Error:', error);
        updateFeedback(`Failed to send SMS to ICCID: ${iccid}. Error: ${error.message}`, 'error');
    });
}

function updateFeedback(message, status) {
    const feedbackElement = document.getElementById('feedback');
    if (!feedbackElement) {
        console.error('Feedback element not found.');
        return;
    }
    feedbackElement.textContent = message;
    feedbackElement.className = status; // This could be used to apply different styles based on the status (success or error)
}
