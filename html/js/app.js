    var socketAddress = "";
    var socket = null;

    function preparePage() {
        console.log("Page preparing ...");
        var date = new Date();
        $("#current_year").text(date.getFullYear())
    }

    function openWsServer() {
        var address = $("#ws_address").val();
        socketAddress = buildServerAddress(address, false);  // todo: umv: add checkbox here
        console.log("Websocket open server: " + address);
        socket = new WebSocket(socketAddress)
                // todo: analyze was socket conn establish was successful or not
                // todo: UMV: log to logs textarea
        logWsEvent("Websocket connection opened", null);
        socket.onmessage = function (event) {
            console.log("Got message from server: ", event.data);
            if (event.data != null) {
                logWsEvent("Received data from websocket server", event.data);
            }
         }
        socket.onerror = function (event) {
            logWsEvent("Websocket connection failed", event)
        }
        socket.onopen = function() {
            logWsEvent("Websocket connection opened", null);
        }
        socket.onclose = function() {
            logWsEvent("Websocket connection closed", null)
        }
    }

    function closeWsServer() {
        console.log("Websocket close server");
        if (socket != null) {
            socket.close();
            socket = null;
            logWsEvent("Websocket connection closed", null);
        }
    }

    function sendDataToWsServer() {
        if (socket == null) {
            console.log(socketAddress + " not opened");
            logWsEvent("Websocket not opened or closed", null);
            return;
        }

        console.log("Websocket send data");
        var message = $("#ws_payload").val();
        try {
            socket.send(message);
        } catch(error) {
            console.log("Websocket send error", error);
            logWsEvent("Websocket send error", error);
            return;
        }
        logWsEvent("Data was send", message);
    }

    function buildServerAddress(address, secure) {
        if (!(address.startsWith("ws://") || address.startsWith("wss://")))
            return secure ? "wss://" + address : "ws://" + address;
        return address;
    }

    function logWsEvent(messageType, messageData) {
        var logMsg = createLogMessage(messageType, messageData);
        $("#ws_logs").append(logMsg);
    }

    function createLogMessage(messageType, messageData) {
        var dateStr = getFormattedDate();
        var logStr = dateStr + ": " + messageType;
        if (messageData != null && messageData.length > 0) {
            logStr = logStr + " : " + messageData
        }
        logStr += "\n";
        return logStr;
    }

    function getFormattedDate() {
        var date = new Date();
        var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        return str;
    }