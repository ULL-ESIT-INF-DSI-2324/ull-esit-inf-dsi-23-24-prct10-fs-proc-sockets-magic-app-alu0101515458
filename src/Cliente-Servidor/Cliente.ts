import net from 'net';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .command({
    command: 'add',
    describe: 'Añade una nueva carta a la colección de un usuario',
    builder: {
      user: { describe: 'Nombre del usuario', demandOption: true, type: 'string' },
      id: { describe: 'ID de la carta', demandOption: true, type: 'number' },
      nombre: { describe: 'Nombre de la carta', demandOption: true, type: 'string' },
      costeMana: { describe: 'Coste de mana', demandOption: true, type: 'number' },
      color: { describe: 'Color de la carta', demandOption: true, type: 'string' },
      líneaTipo: { describe: 'Línea o tipo de la carta', demandOption: true, type: 'string' },
      rareza: { describe: 'Rareza de la carta', demandOption: true, type: 'string' },
      textoReglas: { describe: 'Texto de reglas de la carta', demandOption: true, type: 'string' },
      fuerzaResistencia: { describe: 'Fuerza y resistencia de la carta', type: 'array', default: [] },
      marcasLealtad: { describe: 'Marcas de lealtad de la carta', type: 'number' },
      valorMercado: { describe: 'Valor de mercado de la carta', demandOption: true, type: 'number' }
    },
    handler: (argv) => {
      const requestData = {
        usuario: argv.user,
        comando: 'add',
        carta: {
          id: argv.id,
          nombre: argv.nombre,
          costeMana: argv.costeMana,
          color: argv.color,
          líneaTipo: argv.líneaTipo,
          rareza: argv.rareza,
          textoReglas: argv.textoReglas,
          fuerzaResistencia: argv.fuerzaResistencia,
          marcasLealtad: argv.marcasLealtad,
          valorMercado: argv.valorMercado
        }
      };
      sendDataToServer(requestData);
    }
  })
  .command({
    command: 'list',
    describe: 'Lista todas las cartas de la colección de un usuario',
    builder: {
      user: { describe: 'Nombre del usuario', demandOption: true, type: 'string' }
    },
    handler: (argv) => {
      const requestData = {
        usuario: argv.user,
        comando: 'list'
      };
      sendDataToServer(requestData);
    }
  })
  .command({
    command: 'update',
    describe: 'Actualiza una carta de la colección de un usuario',
    builder: {
      user: { describe: 'Nombre del usuario', demandOption: true, type: 'string' },
      id: { describe: 'ID de la carta', demandOption: true, type: 'number' },
      nombre: { describe: 'Nombre de la carta', type: 'string' },
      costeMana: { describe: 'Coste de mana', type: 'number' },
      color: { describe: 'Color de la carta', type: 'string' },
      líneaTipo: { describe: 'Línea o tipo de la carta', type: 'string' },
      rareza: { describe: 'Rareza de la carta', type: 'string' },
      textoReglas: { describe: 'Texto de reglas de la carta', type: 'string' },
      fuerzaResistencia: { describe: 'Fuerza y resistencia de la carta', type: 'array', default: [] },
      marcasLealtad: { describe: 'Marcas de lealtad de la carta', type: 'number' },
      valorMercado: { describe: 'Valor de mercado de la carta', type: 'number' }
    },
    handler: (argv) => {
      const requestData = {
        usuario: argv.user,
        comando: 'update',
        carta: {
          id: argv.id,
          nombre: argv.nombre,
          costeMana: argv.costeMana,
          color: argv.color,
          líneaTipo: argv.líneaTipo,
          rareza: argv.rareza,
          textoReglas: argv.textoReglas,
          fuerzaResistencia: argv.fuerzaResistencia,
          marcasLealtad: argv.marcasLealtad,
          valorMercado: argv.valorMercado
        }
      };
      sendDataToServer(requestData);
    }
  })
  .command({
    command: 'read',
    describe: 'Lee una carta de la colección de un usuario',
    builder: {
      user: { describe: 'Nombre del usuario', demandOption: true, type: 'string' },
      id: { describe: 'ID de la carta', demandOption: true, type: 'number' }
    },
    handler: (argv) => {
      const requestData = {
        usuario: argv.user,
        comando: 'read',
        carta: {
          id: argv.id
        }
      };
      sendDataToServer(requestData);
    }
  })
  .command({
    command: 'remove',
    describe: 'Elimina una carta de la colección de un usuario',
    builder: {
      user: { describe: 'Nombre del usuario', demandOption: true, type: 'string' },
      id: { describe: 'ID de la carta', demandOption: true, type: 'number' }
    },
    handler: (argv) => {
      const requestData = {
        usuario: argv.user,
        comando: 'remove',
        carta: {
          id: argv.id
        }
      };
      sendDataToServer(requestData);
    }
  })
  
  .help()
  .argv;

/**
 * @brief Función que envía los datos al servidor.
 * @param data Datos a enviar.
 * @returns void
 */
function sendDataToServer(data: any) {
  // Creamos un nuevo socket
  const client = new net.Socket();

  // Nos conectamos al servidor
  client.connect(3000, 'localhost', () => {
    console.log('Conectado al servidor.');
    // Enviamos los datos al servidor
    client.write(JSON.stringify(data) + '\n');
  });

  // Escuchamos la respuesta del servidor
  client.on('data', (data) => {
    console.log(data.toString());
  });

  // Escuchamos el evento de cierre de conexión
  client.on('close', () => {
    console.log('Desconectado del servidor.');
  });
}
