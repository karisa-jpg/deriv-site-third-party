/**
 * Deriv API Integration for FXBotHub
 * Handles WebSocket connection and real-time market data
 */

class DerivAPI {
    constructor(app_id = '1089') { // Default Deriv App ID
        this.app_id = app_id;
        this.socket = null;
        this.isConnected = false;
        this.callbacks = {};
        this.ticksHistory = {};
    }

    connect() {
        return new Promise((resolve, reject) => {
            const url = `wss://ws.binaryws.com/websockets/v3?app_id=${this.app_id}`;
            this.socket = new WebSocket(url);

            this.socket.onopen = () => {
                this.isConnected = true;
                console.log('Connected to Deriv API');
                resolve();
            };

            this.socket.onmessage = (msg) => {
                const response = JSON.parse(msg.data);
                this.handleResponse(response);
            };

            this.socket.onclose = () => {
                this.isConnected = false;
                console.log('Disconnected from Deriv API');
                setTimeout(() => this.connect(), 5000); // Auto-reconnect
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket Error:', error);
                reject(error);
            };
        });
    }

    handleResponse(response) {
        const type = response.msg_type;
        if (this.callbacks[type]) {
            this.callbacks[type](response);
        }

        // Global handlers
        if (type === 'tick') {
            const symbol = response.tick.symbol;
            if (this.callbacks[`tick_${symbol}`]) {
                this.callbacks[`tick_${symbol}`](response.tick);
            }
        }
    }

    send(request) {
        if (this.isConnected) {
            this.socket.send(JSON.stringify(request));
        } else {
            console.error('Socket not connected');
        }
    }

    subscribeTick(symbol, callback) {
        this.callbacks[`tick_${symbol}`] = callback;
        this.send({
            ticks: symbol,
            subscribe: 1
        });
    }

    unsubscribeTick(symbol) {
        delete this.callbacks[`tick_${symbol}`];
        this.send({
            forget_all: 'ticks'
        });
    }

    getHistory(symbol, count = 100) {
        return new Promise((resolve) => {
            const reqId = Date.now();
            this.callbacks['history'] = (response) => {
                resolve(response.history);
            };
            this.send({
                ticks_history: symbol,
                adjust_start_time: 1,
                count: count,
                end: 'latest',
                start: 1,
                style: 'ticks'
            });
        });
    }

    authorize(token) {
        return new Promise((resolve, reject) => {
            this.callbacks['authorize'] = (response) => {
                if (response.error) reject(response.error);
                else resolve(response.authorize);
            };
            this.send({ authorize: token });
        });
    }
}

// Export for use in other scripts
window.DerivAPI = DerivAPI;
