/* Local Storage Initial Seed Data */
const initialSeedData = [
  { id: "C101", text: "My order #8841 hasn't arrived after 12 days of express shipping.", category: "Delivery", sentiment: "Negative", priority: "High", action: "Escalate to logistics partner immediately.", draftReply: "Hi, we deeply apologize for the delay on order #8841. Our fulfillment team is actively investigating with the courier." },
  { id: "C102", text: "I noticed a duplicate charge of $89.50 on my credit card statement.", category: "Payment", sentiment: "Negative", priority: "High", action: "Verify transaction ledger and initiate refund.", draftReply: "Hello, we sincerely apologize for the billing glitch. We have issued a $89.50 refund request to your issuing bank." },
  { id: "C103", text: "The outer packaging arrived squashed and the item inside is cracked.", category: "Product", sentiment: "Negative", priority: "Medium", action: "Request photos and dispatch replacement item.", draftReply: "Dear customer, we are so sorry your item arrived damaged. Please reply with a quick photo so we can dispatch a fresh replacement." },
  { id: "C104", text: "How do I update my registered billing address for monthly invoices?", category: "Technical", sentiment: "Neutral", priority: "Low", action: "Provide account settings navigation guide.", draftReply: "Hi there! You can easily update your billing address by navigating to Profile -> Settings -> Billing." }
];

function getStoredComplaints() {
  const saved = localStorage.getItem("complaints_v2");
  if (!saved) {
    localStorage.setItem("complaints_v2", JSON.stringify(initialSeedData));
    return initialSeedData;
  }
  return JSON.parse(saved);
}

function saveStoredComplaints(arr) {
  localStorage.setItem("complaints_v2", JSON.stringify(arr));
  if (document.getElementById('dash-total')) {
    updateDashboardData();
  }
  if (document.getElementById('home-stat-total')) {
    updateHomeStats();
  }
}

/* Dark Mode Toggle & Persistence */
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const icon = document.getElementById('theme-icon');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    if (icon) icon.className = 'fa-solid fa-sun text-amber-400';
  } else {
    document.documentElement.classList.remove('dark');
    if (icon) icon.className = 'fa-solid fa-moon text-slate-600';
  }
}

function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.className = isDark ? 'fa-solid fa-sun text-amber-400' : 'fa-solid fa-moon text-slate-600';
  }

  if (document.getElementById('categoryChart')) {
    renderDashboardData();
  }
}

/* Form Sample Helpers */
function fillSample(type) {
  const txtArea = document.getElementById('complaintInput');
  if (!txtArea) return;

  if (type === 'double_charge') {
    txtArea.value = "I was charged twice ($129.99) on my credit card for order #55821. Please issue an immediate refund for the extra charge!";
  } else if (type === 'late_delivery') {
    txtArea.value = "I paid $25 extra for express 2-day delivery on Monday, but order #9921 still shows as processing! This is unacceptable.";
  } else if (type === 'damaged_item') {
    txtArea.value = "The package arrived with a torn box and the glass bottle inside was completely broken into pieces.";
  } else if (type === 'account_lock') {
    txtArea.value = "I tried logging in 3 times and now my admin account is locked. I need access to review customer tickets today.";
  }
  updateCharCount();
}

function updateCharCount() {
  const input = document.getElementById('complaintInput');
  const charCount = document.getElementById('charCount');
  if (input && charCount) {
    charCount.innerText = `${input.value.length} / 1000 chars`;
  }
}

/* Local Heuristic Fallback Analysis */
function runLocalRuleAnalysis(text) {
  const lower = text.toLowerCase();
  let category = "General";
  let priority = "Low";
  let sentiment = "Neutral";
  let action = "Standard customer support queue review.";
  let confidence = 88;

  if (lower.includes("charge") || lower.includes("pay") || lower.includes("card") || lower.includes("money") || lower.includes("billing")) {
    category = "Payment";
    priority = "High";
    sentiment = "Negative";
    action = "Audit merchant transaction ledger and initiate billing credit reversal.";
    confidence = 96;
  } else if (lower.includes("deliver") || lower.includes("ship") || lower.includes("courier") || lower.includes("tracking") || lower.includes("late")) {
    category = "Delivery";
    priority = lower.includes("express") ? "High" : "Medium";
    sentiment = "Negative";
    action = "Issue priority courier query ticket and provide real-time tracking update.";
    confidence = 92;
  } else if (lower.includes("broken") || lower.includes("damage") || lower.includes("crack") || lower.includes("defect") || lower.includes("quality")) {
    category = "Product";
    priority = "Medium";
    sentiment = "Negative";
    action = "Request photo proof from buyer and issue instant item replacement order.";
    confidence = 94;
  } else if (lower.includes("refund")) {
    category = "Refund";
    priority = "High";
    sentiment = "Negative";
    action = "Validate purchase return eligibility and flag for financial department signoff.";
    confidence = 95;
  } else if (lower.includes("lock") || lower.includes("password") || lower.includes("bug") || lower.includes("login") || lower.includes("error")) {
    category = "Technical";
    priority = "Medium";
    sentiment = "Neutral";
    action = "Trigger automated account identity verification email and unlock token.";
    confidence = 90;
  }

  const draftReply = `Dear Customer,\n\nThank you for bringing this to our attention regarding: "${text.substring(0, 50)}...".\n\nWe have automatically categorized your request under [${category}] with [${priority} Priority]. Our team is taking the following action: ${action}\n\nSincerely,\nCustomer Operations Team`;

  return {
    id: "C" + Math.floor(100 + Math.random() * 900),
    text: text,
    category: category,
    sentiment: sentiment,
    priority: priority,
    confidence: confidence,
    action: action,
    draftReply: draftReply
  };
}

/* Gemini LLM API Integration */
async function callGeminiAnalysis(text) {
  const apiKey = ""; // Canvas runtime key handler
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const systemPrompt = `You are an expert customer intelligence classifier. Analyze the customer complaint and return JSON ONLY with exact fields:
  - category: One of ["Payment", "Delivery", "Product", "Refund", "Technical", "General"]
  - sentiment: One of ["Positive", "Neutral", "Negative"]
  - priority: One of ["High", "Medium", "Low"]
  - confidence: Number between 80 and 99
  - action: Short 1-sentence recommended operational action
  - draftReply: A polite, empathetic 3-sentence email draft to the customer addressing their concern.`;

  const payload = {
    contents: [{ parts: [{ text: text }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Gemini API non-200 response");
    const data = await res.json();
    const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) throw new Error("Invalid Gemini response format");

    const parsed = JSON.parse(jsonText);
    return {
      id: "C" + Math.floor(100 + Math.random() * 900),
      text: text,
      category: parsed.category || "General",
      sentiment: parsed.sentiment || "Negative",
      priority: parsed.priority || "Medium",
      confidence: parsed.confidence || 92,
      action: parsed.action || "Assigned to support agent queue.",
      draftReply: parsed.draftReply || "Thank you for contacting customer service."
    };
  } catch (err) {
    console.warn("Gemini API failed, using Local Fallback Engine:", err);
    return runLocalRuleAnalysis(text);
  }
}

/* Form Submission Handler */
async function handleComplaintSubmit(e) {
  e.preventDefault();
  const text = document.getElementById('complaintInput').value.trim();
  const engineType = document.getElementById('engineType').value;
  const submitBtn = document.getElementById('submitBtn');

  if (!text) return;

  // UI Loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> AI Engine Analyzing...`;

  let result;
  if (engineType === 'gemini') {
    result = await callGeminiAnalysis(text);
  } else {
    await new Promise(r => setTimeout(r, 600)); // smooth delay simulation
    result = runLocalRuleAnalysis(text);
  }

  // Save result to LocalStorage
  const all = getStoredComplaints();
  all.unshift(result);
  saveStoredComplaints(all);
  localStorage.setItem("latest_result", JSON.stringify(result));

  // Redirect to result page
  window.location.href = "result.html";
}

function displayAnalysisResult(res) {
  if (!res) return;
  const originalTextEl = document.getElementById('res-original-text');
  if (!originalTextEl) return;

  originalTextEl.innerText = `"${res.text}"`;
  document.getElementById('res-category').innerText = res.category;
  document.getElementById('res-confidence').innerText = `Conf: ${res.confidence}%`;
  document.getElementById('res-sentiment').innerText = res.sentiment;
  document.getElementById('res-action').innerText = res.action;
  document.getElementById('res-draft-reply').innerText = res.draftReply;

  const prioEl = document.getElementById('res-priority');
  if (prioEl) {
    prioEl.innerText = res.priority;
    if (res.priority === 'High') {
      prioEl.className = "px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";
    } else if (res.priority === 'Medium') {
      prioEl.className = "px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
    } else {
      prioEl.className = "px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
    }
  }
}

function copyDraftReply() {
  const text = document.getElementById('res-draft-reply').innerText;
  navigator.clipboard.writeText(text);
  showToast("Draft reply copied to clipboard!");
}

/* History Table Renderer */
function renderHistoryTable() {
  const tbody = document.getElementById('historyTableBody');
  if (!tbody) return;

  const complaints = getStoredComplaints();
  
  if (!complaints || complaints.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-400 italic">No stored complaints found. Submit a new complaint to get started!</td></tr>`;
    return;
  }

  tbody.innerHTML = complaints.map(c => `
    <tr class="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition">
      <td class="py-3 px-4 font-bold text-blue-600 dark:text-blue-400">${c.id}</td>
      <td class="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300" title="${c.text}">${c.text}</td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">${c.category}</span>
      </td>
      <td class="py-3 px-4">
        <span class="text-xs font-semibold ${c.sentiment === 'Negative' ? 'text-rose-500' : 'text-slate-400'}">${c.sentiment}</span>
      </td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${c.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : c.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}">${c.priority}</span>
      </td>
      <td class="py-3 px-4 text-right">
        <button onclick="viewHistoryDetail('${c.id}')" class="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-xs font-semibold transition">
          View
        </button>
      </td>
    </tr>
  `).join('');
}

function filterHistoryTable() {
  const searchEl = document.getElementById('historySearch');
  const catEl = document.getElementById('filterCategory');
  const prioEl = document.getElementById('filterPriority');
  const tbody = document.getElementById('historyTableBody');

  if (!tbody || !searchEl || !catEl || !prioEl) return;

  const query = searchEl.value.toLowerCase();
  const cat = catEl.value;
  const prio = prioEl.value;

  const complaints = getStoredComplaints();
  const filtered = complaints.filter(c => {
    const matchesText = c.text.toLowerCase().includes(query) || c.id.toLowerCase().includes(query);
    const matchesCat = cat === 'ALL' || c.category === cat;
    const matchesPrio = prio === 'ALL' || c.priority === prio;
    return matchesText && matchesCat && matchesPrio;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-400 italic">No matching complaints match your search filters.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(c => `
    <tr class="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition">
      <td class="py-3 px-4 font-bold text-blue-600 dark:text-blue-400">${c.id}</td>
      <td class="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300" title="${c.text}">${c.text}</td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">${c.category}</span>
      </td>
      <td class="py-3 px-4">
        <span class="text-xs font-semibold ${c.sentiment === 'Negative' ? 'text-rose-500' : 'text-slate-400'}">${c.sentiment}</span>
      </td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${c.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : c.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}">${c.priority}</span>
      </td>
      <td class="py-3 px-4 text-right">
        <button onclick="viewHistoryDetail('${c.id}')" class="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-xs font-semibold transition">
          View
        </button>
      </td>
    </tr>
  `).join('');
}

function viewHistoryDetail(id) {
  const item = getStoredComplaints().find(c => c.id === id);
  if (item) {
    localStorage.setItem("latest_result", JSON.stringify(item));
    window.location.href = "result.html";
  }
}

function clearHistory() {
  localStorage.removeItem("complaints_v2");
  renderHistoryTable();
  if (document.getElementById('dash-total')) updateDashboardData();
  if (document.getElementById('home-stat-total')) updateHomeStats();
  showToast("History cleared successfully!");
}

let categoryChartInstance = null;
let priorityChartInstance = null;

function renderDashboardData() {
  const dashTotal = document.getElementById('dash-total');
  if (!dashTotal) return;

  const complaints = getStoredComplaints();
  const total = complaints.length;
  const highCount = complaints.filter(c => c.priority === 'High').length;
  const negCount = complaints.filter(c => c.sentiment === 'Negative').length;

  dashTotal.innerText = total;
  document.getElementById('dash-high').innerText = highCount;
  document.getElementById('dash-negative').innerText = negCount;
  document.getElementById('dash-high-pct').innerText = total > 0 ? `${Math.round((highCount / total) * 100)}% of total volume` : '0%';

  // Category breakdown aggregation
  const categories = {};
  const priorities = { High: 0, Medium: 0, Low: 0 };

  complaints.forEach(c => {
    categories[c.category] = (categories[c.category] || 0) + 1;
    if (priorities[c.priority] !== undefined) priorities[c.priority]++;
  });

  // Find top category
  let topCat = "-";
  let maxCatCount = 0;
  Object.entries(categories).forEach(([cat, cnt]) => {
    if (cnt > maxCatCount) {
      maxCatCount = cnt;
      topCat = cat;
    }
  });
  document.getElementById('dash-top-cat').innerText = topCat;

  // Chart.js - Category Doughnut Chart
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#f8fafc' : '#0f172a';

  const ctx1 = document.getElementById('categoryChart').getContext('2d');
  if (categoryChartInstance) categoryChartInstance.destroy();
  categoryChartInstance = new Chart(ctx1, {
    type: 'doughnut',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#64748b'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
        }
      }
    }
  });

  // Chart.js - Priority Bar Chart
  const ctx2 = document.getElementById('priorityChart').getContext('2d');
  if (priorityChartInstance) priorityChartInstance.destroy();
  priorityChartInstance = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['High Urgency', 'Medium Priority', 'Low Urgency'],
      datasets: [{
        label: 'Complaints Count',
        data: [priorities.High, priorities.Medium, priorities.Low],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { ticks: { color: textColor }, grid: { display: false } },
        y: { ticks: { color: textColor }, grid: { color: isDark ? '#1e293b' : '#f1f5f9' }, beginAtZero: true }
      }
    }
  });
}

function updateHomeStats() {
  const totalEl = document.getElementById('home-stat-total');
  if (!totalEl) return;
  const complaints = getStoredComplaints();
  totalEl.innerText = complaints.length;
  document.getElementById('home-stat-high').innerText = complaints.filter(c => c.priority === 'High').length;
}

/* Toast Notification Helper */
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toast-msg').innerText = msg;
  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
  }, 3000);
}

/* Initialize Page Context on DOM Content Loaded */
window.addEventListener('DOMContentLoaded', () => {
  initTheme();

  if (document.getElementById('home-stat-total')) {
    updateHomeStats();
  }
  if (document.getElementById('historyTableBody')) {
    renderHistoryTable();
  }
  if (document.getElementById('categoryChart')) {
    renderDashboardData();
  }
  if (document.getElementById('res-original-text')) {
    const rawResult = localStorage.getItem("latest_result");
    if (rawResult) {
      displayAnalysisResult(JSON.parse(rawResult));
    }
  }
});
