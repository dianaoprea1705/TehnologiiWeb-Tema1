const {resolve, join} = require('path');
const express = require('express');
const service = require('./service')('items.json');
const PORT = process.env.PORT || 8080;
express()
    .use(express.static(join(resolve(), 'web')))
    .use(express.text())
    .get('/items', (request, response) => {
        const items = service.getItems();
        if (items.length > 0) {
            response.json(items);
        } else {
            response.sendStatus(204);
        }
    })
    .post('/items', (request, response) => {
        const item = service.addItem(request.body);
        response.status(201).send(item.id + '');
    })
    .delete('/items/:id', (request, response) => {
        if (service.removeItem(parseInt(request.params.id))) {
            response.sendStatus(204);
        } else {
            response.sendStatus(404);
        }
    })

    //implementati o ruta in server.js care sa raspunda 
    //la PUT pe contextul /items/:id si care sa apeleze service.changeItem(id, request.body);
    .put('/items/:id', (request, response) => {
        const id = parseInt(request.params.id);
        if (service.changeItem(id, request.body)) {
            response.sendStatus(100);
        } else {
            response.sendStatus(404);
        }
    })
    
    .listen(PORT, () => console.log(`Server is running on port ${PORT}.`));