// ==================== TRADING DASHBOARD LOGIC (INDEX ONLY) ====================

// LIVE CHART
function initTradingChart() {
  const chartEl = document.getElementById('liveChart');
  if (!chartEl) return;
  const ctx = chartEl.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 320);
  gradient.addColorStop(0, 'rgba(240, 180, 41, 0.2)');
  gradient.addColorStop(1, 'rgba(240, 180, 41, 0)');

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array(20).fill(''),
      datasets: [{
        label: 'Market Price',
        data: Array(20).fill(0).map(() => 40 + Math.random() * 20),
        borderColor: '#f0b429',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        backgroundColor: gradient,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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

  setInterval(() => {
    chart.data.datasets[0].data.shift();
    const last = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
    chart.data.datasets[0].data.push(last + (Math.random() - 0.5) * 4);
    chart.update('none');
  }, 2000);
}

// BOT TERMINAL
function initBotTerminal() {
  const terminal = document.getElementById('botTerminal');
  if (!terminal) return;

  const logs = [
    { type: 'info', msg: 'FX-BOT v5.2 initialized...' },
    { type: 'info', msg: 'Connecting to Deriv API server...' },
    { type: 'success', msg: 'Connection established. Token verified.' },
    { type: 'info', msg: 'Scanning Volatility 75 Index...' },
    { type: 'warn', msg: 'High volatility detected. Adjusting risk...' },
    { type: 'success', msg: 'Signal Found: BUY @ 8422.10' },
    { type: 'info', msg: 'Executing trade...' },
    { type: 'success', msg: 'Trade Closed: PROFIT +$42.50' }
  ];

  function addLog() {
    const log = logs[Math.floor(Math.random() * logs.length)];
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const line = document.createElement('div');
    line.className = 'bot-line';
    line.innerHTML = `<span class="bot-time">[\${time}]</span> <span class="bot-msg \${log.type}">\${log.msg}</span>`;
    terminal.insertBefore(line, terminal.lastChild);
    if (terminal.children.length > 12) terminal.removeChild(terminal.firstChild);
  }
  setInterval(addLog, 2500);
}

// COUNTERS
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

// STAT COUNTERS (Animate on reveal)
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

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  initTradingChart();
  initBotTerminal();
});
