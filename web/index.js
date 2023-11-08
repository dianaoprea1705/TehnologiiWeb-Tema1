async function load() {
    document.getElementsByTagName('input')[0].onkeyup = addItem;
    const response = await fetch('/items');
    if (response.status === 200) {
        const body = await response.json();
        body.forEach(({id, text}) => appendItem(id, text));
    }
}

async function addItem(event) {
    const text = event.target.value.trim();
    if (event.key === 'Enter' && text.length > 0) {
        const response = await fetch('/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: text
        });
        if (response.status === 201) {
            const body = await response.text();
            appendItem(body, text);
        }
        event.target.value = '';
    }
}

function appendItem(id, text) {
    const listItem = document.createElement('li');
    listItem.data = id;
    const anchor = document.createElement('a');
    const input = document.createElement('input');
    input.type = 'text';
    input.value = text; //textul este scris in caseta
    input.onkeyup = (event) => changeItem(event, listItem);
    //am creat elementul Remove pentru fiecare element al listei 
    const remove = document.createElement('a');
    remove.href = 'javascript:void(0)';
    remove.onclick = () => removeItem(listItem); //cand utilizatorul apasa pe remove elementul se sterge
    remove.innerText = 'Remove';

    listItem.appendChild(input);
    listItem.appendChild(anchor);
    listItem.appendChild(document.createTextNode(' ')); 
    listItem.appendChild(remove);
    document.getElementsByTagName('ul')[0].appendChild(listItem);
}

async function removeItem(listItem) {
    const response = await fetch(`/items/${listItem.data}`, {
        method: 'DELETE'
    });
    if (response.status === 204) {
        listItem.parentNode.removeChild(listItem);
    } else {
        alert('Item could not be removed.');
    }
}

async function changeItem(event, listItem) {
    const id = listItem.getAttribute('id');
    const text = event.target.value.trim();
    if (event.key === 'Enter') {
        if (text.length > 0) {
            const response = await fetch(`/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: text
            });
            if (response.status === 101) {
                listItem.querySelector('a').innerText = text;
                listItem.setAttribute('text', text);
                alert('Item modified.');
            } else {
                alert('Item cannot be modified.');
            }
        } else {
            alert('Cannot be empty.');
        }
    }
}
