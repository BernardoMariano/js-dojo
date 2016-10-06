const { socket } = io

Notification.requestPermission()


angular
    .module('Soquetes', [])
    .controller('MainCtrl', ($scope, $timeout) => {
        io.sails.url = 'http://192.168.1.154:1337'

        $scope.messages = []

        socket.on('message', res => {
            new Notification(res.body)
            $scope.messages.push(res)
            $scope.$apply()
        })

        socket.on('room', res => {
            $scope.rooms = res
            $scope.$apply()
        })

        $scope.isLoggedIn = false
        $scope.inChatRoom = false

        $scope.login = () => {
            const { name } = $scope
            socket.get('192.168.1.154:1337/soquete/init', { name })
            $scope.isLoggedIn = true
            socket.get('192.168.1.154:1337/soquete/listRoom', { name })
        }

        $scope.sendIfEnter = ($event) => {
            if ($event.which === 13) {
                $event.preventDefault()
                $scope.send()
            }
        }

        $scope.send = () => {
            const { name, body } = $scope

            if (!body) return

            socket.post('192.168.1.154:1337/soquete/message', { name, body })
            $scope.body = ''
        }

        $scope.createRoom = () => {
            socket.post('192.168.1.154:1337/soquete/createRoom', { roomName: $scope.newRoom })
            $scope.newRoom = ''
        }

        $scope.enterRoom = room => {
            $scope.messages = []
            socket.post('192.168.1.154:1337/soquete/enterRoom', { roomName: room.name })
            $scope.inChatRoom = true
            $scope.currentRoom = room
        }

        $scope.leaveRoom = () => {
            socket.post('192.168.1.154:1337/soquete/leaveRoom', { roomName: $scope.currentRoom.name })
            $scope.inChatRoom = false
            $scope.currentRoom = null
        }
    })
