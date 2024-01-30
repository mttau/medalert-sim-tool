function scheduleDeactivation(iccid) {
    // Render proxy server URL
    const proxyUrl = 'https://medalert-proxy-render.onrender.com/proxy?url=';
    // Target Jasper API URL
    const targetUrl = `https://restapi10.jasper.com/rws/api/v1/devices/${iccid}`;
    // Combine the proxy URL with the target URL
    const fullUrl = proxyUrl + encodeURIComponent(targetUrl);

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

    fetch(fullUrl, {
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
