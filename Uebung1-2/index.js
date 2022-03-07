import { createServer } from 'http';
import data from './data.js';
import { getList } from './list.js';
import { deleteAddress } from './delete.js';
import { getForm } from './form.js';
import { saveAddress } from './save.js';
import { parse } from 'querystring';

createServer((request, response) => {
  const urlParts = request.url.split('/');
  if (urlParts.includes('delete')) {
    data.addresses = deleteAddress(data.addresses, urlParts[2]);
    redirect(response, '/');
  } else if (urlParts.includes('new')) {
    send(response, getForm());
  } else if (urlParts.includes('edit')) {
    send(response, getForm(data.addresses, urlParts[2]));
  } else if (urlParts.includes('save') && request.method === 'POST') {
    let body = '';
    request.on('readable', () => {
      // As soon as there is a request, the readable event is triggered.
      const data = request.read(); // The data is fetched from the handler function using the read method.
      body += data !== null ? data : '';
    });
    request.on('end', () => {
      // Once the request has been fully accepted, the end event is triggered.
      const address = parse(body); // conversion into an object
      data.addresses = saveAddress(data.addresses, address);
      redirect(response, '/');
    });
  } else {
    send(response, getList(data.addresses));
  }
}).listen(8080, () =>
  console.log('Server erreichbar unter http://localhost:8080')
);

function send(response, responseBody) {
  response.writeHead(200, { 'content-type': 'text/html' });
  response.end(responseBody);
}

function redirect(response, to) {
  response.writeHead(302, { location: '/', 'content-type': 'text/plain' });
  response.end('302 Redirecting to /');
}