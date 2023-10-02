const express = require('express');
const fs = require('fs/promises');
const app = express();
const port = 3000; // You can change this port as needed

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to append text to a file
app.get('/writeFile', async (req, res) => {
    const textToAppend = req.query.text;

    if (!textToAppend) {
        return res.status(400).send('No text provided in the query parameter.');
    }

    try {
        // Append the text to the file
        await fs.appendFile('file.txt', textToAppend + '\n');
        res.send('Text appended to file.txt');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to read and display the content of a file
app.get('readFile/:file_name', async (req, res) => {
    const fileName = req.params.file_name;

    try {
        const fileContent = await fs.readFile(fileName, 'utf8');
        res.send(fileContent);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).send(`File ${fileName} not found`);
        }

        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
