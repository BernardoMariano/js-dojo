const { socket } = io

Notification.requestPermission()


angular
    .module('Soquetes', [])
    .controller('MainCtrl', ($scope, $timeout) => {
        io.sails.url = 'http://192.168.1.154:1337'

        $scope.messages = []

        const { messages } = $scope

        socket.on('message', res => {
            new Notification(res.body)
            messages.push(res)
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

        $scope.send = () => {
            const { name, body } = $scope

            if (!body) return

            socket.post('192.168.1.154:1337/soquete/message', { name, body })
            $scope.body = ''
        }

        $scope.enterRoom = name => {
            socket.post('192.168.1.154:1337/soquete/enterRoom', { name })
            $scope.inChatRoom = true
        }

        $scope.createRoom = () => {
            socket.post('192.168.1.154:1337/soquete/createRoom', { roomName: $scope.newRoom })
        }
    })
