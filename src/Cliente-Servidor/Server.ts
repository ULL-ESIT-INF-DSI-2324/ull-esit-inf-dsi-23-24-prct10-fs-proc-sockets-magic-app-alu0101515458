import net from 'net';
import fs from 'fs';
import path from 'path';
import { Card } from '../Cartas/ICard.js'
import { CardRequest } from '../Cartas/ICardRequest.js'
import { CardCollection } from '../Cartas/CardCollection.js';

/**
 * @brief Servidor que permite añadir cartas a la colección de un usuario.
 */
const server = net.createServer(connection => {
  console.log('Cliente conectado.');

  let requestData = ''; // Variable para almacenar los datos recibidos

  connection.on('data', data => {
    requestData += data.toString(); // Concatenamos los datos recibidos

    // Verificamos si se ha recibido el delimitador
    if (requestData.endsWith('\n')) {
      try {
        const request = JSON.parse(requestData.trim()) as CardRequest; // Eliminamos espacios en blanco y convertimos a objeto JSON
        // Verificamos si ya hay una instancia de CardCollection para este usuario
        let cardCollections: { [key: string]: CardCollection } = {};

        // Si no existe la propiedad cardCollections en el objeto global, la creamos
        if (!cardCollections.hasOwnProperty(request.usuario)) {
          // Si no hay una instancia, la creamos y la almacenamos en el objeto cardCollections
          cardCollections[request.usuario] = new CardCollection(request.usuario);
        }
        
        let cardCollection = cardCollections[request.usuario];
        let answer = '';
        switch (request.comando) {
          case 'add':
            answer = cardCollection.addCard(request.carta);
            connection.write(answer);
            break;
          case 'remove':
            answer = cardCollection.removeCard(request.carta.id);
            connection.write(answer);
            break;
          case 'list':
            answer = cardCollection.listCards();
            connection.write(answer);
            break;
          case 'update':
            answer = cardCollection.updateCard(request.carta);
            connection.write(answer);
            break;
          case 'read':
            answer = cardCollection.readCard(request.carta.id);
            connection.write(answer);
            break;
          default:
            // Si el comando no es reconocido
            connection.write('Comando no reconocido: ' + request.comando + '\n');
            break;
        }
      } catch (error) {
        connection.write('Error al procesar la petición: formato inválido.\n');
      }
      requestData = ''; // Reiniciamos la variable para la próxima petición
    }
  });

  // Agregamos un manejador para el evento 'request'
  connection.on('request', request => {
    console.log('Petición completa recibida:', request);
  });

  // Agregamos un manejador para el evento 'end'
  connection.on('end', () => {
    console.log('Cliente desconectado.');
    connection.end(); // Finalizamos la conexión
  });
});

// Escuchamos en el puerto 3000
server.listen(3000, () => {
  console.log('Servidor esperando conexiones...');
});