let chartInstance = null;

// Fungsi mengisi data simulasi otomatis
function loadSampleData() {
  document.getElementById('income').value = 10000000;
  document.getElementById('expenses').value = 4500000;
  document.getElementById('savings').value = 2000000;
  document.getElementById('debts').value = 1500000;
  document.getElementById('emergencyFund').value = 25000000;
  calculateHealth();
}

// Fungsi utama perhitungan kesehatan keuangan
function calculateHealth() {
  const income = parseFloat(document.getElementById('income').value) || 0;
  const expenses = parseFloat(document.getElementById('expenses').value) || 0;
  const savings = parseFloat(document.getElementById('savings').value) || 0;
  const debts = parseFloat(document.getElementById('debts').value) || 0;
  const emergencyFund = parseFloat(document.getElementById('emergencyFund').value) || 0;

  if (income <= 0) {
    alert("Masukkan nilai pendapatan yang valid!");
    return;
  }

  // 1. Hitung Rasio Finansial
  const dsr = (debts / income) * 100; // Rasio Utang (Maks 30%)
  const savingsRatio = (savings / income) * 100; // Rasio Tabungan (Min 10-20%)
  const monthlyTotalExpense = expenses + debts;
  const efMonths = monthlyTotalExpense > 0 ? (emergencyFund / monthlyTotalExpense) : 0; // Ketahanan Dana Darurat (Bulan)

  // 2. Hitung Skor Keuangan (Skala 0 - 100)
  let score = 0;

  // Skor Rasio Utang (35 Poin)
  if (dsr <= 30) score += 35;
  else if (dsr <= 45) score += 20;
  else if (dsr <= 60) score += 10;

  // Skor Rasio Menabung (35 Poin)
  if (savingsRatio >= 20) score += 35;
  else if (savingsRatio >= 10) score += 25;
  else if (savingsRatio > 0) score += 10;

  // Skor Dana Darurat (30 Poin)
  if (efMonths >= 6) score += 30;
  else if (efMonths >= 3) score += 20;
  else if (efMonths >= 1) score += 10;

  // 3. Tampilkan Hasil
  document.getElementById('resultCard').style.display = 'block';
  document.getElementById('scoreValue').innerText = Math.round(score);
  document.getElementById('dsrValue').innerText = dsr.toFixed(1) + '%';
  document.getElementById('savingsRatioValue').innerText = savingsRatio.toFixed(1) + '%';
  document.getElementById('efMonthsValue').innerText = efMonths.toFixed(1) + ' Bulan';

  // Penilaian Status
  const statusTitle = document.getElementById('statusTitle');
  const statusDesc = document.getElementById('statusDesc');

  if (score >= 80) {
    statusTitle.innerText = "Sangat Sehat & Stabil 🚀";
    statusTitle.style.color = "#34d399";
    statusDesc.innerText = "Kondisi finansial kamu sangat kuat dan berisiko rendah.";
  } else if (score >= 60) {
    statusTitle.innerText = "Cukup Stabil 🟢";
    statusTitle.style.color = "#38bdf8";
    statusDesc.innerText = "Keuangan kamu dalam kondisi aman, namun bisa ditingkatkan lagi.";
  } else if (score >= 40) {
    statusTitle.innerText = "Waspada / Perlu Perbaikan ⚠️";
    statusTitle.style.color = "#fbbf24";
    statusDesc.innerText = "Ada beberapa indikator yang melebihi batas aman.";
  } else {
    statusTitle.innerText = "Bahaya Finansial 🚨";
    statusTitle.style.color = "#f87171";
    statusDesc.innerText = "Segera evaluasi dan kurangi pengeluaran / beban utang kamu.";
  }

  // Generate Nasihat
  generateAdvice(dsr, savingsRatio, efMonths, income - (expenses + debts + savings));

  // Render Grafik Donut
  renderChart(expenses, debts, savings, Math.max(0, income - (expenses + debts + savings)));

  // Scroll halus ke area hasil
  document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth' });
}

// Fungsi memberikan rekomendasi personal
function generateAdvice(dsr, savingsRatio, efMonths, cashflow) {
  const list = document.getElementById('adviceList');
  list.innerHTML = '';

  const adviceArr = [];

  if (dsr > 30) {
    adviceArr.push(`Rasio utang kamu (${dsr.toFixed(1)}%) terlalu tinggi. Usahakan untuk mengurangi cicilan bulanan hingga di bawah 30% dari penghasilan.`);
  } else {
    adviceArr.push(`Rasio utang kamu (${dsr.toFixed(1)}%) berada dalam batas sangat aman (maksimal 30%).`);
  }

  if (savingsRatio < 10) {
    adviceArr.push(`Rasio menabung kamu (${savingsRatio.toFixed(1)}%) masih di bawah target minimum 10%. Sisihkan uang di awal bulan, bukan menyisakan di akhir bulan.`);
  } else {
    adviceArr.push(`Bagus! Kamu berhasil menyisihkan ${savingsRatio.toFixed(1)}% pendapatan untuk tabungan/investasi.`);
  }

  if (efMonths < 3) {
    adviceArr.push(`Dana darurat kamu baru mencukupi kebutuhan ${efMonths.toFixed(1)} bulan. Alokasikan lebih banyak tabungan hingga mencapai minimal 3-6 bulan biaya hidup.`);
  } else {
    adviceArr.push(`Dana darurat kamu cukup kuat untuk menopang kebutuhan selama ${efMonths.toFixed(1)} bulan.`);
  }

  if (cashflow < 0) {
    adviceArr.push(`PERINGATAN: Arus kas bulanan kamu minus (defisit)! Pengeluaran melebihi pendapatan.`);
  }

  adviceArr.forEach(text => {
    const li = document.createElement('li');
    li.innerText = text;
    list.appendChild(li);
  });
}

// Fungsi menggambar Chart.js
function renderChart(expenses, debts, savings, remaining) {
  const ctx = document.getElementById('budgetChart').getContext('2d');

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Pengeluaran Rutin', 'Cicilan / Utang', 'Tabungan', 'Sisa Kas'],
      datasets: [{
        data: [expenses, debts, savings, remaining],
        backgroundColor: ['#f87171', '#fbbf24', '#34d399', '#38bdf8'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#cbd5e1' }
        }
      }
    }
  });
}