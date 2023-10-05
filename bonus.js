const http = require('http');
const fs = require('fs/promises');
const { parse } = require('querystring');
const url = require('url');
const port = 3000;

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET') {
        if (req.url === '/') {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Hello world');
        } else if (req.url.startsWith('/readFile/')) {
            const fileName = req.url.replace('/readFile/', '');

            try {
                const fileContent = await fs.readFile(fileName, 'utf8');
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(fileContent);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end(`File ${fileName} not found`);
                } else {
                    console.error(error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                }
            }
        }else if (req.url.startsWith('/writeFile')) {
            const parsedUrl = url.parse(req.url, true); 
            console.log(parsedUrl);
            const textToAppend = decodeURIComponent(req.url.slice('/writeFile/text='.length));

            if (!textToAppend) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('No text provided in the query parameters.');
                return;
            }

            try {
                await fs.appendFile('jashan.txt', textToAppend + '\n');
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Text appended to pahul.txt');
            } catch (error) {
                console.error(error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }

        } 
         else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
