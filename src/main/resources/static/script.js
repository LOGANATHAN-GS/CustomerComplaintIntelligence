/* =========================================================
   COMPLAINT AI - MAIN SCRIPT
   ========================================================= */


/* =========================================================
   LOCAL STORAGE INITIAL SEED DATA
   ---------------------------------------------------------
   Kept only for old frontend compatibility.
   REAL complaint data for Analyze, History and Dashboard
   now comes from the Spring Boot + H2 backend.
   ========================================================= */

const initialSeedData = [
  {
    id: "C101",
    text: "My order #8841 hasn't arrived after 12 days of express shipping.",
    category: "Delivery",
    sentiment: "Negative",
    priority: "High",
    action: "Escalate to logistics partner immediately.",
    draftReply:
      "Hi, we deeply apologize for the delay on order #8841. Our fulfillment team is actively investigating with the courier."
  },
  {
    id: "C102",
    text: "I noticed a duplicate charge of $89.50 on my credit card statement.",
    category: "Payment",
    sentiment: "Negative",
    priority: "High",
    action: "Verify transaction ledger and initiate refund.",
    draftReply:
      "Hello, we sincerely apologize for the billing glitch. We have issued a refund request."
  },
  {
    id: "C103",
    text: "The outer packaging arrived squashed and the item inside is cracked.",
    category: "Product",
    sentiment: "Negative",
    priority: "Medium",
    action: "Request photos and dispatch replacement item.",
    draftReply:
      "Dear customer, we are so sorry your item arrived damaged. Please reply with a photo so we can arrange a replacement."
  },
  {
    id: "C104",
    text: "How do I update my registered billing address for monthly invoices?",
    category: "Technical",
    sentiment: "Neutral",
    priority: "Low",
    action: "Provide account settings navigation guide.",
    draftReply:
      "Hi there! You can update your billing address through Profile -> Settings -> Billing."
  }
];


/* =========================================================
   LOCAL STORAGE HELPERS
   ========================================================= */

function getStoredComplaints() {

  const saved =
    localStorage.getItem("complaints_v2");

  if (!saved) {

    localStorage.setItem(
      "complaints_v2",
      JSON.stringify(initialSeedData)
    );

    return initialSeedData;
  }

  try {

    return JSON.parse(saved);

  } catch (error) {

    console.error(
      "Error reading localStorage:",
      error
    );

    return [];
  }
}


function saveStoredComplaints(arr) {

  localStorage.setItem(
    "complaints_v2",
    JSON.stringify(arr)
  );
}


/* =========================================================
   DARK MODE
   ---------------------------------------------------------
   KEEPING YOUR ORIGINAL DARK MODE SYSTEM
   ========================================================= */

function initTheme() {

  const savedTheme =
    localStorage.getItem("theme");

  const icon =
    document.getElementById("theme-icon");


  if (
    savedTheme === "dark" ||
    (
      !savedTheme &&
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
    )
  ) {

    document.documentElement.classList.add(
      "dark"
    );

    if (icon) {

      icon.className =
        "fa-solid fa-sun text-amber-400";
    }

  } else {

    document.documentElement.classList.remove(
      "dark"
    );

    if (icon) {

      icon.className =
        "fa-solid fa-moon text-slate-600";
    }
  }
}


function toggleDarkMode() {

  document.documentElement.classList.toggle(
    "dark"
  );


  const isDark =
    document.documentElement.classList.contains(
      "dark"
    );


  localStorage.setItem(
    "theme",
    isDark ? "dark" : "light"
  );


  const icon =
    document.getElementById(
      "theme-icon"
    );


  if (icon) {

    icon.className =
      isDark
        ? "fa-solid fa-sun text-amber-400"
        : "fa-solid fa-moon text-slate-600";
  }


  /*
     Redraw dashboard charts
     when theme changes.
  */

  if (
    document.getElementById(
      "categoryChart"
    )
  ) {

    renderDashboardData();
  }
}


/* =========================================================
   SAMPLE COMPLAINT HELPERS
   ========================================================= */

function fillSample(type) {

  const txtArea =
    document.getElementById(
      "complaintInput"
    );


  if (!txtArea) {
    return;
  }


  if (type === "double_charge") {

    txtArea.value =
      "I was charged twice ($129.99) on my credit card for order #55821. Please issue an immediate refund for the extra charge!";

  } else if (type === "late_delivery") {

    txtArea.value =
      "I paid $25 extra for express 2-day delivery on Monday, but order #9921 still shows as processing! This is unacceptable.";

  } else if (type === "damaged_item") {

    txtArea.value =
      "The package arrived with a torn box and the glass bottle inside was completely broken into pieces.";

  } else if (type === "account_lock") {

    txtArea.value =
      "I tried logging in 3 times and now my admin account is locked. I need access to review customer tickets today.";
  }


  updateCharCount();
}


/* =========================================================
   CHARACTER COUNTER
   ========================================================= */

function updateCharCount() {

  const input =
    document.getElementById(
      "complaintInput"
    );

  const charCount =
    document.getElementById(
      "charCount"
    );


  if (
    input &&
    charCount
  ) {

    charCount.innerText =
      `${input.value.length} / 1000 chars`;
  }
}


/* =========================================================
   LOCAL RULE-BASED FALLBACK
   ========================================================= */

function runLocalRuleAnalysis(text) {

  const lower =
    text.toLowerCase();


  let category =
    "General";

  let priority =
    "Low";

  let sentiment =
    "Neutral";

  let action =
    "Standard customer support queue review.";

  let confidence =
    88;


  if (
    lower.includes("charge") ||
    lower.includes("pay") ||
    lower.includes("card") ||
    lower.includes("money") ||
    lower.includes("billing")
  ) {

    category =
      "Payment";

    priority =
      "High";

    sentiment =
      "Negative";

    action =
      "Audit merchant transaction ledger and initiate billing credit reversal.";

    confidence =
      96;

  } else if (
    lower.includes("deliver") ||
    lower.includes("ship") ||
    lower.includes("courier") ||
    lower.includes("tracking") ||
    lower.includes("late")
  ) {

    category =
      "Delivery";

    priority =
      lower.includes("express")
        ? "High"
        : "Medium";

    sentiment =
      "Negative";

    action =
      "Issue priority courier query ticket and provide real-time tracking update.";

    confidence =
      92;

  } else if (
    lower.includes("broken") ||
    lower.includes("damage") ||
    lower.includes("crack") ||
    lower.includes("defect") ||
    lower.includes("quality")
  ) {

    category =
      "Product";

    priority =
      "Medium";

    sentiment =
      "Negative";

    action =
      "Request photo proof from buyer and issue item replacement order.";

    confidence =
      94;

  } else if (
    lower.includes("refund")
  ) {

    category =
      "Refund";

    priority =
      "High";

    sentiment =
      "Negative";

    action =
      "Validate purchase return eligibility and flag for financial department signoff.";

    confidence =
      95;

  } else if (
    lower.includes("lock") ||
    lower.includes("password") ||
    lower.includes("bug") ||
    lower.includes("login") ||
    lower.includes("error")
  ) {

    category =
      "Technical";

    priority =
      "Medium";

    sentiment =
      "Neutral";

    action =
      "Trigger automated account identity verification email and unlock token.";

    confidence =
      90;
  }


  const draftReply =
    `Dear Customer,

Thank you for bringing this to our attention regarding: "${text.substring(0, 50)}...".

We have automatically categorized your request under [${category}] with [${priority} Priority]. Our team is taking the following action: ${action}

Sincerely,
Customer Operations Team`;


  return {

    id:
      "C" +
      Math.floor(
        100 +
        Math.random() * 900
      ),

    text:
      text,

    category:
      category,

    sentiment:
      sentiment,

    priority:
      priority,

    confidence:
      confidence,

    action:
      action,

    draftReply:
      draftReply
  };
}


/* =========================================================
   GEMINI FALLBACK
   ========================================================= */

async function callGeminiAnalysis(text) {

  const apiKey = "";

  const apiUrl =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;


  const systemPrompt = `
You are an expert customer intelligence classifier.

Analyze the customer complaint and return JSON ONLY with exact fields:

category:
One of ["Payment", "Delivery", "Product", "Refund", "Technical", "General"]

sentiment:
One of ["Positive", "Neutral", "Negative"]

priority:
One of ["High", "Medium", "Low"]

confidence:
Number between 80 and 99

action:
Short 1-sentence recommended operational action

draftReply:
A polite, empathetic 3-sentence email draft to the customer addressing their concern.
`;


  const payload = {

    contents: [

      {
        parts: [
          {
            text: text
          }
        ]
      }

    ],

    systemInstruction: {

      parts: [
        {
          text: systemPrompt
        }
      ]

    },

    generationConfig: {

      responseMimeType:
        "application/json"
    }
  };


  try {

    const res =
      await fetch(
        apiUrl,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(payload)
        }
      );


    if (!res.ok) {

      throw new Error(
        "Gemini API non-200 response"
      );
    }


    const data =
      await res.json();


    const jsonText =
      data
        .candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;


    if (!jsonText) {

      throw new Error(
        "Invalid Gemini response format"
      );
    }


    const parsed =
      JSON.parse(jsonText);


    return {

      id:
        "C" +
        Math.floor(
          100 +
          Math.random() * 900
        ),

      text:
        text,

      category:
        parsed.category ||
        "General",

      sentiment:
        parsed.sentiment ||
        "Negative",

      priority:
        parsed.priority ||
        "Medium",

      confidence:
        parsed.confidence ||
        92,

      action:
        parsed.action ||
        "Assigned to support agent queue.",

      draftReply:
        parsed.draftReply ||
        "Thank you for contacting customer service."
    };


  } catch (err) {

    console.warn(
      "Gemini API failed. Using local fallback:",
      err
    );


    return runLocalRuleAnalysis(
      text
    );
  }
}


/* =========================================================
   BACKEND API - ANALYZE
   ========================================================= */

async function analyzeComplaintWithBackend(
  text
) {

  const response =
    await fetch(
      "/api/complaints/analyze",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            complaintText:
              text
          })
      }
    );


  if (!response.ok) {

    throw new Error(
      `Backend returned HTTP ${response.status}`
    );
  }


  return await response.json();
}


/* =========================================================
   COMPLAINT FORM SUBMISSION
   ========================================================= */

let complaintSubmissionInProgress = false;

async function handleComplaintSubmit(e) {

  e.preventDefault();

  if (complaintSubmissionInProgress) {
    return;
  }

  complaintSubmissionInProgress = true;

  const input = document.getElementById('complaintInput');
  const submitBtn = document.getElementById('submitBtn');

  if (!input) {
    complaintSubmissionInProgress = false;
    return;
  }

  const text = input.value.trim();

  if (!text) {
    showToast('Please enter a complaint.');
    complaintSubmissionInProgress = false;
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> AI Engine Analyzing...';
  }

  try {

    const payload = await analyzeComplaintWithBackend(text);

    // Extract only the complaint reference ID for the customer-safe result flow
    const complaintId = payload && payload.id ? payload.id : "";

    if (complaintId) {
      sessionStorage.setItem("customer_tracking_id", complaintId);
      localStorage.setItem("customer_tracking_id", complaintId);
      localStorage.removeItem("latest_result");
      window.location.href = `result.html?id=${encodeURIComponent(complaintId)}`;
    } else {
      window.location.href = "result.html";
    }

  } catch (err) {

    console.error('Complaint analysis failed:', err);

    showToast(
      err.message ||
      'Unable to analyze complaint.'
    );

  } finally {

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Analyze Complaint';
    }

    complaintSubmissionInProgress = false;
  }
}


/* =========================================================
   CUSTOMER-SAFE CONFIRMATION & TRACKING
   ========================================================= */

async function fetchCustomerComplaint(id) {
  const response = await fetch(
    `/api/customer/complaints/${encodeURIComponent(id)}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Reference ID "${id}" was not found.`);
    }
    throw new Error(`Unable to fetch complaint details (HTTP ${response.status}).`);
  }

  return await response.json();
}

function renderCustomerConfirmation(data) {
  if (!data) return;

  const refIdEl = document.getElementById("res-ref-id");
  if (refIdEl) {
    refIdEl.innerText = data.id || "-";
  }

  const statusEl = document.getElementById("res-status");
  if (statusEl) {
    statusEl.innerText = data.status || "RECEIVED";
  }

  const dateEl = document.getElementById("res-created-at");
  if (dateEl) {
    if (data.createdAt) {
      try {
        const d = new Date(data.createdAt);
        dateEl.innerText = isNaN(d.getTime()) ? data.createdAt : d.toLocaleString();
      } catch (e) {
        dateEl.innerText = data.createdAt;
      }
    } else {
      dateEl.innerText = "Just now";
    }
  }

  const msgEl = document.getElementById("res-message");
  if (msgEl) {
    msgEl.innerText =
      data.message ||
      "Your complaint has been received and is currently under review.";
  }

  const textEl = document.getElementById("res-complaint-text");
  if (textEl) {
    textEl.innerText = data.complaintText || "";
  }

  const resultCard = document.getElementById("customer-result-card");
  if (resultCard) {
    resultCard.classList.remove("hidden");
  }

  const emptyNotice = document.getElementById("res-empty-notice");
  if (emptyNotice) {
    emptyNotice.classList.add("hidden");
  }
}

async function initResultPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const idFromUrl = urlParams.get("id");
  const idFromStorage =
    sessionStorage.getItem("customer_tracking_id") ||
    localStorage.getItem("customer_tracking_id");
  const complaintId = (idFromUrl || idFromStorage || "").trim();

  const trackInput = document.getElementById("trackInput");
  if (trackInput && complaintId) {
    trackInput.value = complaintId;
  }

  if (!complaintId) {
    const emptyNotice = document.getElementById("res-empty-notice");
    if (emptyNotice) {
      emptyNotice.classList.remove("hidden");
    }
    const resultCard = document.getElementById("customer-result-card");
    if (resultCard) {
      resultCard.classList.add("hidden");
    }
    return;
  }

  try {
    const data = await fetchCustomerComplaint(complaintId);
    renderCustomerConfirmation(data);
  } catch (error) {
    console.error("Failed to load customer complaint:", error);
    showToast(error.message);
    const emptyNotice = document.getElementById("res-empty-notice");
    if (emptyNotice) {
      emptyNotice.innerText = error.message;
      emptyNotice.classList.remove("hidden");
    }
  }
}

async function trackComplaintById() {
  const trackInput = document.getElementById("trackInput");
  if (!trackInput) return;

  const id = trackInput.value.trim();
  if (!id) {
    showToast("Please enter a Reference ID to track.");
    return;
  }

  try {
    const data = await fetchCustomerComplaint(id);
    renderCustomerConfirmation(data);
    sessionStorage.setItem("customer_tracking_id", id);
    localStorage.setItem("customer_tracking_id", id);

    const newUrl =
      window.location.pathname + "?id=" + encodeURIComponent(id);
    window.history.replaceState({ path: newUrl }, "", newUrl);

    showToast("Complaint status loaded.");
  } catch (error) {
    showToast(error.message);
  }
}

function copyReferenceId() {
  const refIdEl = document.getElementById("res-ref-id");
  if (!refIdEl) return;
  const id = refIdEl.innerText.trim();
  if (!id || id === "-") return;

  navigator.clipboard
    .writeText(id)
    .then(() => {
      showToast("Reference ID copied to clipboard!");
    })
    .catch(() => {
      showToast("Unable to copy Reference ID.");
    });
}


/* =========================================================
   BACKEND - GET ALL COMPLAINTS
   ========================================================= */

async function fetchBackendComplaints() {

  const response =
    await fetch(
      "/api/complaints"
    );


  if (!response.ok) {

    throw new Error(
      `Backend returned HTTP ${response.status}`
    );
  }


  const complaints =
    await response.json();


  return complaints.map(
    c => ({

      id:
        c.id,

      text:
        c.complaintText,

      category:
        c.category,

      sentiment:
        c.sentiment,

      priority:
        c.priority,

      confidence:
        Math.round(
          (c.confidenceScore || 0) *
          100
        ),

      action:
        c.actionRecommended,

      draftReply:
        c.draftReply,

      createdAt:
        c.createdAt
    })
  );
}


/* =========================================================
   HISTORY
   ========================================================= */

let backendComplaints = [];


async function renderHistoryTable() {

  const tbody =
    document.getElementById(
      "historyTableBody"
    );


  if (!tbody) {
    return;
  }


  tbody.innerHTML = `
    <tr>
      <td colspan="6"
          class="py-8 text-center text-slate-400">
        Loading complaints...
      </td>
    </tr>
  `;


  try {

    backendComplaints =
      await fetchBackendComplaints();


    if (
      backendComplaints.length === 0
    ) {

      tbody.innerHTML = `
        <tr>
          <td colspan="6"
              class="py-8 text-center text-slate-400 italic">
            No stored complaints found.
          </td>
        </tr>
      `;

      return;
    }


    renderHistoryRows(
      backendComplaints
    );


  } catch (error) {

    console.error(
      "History loading error:",
      error
    );


    tbody.innerHTML = `
      <tr>
        <td colspan="6"
            class="py-8 text-center text-rose-500">
          Unable to load complaints from backend.
        </td>
      </tr>
    `;
  }
}


/* =========================================================
   HISTORY ROWS
   ========================================================= */

function renderHistoryRows(
  complaints
) {

  const tbody =
    document.getElementById(
      "historyTableBody"
    );


  if (!tbody) {
    return;
  }


  if (
    !complaints ||
    complaints.length === 0
  ) {

    tbody.innerHTML = `
      <tr>
        <td colspan="6"
            class="py-8 text-center text-slate-400 italic">
          No matching complaints found.
        </td>
      </tr>
    `;

    return;
  }


  tbody.innerHTML =
    complaints.map(
      c => `

      <tr class="
        hover:bg-slate-100/50
        dark:hover:bg-slate-900/50
        transition
      ">

        <td class="
          py-3 px-4
          font-bold
          text-blue-600
          dark:text-blue-400
        ">
          ${escapeHtml(c.id)}
        </td>


        <td
          class="
            py-3 px-4
            max-w-xs
            truncate
            text-slate-600
            dark:text-slate-300
          "
          title="${escapeHtml(c.text)}"
        >
          ${escapeHtml(c.text)}
        </td>


        <td class="py-3 px-4">

          <span class="
            px-2.5 py-1
            rounded-lg
            bg-slate-100
            dark:bg-slate-800
            text-slate-700
            dark:text-slate-300
            font-semibold
            text-[11px]
          ">
            ${escapeHtml(c.category)}
          </span>

        </td>


        <td class="py-3 px-4">

          <span class="
            text-xs
            font-semibold
            ${
              c.sentiment === "Negative"
                ? "text-rose-500"
                : c.sentiment === "Positive"
                  ? "text-emerald-500"
                  : "text-slate-400"
            }
          ">
            ${escapeHtml(c.sentiment)}
          </span>

        </td>


        <td class="py-3 px-4">

          <span class="
            px-2.5
            py-0.5
            rounded-full
            text-[10px]
            font-extrabold
            uppercase

            ${
              c.priority === "High"
                ? "bg-rose-500/10 text-rose-500"
                : c.priority === "Medium"
                  ? "bg-amber-500/10 text-amber-500"
                  : "bg-emerald-500/10 text-emerald-500"
            }
          ">
            ${escapeHtml(c.priority)}
          </span>

        </td>


        <td class="py-3 px-4 text-right">

          <button
            onclick="viewHistoryDetail('${escapeHtml(c.id)}')"
            class="
              px-2.5
              py-1
              rounded-lg
              bg-blue-500/10
              text-blue-600
              hover:bg-blue-500/20
              text-xs
              font-semibold
              transition
            "
          >
            View
          </button>

        </td>

      </tr>

    `
    ).join("");
}


/* =========================================================
   HISTORY FILTER
   ========================================================= */

function filterHistoryTable() {

  const searchEl =
    document.getElementById(
      "historySearch"
    );

  const catEl =
    document.getElementById(
      "filterCategory"
    );

  const prioEl =
    document.getElementById(
      "filterPriority"
    );


  if (!searchEl) {
    return;
  }


  const query =
    searchEl.value
      .toLowerCase()
      .trim();


  const category =
    catEl
      ? catEl.value
      : "ALL";


  const priority =
    prioEl
      ? prioEl.value
      : "ALL";


  const filtered =
    backendComplaints.filter(
      c => {

        const text =
          `${c.id} ${c.text} ${c.category}`
            .toLowerCase();


        const matchesText =
          text.includes(query);


        const matchesCategory =
          category === "ALL" ||
          c.category === category;


        const matchesPriority =
          priority === "ALL" ||
          c.priority === priority;


        return (
          matchesText &&
          matchesCategory &&
          matchesPriority
        );
      }
    );


  renderHistoryRows(
    filtered
  );
}


/* =========================================================
   HISTORY DETAIL
   ========================================================= */

function viewHistoryDetail(id) {

  const item =
    backendComplaints.find(
      c => c.id === id
    );


  if (!item) {

    showToast(
      "Complaint details not found."
    );

    return;
  }

  sessionStorage.setItem("customer_tracking_id", item.id);
  localStorage.setItem("customer_tracking_id", item.id);
  localStorage.removeItem("latest_result");

  window.location.href =
    `result.html?id=${encodeURIComponent(item.id)}`;
}


/* =========================================================
   CLEAR HISTORY
   ---------------------------------------------------------
   Disabled because real history is stored in H2.
   ========================================================= */

function clearHistory() {

  showToast(
    "History is stored in the backend database. Clear History is not available yet."
  );
}


/* =========================================================
   DASHBOARD
   ========================================================= */

let categoryChartInstance =
  null;

let priorityChartInstance =
  null;


async function renderDashboardData() {

  const dashTotal =
    document.getElementById(
      "dash-total"
    );


  if (!dashTotal) {
    return;
  }


  try {

    dashTotal.innerText =
      "...";


    const complaints =
      await fetchBackendComplaints();


    /*
       TOTAL
    */

    const total =
      complaints.length;


    /*
       HIGH PRIORITY
    */

    const highCount =
      complaints.filter(
        c =>
          c.priority === "High"
      ).length;


    /*
       NEGATIVE SENTIMENT
    */

    const negCount =
      complaints.filter(
        c =>
          c.sentiment === "Negative"
      ).length;


    /*
       UPDATE TOTAL
    */

    dashTotal.innerText =
      total;


    /*
       HIGH
    */

    const highEl =
      document.getElementById(
        "dash-high"
      );


    if (highEl) {

      highEl.innerText =
        highCount;
    }


    /*
       NEGATIVE
    */

    const negativeEl =
      document.getElementById(
        "dash-negative"
      );


    if (negativeEl) {

      negativeEl.innerText =
        negCount;
    }


    /*
       HIGH PERCENTAGE
    */

    const highPct =
      document.getElementById(
        "dash-high-pct"
      );


    if (highPct) {

      highPct.innerText =
        total > 0
          ? `${Math.round(
              (highCount / total) * 100
            )}% of total volume`
          : "0%";
    }


    /*
       CATEGORY COUNTS
    */

    const categories = {};


    complaints.forEach(
      c => {

        const category =
          c.category ||
          "General";


        categories[category] =
          (
            categories[category] ||
            0
          ) + 1;
      }
    );


    /*
       TOP CATEGORY
    */

    let topCategory =
      "-";

    let maxCategoryCount =
      0;


    Object.entries(
      categories
    ).forEach(
      ([category, count]) => {

        if (
          count >
          maxCategoryCount
        ) {

          maxCategoryCount =
            count;

          topCategory =
            category;
        }
      }
    );


    const topCategoryEl =
      document.getElementById(
        "dash-top-cat"
      );


    if (topCategoryEl) {

      topCategoryEl.innerText =
        topCategory;
    }


    /*
       PRIORITY COUNTS
    */

    const priorities = {

      High: 0,

      Medium: 0,

      Low: 0
    };


    complaints.forEach(
      c => {

        if (
          priorities[c.priority]
          !== undefined
        ) {

          priorities[
            c.priority
          ]++;
        }
      }
    );


    /*
       DARK MODE COLORS
    */

    const isDark =
      document.documentElement
        .classList
        .contains("dark");


    const textColor =
      isDark
        ? "#f8fafc"
        : "#0f172a";


    /*
       CATEGORY CHART
    */

    const categoryCanvas =
      document.getElementById(
        "categoryChart"
      );


    if (
      categoryCanvas &&
      typeof Chart !== "undefined"
    ) {

      const ctx1 =
        categoryCanvas.getContext(
          "2d"
        );


      if (
        categoryChartInstance
      ) {

        categoryChartInstance.destroy();
      }


      categoryChartInstance =
        new Chart(
          ctx1,
          {

            type:
              "doughnut",

            data: {

              labels:
                Object.keys(
                  categories
                ),

              datasets: [

                {

                  data:
                    Object.values(
                      categories
                    ),

                  backgroundColor: [

                    "#3b82f6",

                    "#8b5cf6",

                    "#f59e0b",

                    "#10b981",

                    "#ef4444",

                    "#64748b"
                  ],

                  borderWidth:
                    0
                }
              ]
            },

            options: {

              responsive:
                true,

              maintainAspectRatio:
                false,

              plugins: {

                legend: {

                  position:
                    "bottom",

                  labels: {

                    color:
                      textColor,

                    font: {

                      family:
                        "Plus Jakarta Sans",

                      size:
                        11
                    }
                  }
                }
              }
            }
          }
        );
    }


    /*
       PRIORITY BAR CHART
    */

    const priorityCanvas =
      document.getElementById(
        "priorityChart"
      );


    if (
      priorityCanvas &&
      typeof Chart !== "undefined"
    ) {

      const ctx2 =
        priorityCanvas.getContext(
          "2d"
        );


      if (
        priorityChartInstance
      ) {

        priorityChartInstance.destroy();
      }


      priorityChartInstance =
        new Chart(
          ctx2,
          {

            type:
              "bar",

            data: {

              labels: [

                "High Urgency",

                "Medium Priority",

                "Low Urgency"
              ],

              datasets: [

                {

                  label:
                    "Complaints Count",

                  data: [

                    priorities.High,

                    priorities.Medium,

                    priorities.Low
                  ],

                  backgroundColor: [

                    "#ef4444",

                    "#f59e0b",

                    "#10b981"
                  ],

                  borderRadius:
                    8
                }
              ]
            },

            options: {

              responsive:
                true,

              maintainAspectRatio:
                false,

              plugins: {

                legend: {

                  display:
                    false
                }
              },

              scales: {

                x: {

                  ticks: {

                    color:
                      textColor
                  },

                  grid: {

                    display:
                      false
                  }
                },

                y: {

                  beginAtZero:
                    true,

                  ticks: {

                    color:
                      textColor,

                    precision:
                      0
                  },

                  grid: {

                    color:
                      isDark
                        ? "#1e293b"
                        : "#f1f5f9"
                  }
                }
              }
            }
          }
        );
    }


  } catch (error) {

    console.error(
      "Dashboard error:",
      error
    );


    dashTotal.innerText =
      "Error";


    const highEl =
      document.getElementById(
        "dash-high"
      );


    if (highEl) {

      highEl.innerText =
        "—";
    }


    const negativeEl =
      document.getElementById(
        "dash-negative"
      );


    if (negativeEl) {

      negativeEl.innerText =
        "—";
    }


    const topCategoryEl =
      document.getElementById(
        "dash-top-cat"
      );


    if (topCategoryEl) {

      topCategoryEl.innerText =
        "—";
    }


    showToast(
      "Unable to load dashboard data."
    );
  }
}


/* =========================================================
   HOME STATISTICS
   ========================================================= */

async function updateHomeStats() {

  const totalEl =
    document.getElementById(
      "home-stat-total"
    );


  if (!totalEl) {
    return;
  }


  try {

    const complaints =
      await fetchBackendComplaints();


    /*
       TOTAL
    */

    totalEl.innerText =
      complaints.length;


    /*
       HIGH PRIORITY
    */

    const highEl =
      document.getElementById(
        "home-stat-high"
      );


    if (highEl) {

      highEl.innerText =
        complaints.filter(
          c =>
            c.priority === "High"
        ).length;
    }


  } catch (error) {

    console.error(
      "Home statistics error:",
      error
    );
  }
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(msg) {

  const toast =
    document.getElementById(
      "toast"
    );


  if (!toast) {
    return;
  }


  const message =
    document.getElementById(
      "toast-msg"
    );


  if (message) {

    message.innerText =
      msg;
  }


  toast.classList.remove(
    "translate-y-20",
    "opacity-0",
    "pointer-events-none"
  );


  setTimeout(
    () => {

      toast.classList.add(
        "translate-y-20",
        "opacity-0",
        "pointer-events-none"
      );

    },
    3000
  );
}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";
  }


  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );
}


/* =========================================================
   DOM READY
   ========================================================= */

window.addEventListener(
  "DOMContentLoaded",
  () => {

    /*
       FIRST:
       Initialize dark mode.
    */

    initTheme();


    /*
       Analyze page
    */

    const complaintForm =
      document.getElementById(
        "complaintForm"
      );


    if (complaintForm) {

      complaintForm.addEventListener(
        "submit",
        handleComplaintSubmit
      );
    }


    /*
       Alternative form ID
       if your HTML uses complaint-form.
    */

    const complaintForm2 =
      document.getElementById(
        "complaint-form"
      );


    if (
      complaintForm2 &&
      complaintForm2 !== complaintForm
    ) {

      complaintForm2.addEventListener(
        "submit",
        handleComplaintSubmit
      );
    }


    /*
       Character counter
    */

    const complaintInput =
      document.getElementById(
        "complaintInput"
      );


    if (complaintInput) {

      complaintInput.addEventListener(
        "input",
        updateCharCount
      );

      updateCharCount();
    }


    /*
       Customer Result / Confirmation page
    */

    if (
      document.getElementById(
        "view-customer-result"
      )
    ) {
      initResultPage();
    }


    /*
       History page
    */

    if (
      document.getElementById(
        "historyTableBody"
      )
    ) {

      renderHistoryTable();
    }


    /*
       History search
    */

    const historySearch =
      document.getElementById(
        "historySearch"
      );


    if (historySearch) {

      historySearch.addEventListener(
        "input",
        filterHistoryTable
      );
    }


    /*
       History category filter
    */

    const filterCategory =
      document.getElementById(
        "filterCategory"
      );


    if (filterCategory) {

      filterCategory.addEventListener(
        "change",
        filterHistoryTable
      );
    }


    /*
       History priority filter
    */

    const filterPriority =
      document.getElementById(
        "filterPriority"
      );


    if (filterPriority) {

      filterPriority.addEventListener(
        "change",
        filterHistoryTable
      );
    }


    /*
       Dashboard
    */

    if (
      document.getElementById(
        "categoryChart"
      )
    ) {

      renderDashboardData();
    }


    /*
       Home
    */

    if (
      document.getElementById(
        "home-stat-total"
      )
    ) {

      updateHomeStats();
    }

  }
);


/* =========================================================
   GLOBAL FUNCTIONS
   ---------------------------------------------------------
   Required because your HTML uses onclick=""
   ========================================================= */

window.initTheme =
  initTheme;

window.toggleDarkMode =
  toggleDarkMode;

window.fillSample =
  fillSample;

window.updateCharCount =
  updateCharCount;

window.handleComplaintSubmit =
  handleComplaintSubmit;

window.initResultPage =
  initResultPage;

window.trackComplaintById =
  trackComplaintById;

window.copyReferenceId =
  copyReferenceId;

window.fetchCustomerComplaint =
  fetchCustomerComplaint;

window.copyDraftReply =
  copyReferenceId;

window.renderHistoryTable =
  renderHistoryTable;

window.filterHistoryTable =
  filterHistoryTable;

window.viewHistoryDetail =
  viewHistoryDetail;

window.clearHistory =
  clearHistory;

window.renderDashboardData =
  renderDashboardData;

window.updateHomeStats =
  updateHomeStats;

window.showToast =
  showToast;