// Select elements
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const listEl = document.getElementById("list");
const form = document.getElementById("transaction-form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");

// LocalStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Chart.js
let chart;
const ctx = document.getElementById("expense-chart").getContext("2d");

// Add new transaction
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    category: category.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  render();
  form.reset();
});

// Render transactions
function render() {
  listEl.innerHTML = "";

  transactions.forEach((item) => {
    const sign = item.amount < 0 ? "-" : "+";
    const itemEl = document.createElement("li");
    itemEl.classList.add(item.amount < 0 ? "minus" : "plus");
    itemEl.innerHTML = `
      ${item.text} (${item.category}) <span>${sign}$${Math.abs(item.amount)}</span>
      <button onclick="removeTransaction(${item.id})">x</button>
    `;
    listEl.appendChild(itemEl);
  });

  updateValues();
  updateChart();
}

// Remove transaction
function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateLocalStorage();
  render();
}

// Update balance and totals
function updateValues() {
  const amounts = transactions.map((t) => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const income = amounts.filter((v) => v > 0).reduce((a, b) => a + b, 0).toFixed(2);
  const expense = (
    amounts.filter((v) => v < 0).reduce((a, b) => a + b, 0) * -1
  ).toFixed(2);

  balanceEl.innerText = `$${total}`;
  incomeEl.innerText = `$${income}`;
  expenseEl.innerText = `$${expense}`;
}

// Update pie chart
function updateChart() {
  const expenseData = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => {
      const cat = t.category;
      const amt = Math.abs(t.amount);
      acc[cat] = (acc[cat] || 0) + amt;
      return acc;
    }, {});

  const labels = Object.keys(expenseData);
  const data = Object.values(expenseData);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          "#e74c3c", "#f1c40f", "#2ecc71", "#9b59b6", "#3498db"
        ],
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

// Save to localStorage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initial render
render();
