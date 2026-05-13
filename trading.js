/**
 * Trading Logic for FXBotHub Landing Page
 * Integrates real market data from Deriv API
 */

let derivAPI;
let landingChart;

async function initLandingPageTrading() {
    derivAPI = new DerivAPI();
    await derivAPI.connect();

    initLandingChart();
    initLiveTicker();
    initLiveSignals();
    initBotTerminal();

    // Subscribe to R_75 for the landing chart
    derivAPI.subscribeTick('R_75', (tick) => {
        updateLandingChart(tick.quote);
    });
}

function initLandingChart() {
    const chartEl = document.getElementById('liveChart');
    if (!chartEl) return;
    const ctx = chartEl.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 320);
    gradient.addColorStop(0, 'rgba(240, 180, 41, 0.2)');
    gradient.addColorStop(1, 'rgba(240, 180, 41, 0)');

    landingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(30).fill(''),
            datasets: [{
                label: 'Volatility 75',
                data: [],
                borderColor: '#f0b429',
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                backgroundColor: gradient,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#7a7a9a', font: { size: 10 } }
                }
            }
        }
    });
}

function updateLandingChart(price) {
    if (!landingChart) return;
    landingChart.data.datasets[0].data.push(price);
    if (landingChart.data.datasets[0].data.length > 30) {
        landingChart.data.datasets[0].data.shift();
    }
    landingChart.update('none');
}

function initLiveTicker() {
    const symbols = ['R_10', 'R_25', 'R_50', 'R_100', 'FRXEURUSD', 'FRXGBPUSD'];
    const tickerTrack = document.getElementById('tickerTrack');
    if (!tickerTrack) return;

    symbols.forEach(symbol => {
        const item = document.createElement('div');
        item.className = 'ticker-item';
        item.innerHTML = `
            <span class="pair">${symbol.replace('R_', 'Volatility ')}</span>
            <span class="price" id="ticker-${symbol}">...</span>
            <span class="change" id="change-${symbol}">--</span>
        `;
        tickerTrack.appendChild(item);

        const sep = document.createElement('div');
        sep.className = 'ticker-sep';
        sep.textContent = '•';
        tickerTrack.appendChild(sep);

        derivAPI.subscribeTick(symbol, (tick) => {
            const priceEl = document.getElementById(`ticker-${symbol}`);
            const changeEl = document.getElementById(`change-${symbol}`);
            const prevPrice = parseFloat(priceEl.textContent);
            const currentPrice = tick.quote;

            priceEl.textContent = currentPrice;
            if (!isNaN(prevPrice)) {
                const diff = currentPrice - prevPrice;
                const isUp = diff >= 0;
                changeEl.textContent = `${isUp ? '▲' : '▼'} ${Math.abs((diff/prevPrice)*100).toFixed(2)}%`;
                changeEl.className = `change ${isUp ? 'up' : 'down'}`;
            }
        });
    });
}

function initLiveSignals() {
    const grid = document.getElementById('signalsGrid');
    if (!grid) return;

    const pairs = ['R_100', 'R_75', 'R_50', 'R_25'];
    pairs.forEach(pair => {
        const card = document.createElement('div');
        card.className = 'signal-card reveal';
        card.innerHTML = `
            <div class="signal-top">
                <span class="signal-pair">${pair.replace('R_', 'VOL ')}</span>
                <span class="signal-type buy">STRONG BUY</span>
            </div>
            <div class="signal-bar-wrap">
                <div class="signal-bar buy-bar" style="width: 85%"></div>
            </div>
            <div class="signal-meta">
                <span>Confidence</span>
                <strong class="signal-confidence">85%</strong>
            </div>
            <div class="signal-meta">
                <span>Entry Price</span>
                <strong id="signal-entry-${pair}">...</strong>
            </div>
        `;
        grid.appendChild(card);

        derivAPI.subscribeTick(pair, (tick) => {
            document.getElementById(`signal-entry-${pair}`).textContent = tick.quote;
            // Randomly flip signal for visual variety
            if (Math.random() > 0.95) {
                const type = card.querySelector('.signal-type');
                const bar = card.querySelector('.signal-bar');
                const conf = card.querySelector('.signal-confidence');
                const isBuy = Math.random() > 0.5;

                type.textContent = isBuy ? 'STRONG BUY' : 'STRONG SELL';
                type.className = `signal-type ${isBuy ? 'buy' : 'sell'}`;
                bar.className = `signal-bar ${isBuy ? 'buy-bar' : 'sell-bar'}`;
                const c = 75 + Math.floor(Math.random() * 20);
                conf.textContent = `${c}%`;
                bar.style.width = `${c}%`;
            }
        });
    });
}

function initBotTerminal() {
    const terminal = document.getElementById('botTerminal');
    if (!terminal) return;

    derivAPI.subscribeTick('R_75', (tick) => {
        if (Math.random() > 0.7) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const line = document.createElement('div');
            line.className = 'bot-line';

            const actions = [
                { type: 'info', msg: `Scanning Volatility 75 @ ${tick.quote}` },
                { type: 'success', msg: `Contract purchased: RISE @ ${tick.quote}` },
                { type: 'warn', msg: `Trend shifting. Adjusting martingale...` },
                { type: 'success', msg: `Profit locked: +$12.40` }
            ];

            const action = actions[Math.floor(Math.random() * actions.length)];
            line.innerHTML = `<span class="bot-time">[${time}]</span> <span class="bot-msg ${action.type}">${action.msg}</span>`;
            terminal.insertBefore(line, terminal.lastChild);
            if (terminal.children.length > 10) terminal.removeChild(terminal.firstChild);
        }
    });
}

// Counters (Kept as before but could be dynamic)
function startCounters() {
    const counters = [
        { id: 'count1', target: 12500, suffix: '+', prefix: '' },
        { id: 'count2', target: 340, suffix: '+', prefix: '' },
        { id: 'count3', target: 87, suffix: '%', prefix: '' },
        { id: 'count4', target: 2400000, suffix: '', prefix: '$' },
    ];

    counters.forEach(c => {
        const el = document.getElementById(c.id);
        if (!el) return;
        let current = 0;
        const increment = c.target / 80;
        const timer = setInterval(() => {
            current = Math.min(current + increment, c.target);
            const val = c.target > 1000
                ? (current >= 1000000 ? (current/1000000).toFixed(1)+'M' : Math.floor(current/1000)+'K')
                : Math.floor(current);
            el.textContent = c.prefix + val + c.suffix;
            if (current >= c.target) clearInterval(timer);
        }, 25);
    });
}

function animateStatNumbers() {
    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        if (isNaN(target)) return;
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = target / 80;
        const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            let display = Math.floor(current);
            if (target >= 1000000) display = (current / 1000000).toFixed(1) + 'M';
            else if (target >= 1000) display = Math.floor(current / 1000) + 'K+';
            el.textContent = prefix + display + suffix;
            if (current >= target) clearInterval(timer);
        }, 25);
    });
}

document.addEventListener('DOMContentLoaded', initLandingPageTrading);
