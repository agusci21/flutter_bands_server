const Bands = require('../models/bands_model')
const { io } = require('../index')
const Band = require('../models/band_model')

const bands = new Bands()

bands.addBand(new Band('Queen'))
bands.addBand(new Band('Bon Jon Jovi'))
bands.addBand(new Band('Heroes del silencio'))
bands.addBand(new Band('Metalica'))

console.log(bands)

// Mensajes de Sockets
io.on('connection', (client) => {
  console.log('Cliente conectado')

  client.emit('active-bands', bands.getBands())

  client.on('disconnect', () => {
    console.log('Cliente desconectado')
  })

  client.on('mensaje', (payload) => {
    console.log('Mensaje', payload)

    io.emit('mensaje', { admin: 'Nuevo mensaje' })
  })

  client.on('vote-band', (payload) => {
    bands.voteBand(payload.id)
    io.emit('active-bands', bands.getBands())
  })

  client.on('add-band', (payload) => {
    const newBand = new Band(payload.name)
    bands.addBand(newBand)
    io.emit('active-bands', bands.getBands())
  })

  client.on('delete-band', (payload) => {
    bands.deleteBand(payload.id)
    io.emit('active-bands', bands.getBands())
  })

  //escuchar delete-band
  //bands.deleteBand
  //io.emit activeBands

  // client.on('nuevo-mensaje', (payload) => {
  //     console.log(payload);
  //     //io.emit('nuevo-mensaje', payload); Emite a todos
  //     client.broadcast.emit('nuevo-mensaje', payload);//Emite a todos menos al emisor
  // });
})
