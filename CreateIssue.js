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

    // Show the selected page
    let targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = "block";
    }


    if (pageId === "dashboardPage") loadDashboard();
    if (pageId === "issuesPage") displayIssues();

    // Refresh dropdowns whenever the form is opened
    if (pageId === 'formPage') {
        populateAssigneeDropdown();
        populateProjectDropdown();
        // Clear form if no ticket ID is set (creating new issue)
        if (!document.getElementById("hiddenTicketId").value) {
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
    document.getElementById("viewProject").innerText = getProjectNameById(issue.project);
    document.getElementById("viewAssignedTo").innerText = getPersonNameById(issue.assignedTo);
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
    document.getElementById("selectProject").readonly = true;
    document.getElementById("selectStatus").readOnly = true;
}

function loadIssueIntoForm() {
    const issue = getAllIssues().find(i => i.id == currentlyViewingId);
    if (!issue) return;

    document.getElementById("hiddenTicketId").value = issue.id;
    document.getElementById("inputSummary").value = issue.summary;
    document.getElementById("inputDescription").value = issue.description;
    document.getElementById("selectProject").value = issue.project;
    document.getElementById("selectAssignedTo").value = issue.assignedTo;
    document.getElementById("selectPriority").value = issue.priority;
    document.getElementById("selectStatus").value = issue.status;
    document.getElementById("inputTargetDate").value = issue.targetDate;
    document.getElementById("inputReportedBy").value = issue.reportedBy;
    document.getElementById("inputResolutionSummary").value = issue.resolutionSummary;

    document.getElementById("formTitle").innerText = "Edit Issue";
    RestrictEditing();
    showPage('formPage');
}

function deleteIssue() {
    if (!confirm("Permanently delete this ticket?")) return;
    const filtered = getAllIssues().filter(i => i.id != currentlyViewingId);
    saveAllIssues(filtered);
    showPage('issuesPage');
}

// ==========================================
// LIST VIEW (Fixes Rubric #7)
// ==========================================
function displayIssues() {
    const issues = getAllIssues();
    const tbody = document.getElementById("issueTable");
    tbody.innerHTML = "";

    issues.forEach(i => {
        tbody.innerHTML += `
            <tr onclick="showIssueOnViewPage('${i.id}')" style="cursor:pointer">
                <td><strong>${i.summary}</strong></td>
                <td>${getProjectNameById(i.project)}</td>
                <td><span class="badge bg-light text-dark">${i.priority}</span></td>
                <td><span class="badge bg-secondary">${i.status}</span></td>
                <td>${getPersonNameById(i.assignedTo)}</td>
                <td class="text-end"><button class="btn btn-sm btn-link">View</button></td>
            </tr>
        `;
    });
}