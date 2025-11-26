const socket = io('http://localhost:3001');
const ctx = document.getElementById('chart').getContext('2d');

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      { label: 'Rx Mbps', data: [], borderColor: 'blue', fill: false, pointRadius: 0 },
      { label: 'Tx Mbps', data: [], borderColor: 'green', fill: false, pointRadius: 0 }
    ]
  },
  options: {
    animation: false, // sem animação
    responsive: false,
    scales: {
      x: { display: true, title: { display: true, text: 'Tempo' } },
      y: { beginAtZero: true, title: { display: true, text: 'Mbps' } }
    },
    plugins: { legend: { position: 'bottom' } }
  }
});

socket.on('bandwidth', ({ time, rx, tx, status }) => {
  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(rx);
  chart.data.datasets[1].data.push(tx);

  if (chart.data.labels.length > 20) {
    chart.data.labels.shift();
    chart.data.datasets[0].data.shift();
    chart.data.datasets[1].data.shift();
  }

  chart.update('none'); // atualização sem efeito visual
  document.getElementById('status').innerText = `Status: ${status}`;
  document.getElementById('lastTime').innerText = time;
});
