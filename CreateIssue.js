// ==========================================
// CORE DATA HELPERS
// ==========================================
let currentlyViewingId = null;

// ==========================================
// INITIALIZATION & SPA NAVIGATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Static Data (Person C)
    initPeople();
    initProjects();

    // 2. Populate Form Dropdowns (Person C)
    populateAssigneeDropdown();
    populateProjectDropdown();

    // 3. Set Date Identified to Today by default
    document.getElementById("inputDateIdentified").value = new Date().toISOString().split('T')[0];

    // 4. Start on Dashboard
    showPage('dashboardPage');
});

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    document.getElementById(pageId).style.display = "block";

    let targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = "block";
    }

    if (pageId === "dashboardPage") loadDashboard();
    if (pageId === "issuesPage") displayIssues();

    if (pageId === 'formPage') {
        const isEditing = document.getElementById("hiddenTicketId")?.value;
        if (!isEditing) {
            populateAssigneeDropdown();
            populateProjectDropdown();
            clearForm();
        }
    }
}

// ==========================================
// FORM UTILITIES
// ==========================================
function clearForm() {
    document.getElementById("hiddenTicketId").value = "";
    document.getElementById("inputSummary").value = "";
    document.getElementById("inputDescription").value = "";
    document.getElementById("inputReportedBy").value = "";
    document.getElementById("inputDateIdentified").value = new Date().toISOString().split('T')[0];
    document.getElementById("inputTargetDate").value = "";
    document.getElementById("inputActualResolutionDate").value = "";
    document.getElementById("inputResolutionSummary").value = "";
    document.getElementById("selectAssignedTo").value = "";
    document.getElementById("selectProject").value = "";
    document.getElementById("selectPriority").value = "";
    document.getElementById("selectStatus").value = "";
    document.getElementById("formTitle").innerText = "Log New Issue";
}

function goToNewIssueForm() {
    clearForm();
    showPage('formPage');
}


// ==========================================
function loadDashboard() {
    let issues = getAllIssues();
    let today = new Date().toISOString().split('T')[0];

    let stats = { total: issues.length, open: 0, resolved: 0, overdue: 0 };

    issues.forEach(issue => {
        if (issue.status === "Resolved") stats.resolved++;
        else if (issue.targetDate && issue.targetDate < today) stats.overdue++;
        else stats.open++;
    });

    document.getElementById("totalIssues").innerText = stats.total;
    document.getElementById("openCount").innerText = stats.open;
    document.getElementById("resolvedCount").innerText = stats.resolved;
    document.getElementById("overdueCount").innerText = stats.overdue;
}

// ==========================================
// ISSUE MANAGEMENT (Person A Logic)
// ==========================================
function saveIssue() {
    let ticketId = document.getElementById("hiddenTicketId").value;
    
    let issue = {
        id: ticketId || Date.now().toString(),
        summary: document.getElementById("inputSummary").value.trim(),
        description: document.getElementById("inputDescription").value.trim(),
        reportedBy: document.getElementById("inputReportedBy").value.trim(),
        dateIdentified: document.getElementById("inputDateIdentified").value,
        assignedTo: document.getElementById("selectAssignedTo").value, // Person ID
        project: document.getElementById("selectProject").value,       // Project ID
        priority: document.getElementById("selectPriority").value,
        status: document.getElementById("selectStatus").value,
        targetDate: document.getElementById("inputTargetDate").value,
        actualResolutionDate: document.getElementById("inputActualResolutionDate").value,
        resolutionSummary: document.getElementById("inputResolutionSummary").value.trim()
    };

    let allIssues = getAllIssues();

    if (ticketId) {
        const index = allIssues.findIndex(i => i.id === ticketId);
        allIssues[index] = issue;
    } else {
        allIssues.push(issue);
    }

    saveAllIssues(allIssues);
    alert("Issue Processed Successfully!");
    showIssueOnViewPage(issue.id);
}

// ==========================================
// VIEW & EDIT LOGIC (Fixes Rubric #1, #6)
// ==========================================
function showIssueOnViewPage(id) {
    const issue = getAllIssues().find(i => i.id == id);
    if (!issue) return;

    currentlyViewingId = id;

    // Map UI text
    document.getElementById("viewSummary").innerText = issue.summary;
    document.getElementById("viewDescription").innerText = issue.description;
    document.getElementById("viewProject").innerText = issue.project || "No Project";
    document.getElementById("viewAssignedTo").innerText = issue.assignedTo || "Unassigned";
    document.getElementById("viewReportedBy").innerText = issue.reportedBy;
    document.getElementById("viewDateIdentified").innerText = issue.dateIdentified;
    document.getElementById("viewTargetDate").innerText = issue.targetDate || "Not Set";
    document.getElementById("viewResolutionSummary").innerText = issue.resolutionSummary || "Pending...";

    // Badges
    const pColor = { High: "danger", Medium: "warning", Low: "info" }[issue.priority];
    const sColor = { Open: "primary", Resolved: "success", Overdue: "danger" }[issue.status];
    
    document.getElementById("viewStatusAndPriorityBadges").innerHTML = `
        <span class="badge bg-${pColor}">${issue.priority}</span>
        <span class="badge bg-${sColor}">${issue.status}</span>
    `;

    document.getElementById("btnViewIssue").style.display = "block";
    showPage('viewPage');
}

function RestrictEditing(){
    document.getElementById("inputSummary").readOnly = true;
    document.getElementById("inputDescription").readOnly = true;
    document.getElementById("selectProject").disabled = true;
    document.getElementById("selectStatus").readOnly = true;
    document.getElementById('inputReportedBy').readOnly = true;
}

function loadIssueIntoForm() {
    const issue = getAllIssues().find(i => i.id == currentlyViewingId);
    if (!issue) return;

    populateProjectDropdown();
    populateAssigneeDropdown();

    setTimeout(() => {
        const projectSelect = document.getElementById('selectProject');
        const assigneeSelect = document.getElementById('selectAssignedTo');
        
        // Case-insensitive match
        if (issue.project) {
            for (let opt of projectSelect.options) {
                if (opt.value.toLowerCase() === issue.project.toLowerCase()) {
                    projectSelect.value = opt.value;
                    break;
                }
            }
        }
        
        if (issue.assignedTo) {
            for (let opt of assigneeSelect.options) {
                if (opt.value.toLowerCase() === issue.assignedTo.toLowerCase()) {
                    assigneeSelect.value = opt.value;
                    break;
                }
            }
        }

        document.getElementById("hiddenTicketId").value = issue.id;
        document.getElementById("inputSummary").value = issue.summary;
        document.getElementById("inputDescription").value = issue.description;
        document.getElementById("selectPriority").value = issue.priority;
        document.getElementById("selectStatus").value = issue.status;
        document.getElementById("inputTargetDate").value = issue.targetDate;
        document.getElementById("inputReportedBy").value = issue.reportedBy;
        document.getElementById("inputResolutionSummary").value = issue.resolutionSummary;

        document.getElementById("formTitle").innerText = "Edit Issue";
        RestrictEditing();
        
        document.querySelectorAll(".page").forEach(p => p.style.display = "none");
        document.getElementById("formPage").style.display = "block";
    }, 10);
}

function deleteIssue() {
    if (!confirm("Permanently delete this ticket?")) return;
    const filtered = getAllIssues().filter(i => i.id != currentlyViewingId);
    saveAllIssues(filtered);
    showPage('issuesPage');
}

// ==========================================
// LIST VIEW with Pagination
// ==========================================
const ITEMS_PER_PAGE = 5;
let currentPage = 1;

function displayIssues() {
    let issues = getAllIssues();
    const tbody = document.getElementById("issueTable");
    tbody.innerHTML = "";

    const searchTerm = document.getElementById("searchInput")?.value?.toLowerCase() || "";
    const statusFilter = document.getElementById("statusFilter")?.value || "";
    const priorityFilter = document.getElementById("priorityFilter")?.value || "";

    if (searchTerm || statusFilter || priorityFilter) {
        issues = issues.filter(issue => {
            const matchSearch = !searchTerm || 
                (issue.summary?.toLowerCase().includes(searchTerm)) ||
                (issue.description?.toLowerCase().includes(searchTerm)) ||
                (issue.project?.toLowerCase().includes(searchTerm)) ||
                (issue.assignedTo?.toLowerCase().includes(searchTerm));
            const matchStatus = !statusFilter || issue.status === statusFilter;
            const matchPriority = !priorityFilter || issue.priority === priorityFilter;
            return matchSearch && matchStatus && matchPriority;
        });
    }

    const totalPages = Math.ceil(issues.length / ITEMS_PER_PAGE);
    if (totalPages > 0 && currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedIssues = issues.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    paginatedIssues.forEach(i => {
        tbody.innerHTML += `
            <tr onclick="showIssueOnViewPage('${i.id}')" style="cursor:pointer">
                <td><strong>${i.summary}</strong></td>
                <td>${i.project || "No Project"}</td>
                <td><span class="badge bg-light text-dark">${i.priority}</span></td>
                <td><span class="badge bg-secondary">${i.status}</span></td>
                <td>${i.assignedTo || "Unassigned"}</td>
                <td class="text-end"><button class="btn btn-sm btn-link">View</button></td>
            </tr>
        `;
    });

    renderPagination(totalPages, currentPage);
}

function renderPagination(totalPages, page) {
    const pagination = document.getElementById("pagination");
    if (!pagination) return;
    
    pagination.innerHTML = "";
    if (totalPages <= 1) return;

    const prevDisabled = page === 1 ? "disabled" : "";
    const nextDisabled = page === totalPages ? "disabled" : "";
    
    pagination.innerHTML += `
        <li class="page-item ${prevDisabled}">
            <button class="page-link" onclick="goToPage(${page - 1})" ${prevDisabled}>Previous</button>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        const active = i === page ? "active" : "";
        pagination.innerHTML += `
            <li class="page-item ${active}">
                <button class="page-link" onclick="goToPage(${i})">${i}</button>
            </li>
        `;
    }

    pagination.innerHTML += `
        <li class="page-item ${nextDisabled}">
            <button class="page-link" onclick="goToPage(${page + 1})" ${nextDisabled}>Next</button>
        </li>
    `;
}

function goToPage(pageNum) {
    currentPage = pageNum;
    displayIssues();
}