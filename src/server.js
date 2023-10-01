const Hapi = require('@hapi/hapi')
const routes = require('./routes')

// Function untuk menjalankan server
const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    })

    server.route(routes)

    await server.start()
    console.log(`Server brjalan pada ${server.info.uri}`)
}

init()