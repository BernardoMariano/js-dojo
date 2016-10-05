/**
 * SoqueteController
 *
 * @description :: Server-side logic for managing soquetes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const _ = require('lodash')


const App = {
    messages: [],
    rooms: [],
    newMessage: (name, body) => {
        const message = {
            sender: name,
            time: getTime(),
            body: body
        }
        App.messages.push(message)
        return message
    }
}

const getTime = _ => {
    const now = new Date()
    const hour = now.getHours()
    const mins = now.getMinutes()
    return `${ hour }:${ mins }`
}

sails.config.session.users = {}

sails.config.sockets.afterDisconnect = (session, socket, cb) => {
    const userSocket = sails.config.session.users[socket.id]
    if (!userSocket) return cb()
    const message = App.newMessage('system', `${ userSocket.name } saiu da sala!`)
    sails.sockets.broadcast(userSocket.room, 'message', message)
    sails.sockets.leave(socket, userSocket.room)
    delete sails.config.session.users[socket.id]
    return cb()
}

const commands = {
    '/kick': (senderSocket, targetName) => {
        // params => name
        // find sails.config.session.users { name: params }
        const targetSocket = getSocketByName(targetName)
        if (!targetSocket) return
        targetSocket = targetSocket.socket
        const message = App.newMessage('system', `${ targetName } foi removido da sala por ${ senderSocket.name }!`)
        sails.sockets.leave(targetSocket, senderSocket.room)
        sails.sockets.broadcast(senderSocket.room, 'message', message)
        delete sails.config.session.users[targetSocket.id]
    }
}

const isInSession = socketObj => {
    const socket = sails.config.session.users[socketObj.id]
    return socket && socket.socket.id === socketObj.id
}

const getSocketByName = name => {
    return _.find(sails.config.session.users, { name })
}

const getRoomByName = name => {
    return _.find(App.rooms, { name })
}


module.exports = {
    init: (req, res) => {
        const name = req.param('name')
        if (req.isSocket && name !== 'system' && !getSocketByName(name)) {
            sails.config.session.users[req.socket.id] = {
                socket: req.socket,
                name  : name
            }
            sails.sockets.join(req.socket, 'system')
        } else {
            res.send('nope')
        }
    },
    message: (req, res) => {
        const name = req.param('name')
        const body = req.param('body')
        if (req.isSocket && isInSession(req.socket)) {
            if (body.startsWith('/')) {
                const command = body.split(' ')[0]
                const params  = body.split(' ')[1]
                commands[command] && commands[command](req.socket, params)
            } else {
                const room = sails.config.session.users[req.socket.id].room
                const message = App.newMessage(name, body)
                sails.sockets.broadcast(room, 'message', message)
            }
        }
    },
    enterRoom: (req, res) => {
        const roomName = req.param('roomName')
        if (req.isSocket) {
            const userSocket = sails.config.session.users[req.socket.id]
            userSocket.room = roomName
            sails.sockets.join(req.socket, roomName)
            const message = App.newMessage('system', `${ userSocket.name } entrou na sala!`)
            sails.sockets.broadcast(roomName, 'message', message)
        }
    },
    createRoom: (req, res) => {
        const name = req.param('roomName')
        if (req.isSocket && !getRoomByName(name)) {
            const room = {
                name: name,
                createdAt: getTime()
            }
            App.rooms.push(room)
            sails.sockets.broadcast('system', 'room', App.rooms)
        }
    },
    listRoom: (req, res) => {
        if (req.isSocket) {
            sails.sockets.broadcast('system', 'room', App.rooms)
        }
    }
}

