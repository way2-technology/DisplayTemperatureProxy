var http = require("http");
var https = require("https");

const port = process.env.PORT || 8078;

const url = "https://api.temperaturaaqui.com.br/temperatura/device?id=80ad9145b5494e2280f5cbcdefdf775d";

const server = http.createServer(async function(request, response) {
    if (request.method !== "GET") {
        response.writeHead(405, { "Content-Type": "text/plain" });
        response.end("Undefined request");
    }

    try {
        const temperature = await requestTemperature();
        
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.end(temperature);
    } catch (e) {
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.end("Error on request");
    }
});

const requestTemperature = () => {
    return new Promise((resolve, reject) => {
        https.get(url, response => {
            let data = "";

            response.on("data", chunk => {
                data += chunk;
            });

            response.on("end", () => {
                const parsedData = JSON.parse(data);
                const roundedValue = Math.round(parsedData.t);
                const valueString = roundedValue.toString();
                const paddedValue = valueString.padStart(2, '0');

                resolve(paddedValue);
            });
        }).on("error", reject);
    });
};

server.listen(port);
console.log(`Server running on port ${port}`);