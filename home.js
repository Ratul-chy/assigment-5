// State
let activeTab = "all";
let issuesData = [];

// ─── Spinner ────────────────────────────────────────────────────────────────
const manageSpinner = (status) => {
    if (status) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("issuesContainer").classList.add("hidden");
    } else {
        document.getElementById("issuesContainer").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
};

// ─── Load all issues on page load ───────────────────────────────────────────
const loadIssues = () => {
    manageSpinner(true);
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(json => {
            issuesData = json.data;       // ✅ save for tab filtering
            displayIssues(issuesData);
            manageSpinner(false);
        });
};

// ─── Display issues ─────────────────────────────────────────────────────────
const displayIssues = (issues) => {
    const container = document.getElementById("issuesContainer");
    container.innerHTML = "";

    // ✅ Update issue count
    document.getElementById("issue-count").innerText = `${issues.length} Issues`;

    for (let issue of issues) {
        const statusImg = issue.status === "open"
            ? "./assets/Open-Status.png"
            : "./assets/Closed-Status.png";   // ✅ fixed filename (no space)

        // ✅ issue.labels is an array — map over it
        const labelAdd = issue.labels
            .map(label => `<button class="btn btn-soft btn-secondary rounded-full border">${label.toUpperCase()}</button>`)
            .join(" ");

        const card = document.createElement("div");

        card.style.borderTop = issue.status === "open"
            ? "5px solid #00A96E"
            : "5px solid #A855F7";
        card.style.borderRadius = "0.5rem";

        card.innerHTML = `
            <div class="issue-card space-y-4 shadow-sm p-4 rounded-lg">

                <div class="card-img-priority flex justify-between items-center">
                    <img width="30px" src="${statusImg}" alt="">
                    <button class="btn btn-soft btn-secondary rounded-full">${issue.priority}</button>
                </div>

                <div class="card-header space-y-2">
                    <h2 class="font-semibold">${issue.title}</h2>
                    <p class="text-[#64748B] text-[14px]">${issue.description}</p>
                </div>

                ${labelAdd}

                <div class="date py-4 border-t border-[#64748B]">
                    <p class="text-[#64748B]">#${issue.id} by ${issue.author}</p>
                    <p class="text-[#64748B]">${new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>

            </div>
        `;

        // ✅ click card to open modal
        card.addEventListener("click", () => loadIssueDetail(issue.id));
        container.appendChild(card);
    }
};

// alias so tab logic works with either name
const showIssues = displayIssues;

// ─── Modal: load single issue detail ────────────────────────────────────────
const loadIssueDetail = async (id) => {
    manageSpinner(true);
    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const json = await res.json();
    displayIssueDetails(json.data);
    manageSpinner(false);
};

const displayIssueDetails = (issue) => {
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
        <div>
            <h1 class="font-bold text-lg">${issue.title}</h1>
        </div>
        <div class="flex gap-4 items-center">
            <button class="btn btn-soft rounded-full">${issue.status === "open" ? "Opened" : "Closed"}</button>
            <p>Opened by ${issue.author}</p>
            <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
            ${issue.labels.map(label => `<button class="btn btn-soft btn-secondary rounded-full border">${label.toUpperCase()}</button>`).join(" ")}
        </div>
        <div>
            <p>${issue.description}</p>
        </div>
        <div class="flex p-4 bg-[#F8FAFC] items-center gap-5 rounded-md">
            <p>Assignee: <span class="font-bold">${issue.assignee}</span></p>
            <p>Priority:
                <button class="btn btn-soft rounded-full">
                    ${issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                </button>
            </p>
        </div>
    `;
    document.getElementById("issue_modal").showModal();
};

// ─── Tab buttons ─────────────────────────────────────────────────────────────
const tabButtons = document.querySelectorAll(".issue-tab-btn");
tabButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
        activeTab = btn.dataset.tab;    // ✅ needs data-tab in HTML

        // update active styles
        tabButtons.forEach(b => {
            b.classList.remove("btn-primary");
            b.classList.add("btn-outline");
        });
        btn.classList.remove("btn-outline");
        btn.classList.add("btn-primary");

        manageSpinner(true);
        await new Promise(resolve => setTimeout(resolve, 0));

        if (activeTab === "all") {
            showIssues(issuesData);
        } else {
            const filtered = issuesData.filter(issue => issue.status === activeTab);
            showIssues(filtered);
        }
        manageSpinner(false);
    });
});

// ─── Search ──────────────────────────────────────────────────────────────────
document.getElementById("btn-search").addEventListener("click", () => {
    const searchValue = document.getElementById("searchInput").value.trim().toLowerCase();
    const filtered = issuesData.filter(issue =>
        issue.title.toLowerCase().includes(searchValue) ||
        issue.description.toLowerCase().includes(searchValue)
    );
    showIssues(filtered);
});

// ─── Init ────────────────────────────────────────────────────────────────────
loadIssues();