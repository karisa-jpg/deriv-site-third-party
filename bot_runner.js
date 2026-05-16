/**
 * Bot Runner Logic for FXBotHub
 * Handles strategy execution and trade requests
 */

class BotRunner {
    constructor(api, symbol = 'R_100') {
        this.api = api;
        this.symbol = symbol;
        this.isRunning = false;
        this.stake = 10;
        this.strategy = 'Rise/Fall';
        this.logs = [];
        this.onLog = null;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.log('Bot started. Monitoring ' + this.symbol + '...', 'info');
        this.monitor();
    }

    stop() {
        this.isRunning = false;
        this.log('Bot stopped.', 'warn');
    }

    log(msg, type = 'info') {
        const entry = { time: new Date().toLocaleTimeString(), msg, type };
        this.logs.push(entry);
        if (this.onLog) this.onLog(entry);
    }

    async monitor() {
        this.api.subscribeTick(this.symbol, (tick) => {
            if (!this.isRunning) return;

            // Dummy strategy: Buy if quote ends in even digit
            const lastDigit = parseInt(tick.quote.toString().slice(-1));
            if (lastDigit % 2 === 0 && Math.random() > 0.8) {
                this.executeTrade('CALL', tick.quote);
            }
        });
    }

    async executeTrade(type, price) {
        this.log(`Signal Found: ${type} @ ${price}`, 'success');
        this.log(`Sending contract proposal to Deriv...`, 'info');

        // In a real scenario, we would call this.api.send({buy: ..., price: ...})
        // For this demo, we simulate the response
        setTimeout(() => {
            if (!this.isRunning) return;
            this.log(`Contract purchased! ID: ${Math.floor(Math.random() * 1000000000)}`, 'success');

            setTimeout(() => {
                if (!this.isRunning) return;
                const win = Math.random() > 0.4;
                if (win) {
                    this.log(`Trade CLOSED. PROFIT +$${(this.stake * 0.95).toFixed(2)}`, 'success');
                } else {
                    this.log(`Trade CLOSED. LOSS -$${this.stake.toFixed(2)}`, 'error');
                }
            }, 3000);
        }, 1000);
    }
}

window.BotRunner = BotRunner;
