import fetch from 'node-fetch';
import WebSocket from 'ws';

const WS_CONNECTION = "wss://ws.tryterra.co/connect";
const WS_REST = "https://ws.tryterra.co";
const hr_list = []

//Generates a token for a developer
const generateToken = new Promise((resolve, reject) => {
    const options = {
        method: 'POST', 
        headers: {
            Accept: 'application/json',
            "dev-id": "terra-athletes",
            "x-api-key": "XIjQDLjJtS2Y2Y5jpPAjM8liYSNltTnN4yDn9LbR"
        }
    };

    return fetch('https://ws.tryterra.co/auth/developer', options)
      .then(response => resolve(response.json()))
      .catch(err => reject(console.error(err)));
})


function initWS(token) {
    const socket = new WebSocket(WS_CONNECTION)

    var expectingHeartBeatAck = false

    socket.addEventListener('open', function (event) {
        console.log("Connection Established");
    })

    function heartBeat(){   
        if(!expectingHeartBeatAck){
            var heartBeatPayload = JSON.stringify({
                "op": 0
            })
            socket.send(heartBeatPayload)
            console.log("↑  " + heartBeatPayload)
            expectingHeartBeatAck = true
        }
        else socket.close()
    }
    
    socket.addEventListener('message', function (event) {
        console.log("↓  " + event.data);
        var message = JSON.parse(event.data)
        if (message["op"] == 2){
            heartBeat()
            setInterval(heartBeat, message["d"]["heartbeat_interval"])
            var payload = JSON.stringify(generatePayload(token))
            socket.send(payload)
            console.log("↑  " + payload);
        }
        if (message["op"] == 1){
            expectingHeartBeatAck = false
        }
        if (message["op"] == 5) {
            hr_list.push(message.d.val);
            console.log("heart rate list: " + hr_list);
        }
    })


    socket.addEventListener('close', function (event) {
        console.log('close');
        console.log(event.reason);
    })


    socket.addEventListener('error', function (event) {
        console.log('error');
        console.log(event);
    })
}


function generatePayload(token) {

    return {
        "op": 3,
        "d": {
            "token": token,
            "type": 1  //0  for user, 1 for developer
        }
    }
}

generateToken
    .then(tokenpayload => {
        var token = tokenpayload["token"]
        initWS(token)
    })  
    .catch(error => {console.log(error)})
