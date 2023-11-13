const timeZone = () => {
    let date = new Date();

    return date.getTimezoneOffset();
}


async function httpRequest(path, method, payload, isFormData = false) {

    let route = `${BASE_URL}/${path}`;

    let headers_item = isFormData ? {
        ApiKey: API_KEY,
        ClientTimeZone: timeZone(),
        Accept: 'application.json',
    } : {
        ApiKey: API_KEY,
        ClientTimeZone: timeZone(),
        Accept: 'application.json',
        'Content-Type': 'application/json'
    };

    const config = {
        method: method,
        headers: headers_item,
        body: (method === 'POST' || method === 'PUT') ? (isFormData ? payload : JSON.stringify(payload)) : null
    };

    console.log(config, "config")
    const response = await fetch(route, config);

    return new Promise(async (resolve, reject) => {
        if (response.status === 200) {
            resolve(response.json())
        } else {
            reject("guy!")
        }
    })
}