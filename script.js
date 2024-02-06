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
                    // Update feedback for failure to find ICCID
                    updateFeedback('ICCID not found for SIM S/N: ' + simSn, 'error');
                }
            });
        })
        .catch(error => {
            console.error('Error loading mapping:', error);
            // Update feedback for error in loading mapping
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
        // Update feedback for success
        updateFeedback('Deactivation successful for ICCID: ' + iccid, 'success');
    })
    .catch(error => {
        console.error('Error:', error);
        // Update feedback for failure in deactivation
        updateFeedback('Deactivation failed for ICCID: ' + iccid + '. Error: ' + error.message, 'error');
    });
}

function updateFeedback(message, status) {
    const feedbackElement = document.getElementById('feedback');
    if (!feedbackElement) {
        console.error('Feedback element not found.');
        return;
    }
    feedbackElement.textContent = message; // Set the text of the feedback element to the message
    feedbackElement.className = status; // Optionally, use this to style the message based on success or error
}

document.getElementById('setApnButton').addEventListener('click', function() {
    var simSns = document.getElementById('simNumbers').value.split('\n');
    simSns.forEach(function(simSn) {
        if (simSn.trim() !== '') {
            console.log('Sending APN settings SMS to SIM SN:', simSn.trim());
            sendApnSettings(simSn.trim());
        }
    });
});

function sendApnSettings(iccid) {
    // The implementation of sendApnSettings...
}

// Ensure any helper functions like updateFeedback are defined and available for use
function updateFeedback(message, status) {
    // The implementation of updateFeedback...
}
