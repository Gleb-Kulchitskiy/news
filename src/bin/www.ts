import deb from 'debug'
import http from 'http'
import {AddressInfo} from 'net'
import {App} from '../app'
import passport from 'passport'
import {NewsController} from "../news/news.controler"
import {UserController} from "../user/user.controler"
import {AuthController} from "../auth/auth.controler";
import {PassportService} from "../auth/passport.service";
import {googleStrategy} from "../auth/strategies";
import {dbClient} from "../db/db.client"
import {Scheduler} from '../scheduler/scheduler'
import {newsReceiver} from '../scheduler/jobs'

const debug = deb('news:server')

export type Port = number | string | boolean

const port: Port = normalizePort(process.env.PORT || '3000')
const app = new App([
    new AuthController(new PassportService(googleStrategy.name, googleStrategy.strategy, '/success', '/failure')),
    new UserController(),
    new NewsController()
], passport)

/**
 * Create HTTP server.
 */

const server = http.createServer(app.expressApp)

/**
 * Listen on provided port, on all network interfaces.
 */

server.on('error', onError)
server.on('listening', onListening)

dbClient.connect()
    .then(() => {
        server.listen(port)
        const scheduller = new Scheduler()
        scheduller.createAndRunScheduledTask('0 2 * * * ', newsReceiver('top-headlines', 'country=us&category=business'))
    })

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): Port {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException) {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1)
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1)
            break;
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

const isAddressInfo = (addr: any): addr is AddressInfo => {
    return addr.port !== undefined
}

function onListening() {
    const addr = server.address()
    const bind =
        typeof addr === 'string'
            ? 'pipe ' + addr
            : isAddressInfo(addr) ? 'port ' + addr.port : null
    debug('Listening on ' + bind)
}
