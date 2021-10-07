const Bands = require('../models/bands_model');
const { io } = require('../index');
const Band = require('../models/band_model');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jon Jovi'));
bands.addBand(new Band('Heroes del silencio'));
bands.addBand(new Band('Metalica'));

console.log(bands);

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    });

    client.on('nuevo-mensaje', (payload) => {
        console.log(payload);
        //io.emit('nuevo-mensaje', payload); Emite a todos
        client.broadcast.emit('nuevo-mensaje', payload);//Emite a todos menos al emisor
    });

});
