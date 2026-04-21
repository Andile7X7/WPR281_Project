const People_Storage_Key = "peoplestoragekey"
const Project_Storage_Key = "projectstoragekey"
const Issue_Storage_Key = "bugTrackerIssues"

const seedIssues = [
    {
        id: "1",
        summary: "Login error",
        description: "User cannot log in",
        reportedBy: "Alice",
        dateIdentified: "2026-04-01",
        assignedTo: "Unassigned",
        project: "No Project",
        priority: "High",
        status: "Overdue",
        targetDate: "2026-04-10",
        actualResolutionDate: null,
        resolutionSummary: ""
    },
    {
        id: "2",
        summary: "Button not working",
        description: "Submit button does nothing",
        reportedBy: "Brian",
        dateIdentified: "2026-04-15",
        assignedTo: "Unassigned",
        project: "No Project",
        priority: "Medium",
        status: "Open",
        targetDate: "2026-05-05",
        actualResolutionDate: null,
        resolutionSummary: ""
    },
    {
        id: "3",
        summary: "Page crash",
        description: "Profile page crashes on load",
        reportedBy: "Cynthia",
        dateIdentified: "2026-03-20",
        assignedTo: "Unassigned",
        project: "No Project",
        priority: "Low",
        status: "Resolved",
        targetDate: "2026-03-25",
        actualResolutionDate: "2026-03-24",
        resolutionSummary: "Fixed null pointer exception"
    },
    {
        id: "4",
        summary: "Slow performance",
        description: "Dashboard loads very slowly",
        reportedBy: "David",
        dateIdentified: "2026-04-18",
        assignedTo: "Unassigned",
        project: "No Project",
        priority: "High",
        status: "Open",
        targetDate: "2026-05-01",
        actualResolutionDate: null,
        resolutionSummary: ""
    },
    {
        id: "5",
        summary: "Broken link",
        description: "Help page link is broken",
        reportedBy: "Ella",
        dateIdentified: "2026-02-10",
        assignedTo: "Unassigned",
        project: "No Project",
        priority: "Medium",
        status: "Overdue",
        targetDate: "2026-03-01",
        actualResolutionDate: null,
        resolutionSummary: ""
    },
    {
        id: "6",
        summary: "Form validation issue",
        description: "Email field accepts invalid input",
        reportedBy: "Frank",
        dateIdentified: "2026-04-05",
        assignedTo: "Unassigned",
        project: "No Project",
        priority: "Low",
        status: "Resolved",
        targetDate: "2026-04-07",
        actualResolutionDate: "2026-04-06",
        resolutionSummary: "Added regex validation"
    },
    {
        id: "7",
        summary: "Search not working",
        description: "Search returns no results",
        reportedBy: "Grace",
        dateIdentified: "2026-04-12",
        assignedTo: "Unassigned",
        project: "No Project",
        priority: "High",
        status: "Open",
        targetDate: "2026-05-10",
        actualResolutionDate: null,
        resolutionSummary: ""
    },
    {
        id: "8",
        summary: "Image upload fails",
        description: "Upload button throws error",
        reportedBy: "Henry",
        dateIdentified: "2026-01-15",
        assignedTo: "Unassigned",
        project: "No Project",
        priority: "Medium",
        status: "Overdue",
        targetDate: "2026-02-01",
        actualResolutionDate: null,
        resolutionSummary: ""
    },
    {
        id: "9",
        summary: "UI misalignment",
        description: "Buttons overlap on mobile view",
        reportedBy: "Isabel",
        dateIdentified: "2026-04-02",
        assignedTo: "Unassigned",
        project: "No Project",
        priority: "Low",
        status: "Resolved",
        targetDate: "2026-04-05",
        actualResolutionDate: "2026-04-04",
        resolutionSummary: "Adjusted CSS flex layout"
    },
    {
        id: "10",
        summary: "Notification bug",
        description: "Users don’t receive alerts",
        reportedBy: "Jack",
        dateIdentified: "2026-04-19",
        assignedTo: "Unassigned",
        project: "No Project",
        priority: "Medium",
        status: "Open",
        targetDate: "2026-05-15",
        actualResolutionDate: null,
        resolutionSummary: ""
    }
];

if (!localStorage.getItem(Issue_Storage_Key)) {
    localStorage.setItem(Issue_Storage_Key, JSON.stringify(seedIssues));
}


//function to validate the input from the issue form
function validateIssue(summary, description, reportedBy, dateIdentified, priority, status, project) {
    if (!summary || !description || !reportedBy || !dateIdentified || !project) return false;
    if (priority !== "Low" && priority !== "Medium" && priority !== "High") return false;
    if (status !== "Open" && status !== "Resolved" && status !== "Overdue") return false;
    return true;
}

function DeleteById(issueId) {
    var confirmed = confirm("Are you sure you want to delete this issue?");
    if (!confirmed) return;

    var allIssues = getAllIssues();
    var updatedIssues = allIssues.filter(issue => issue.id !== issueId);

    localStorage.setItem(Issue_Storage_Key, JSON.stringify(updatedIssues));

    // Refresh the dashboard if it's currently on screen
    if (typeof displayIssues === "function") {
        displayIssues();
    }

    // If we're on the view page for this bug, go back to the dashboard
    if (typeof currentlyViewingId !== "undefined" && currentlyViewingId === issueId) {
        goToDashboardPage();
    }
}

function getAllIssues() {
    let allIssues = localStorage.getItem(Issue_Storage_Key);
    if (allIssues) {
        return JSON.parse(allIssues)
    }
    else {
        return [];
    }
}

function getAllProjects() {
    let allProjects = localStorage.getItem(Project_Storage_Key);
    if (allProjects) {
        return JSON.parse(allProjects)
    }
    else {
        return [];
    }
}

function getAllPeople() {
    let allPeople = localStorage.getItem(People_Storage_Key);
    if (allPeople) {
        return JSON.parse(allPeople)
    }
    else {
        return [];
    }
}
// compute the status so that manual entry does not result in inaccurate data
function computeStatus(issue) {
    if (issue.actualResolutionDate) {
        return "Resolved";
    }
    if (issue.targetDate) {
        if (new Date(issue.targetDate) < new Date()) {
            return 'Overdue';
        }
    }
    return "Open"
}
// function that maps element ids and their values
function setTextField(elementID, Text) {
    document.getElementById(elementID).textContent = Text;
}
// cleaner way to display the issue view page
function UpdateViewPage(issue) {
    setTextField("viewSummary", issue.summary);
    setTextField("viewTicketId", "#" + issue.id);
    setTextField("viewProject", issue.project);
    setTextField("viewReportedBy", issue.reportedBy);
    setTextField("viewAssignedTo", issue.assignedTo);
    setTextField("viewDateIdentified", issue.dateIdentified);
    setTextField("viewTargetDate", issue.targetDate);
    setTextField("viewActualResolutionDate", issue.actualResolutionDate);
    setTextField("viewDescription", issue.description);
    if (issue.resolutionSummary) {
        setTextField("viewResolutionSummary", issue.resolutionSummary);
        document.getElementById("resolutionCard").style.display = "";
    }
    else {
        document.getElementById("resolutionCard").style.display = "none";
    }

}

function setFormField(elementID, value) {
    document.getElementById(elementID).value = value;
}
function loadEditForm(foundIssue) {
    setFormField("hiddenTicketId", foundIssue.id);
    setFormField("inputSummary", foundIssue.summary);
    setFormField("inputDescription", foundIssue.description);
    setFormField("inputReportedBy", foundIssue.reportedBy);
    setFormField("inputDateIdentified", foundIssue.dateIdentified);
    setFormField("inputTargetDate", foundIssue.targetDate);
    setFormField("inputActualResolutionDate", foundIssue.actualResolutionDate);
    setFormField("inputResolutionSummary", foundIssue.resolutionSummary);
    setFormField("selectAssignedTo", foundIssue.assignedTo);
    setFormField("selectProject", foundIssue.project);
    setFormField("selectPriority", foundIssue.priority);
    setFormField("selectStatus", foundIssue.status);

    document.getElementById("formTitle").textContent = "Edit Issue #" + foundIssue.id;
    document.getElementById("formSubtitle").textContent = "Update the fields and click Save Issue.";
    goToFormPage();
}
function DeleteById(issueId) {
    var confirmed = confirm("Are you sure you want to delete this issue?");
    if (!confirmed) return;

    var allIssues = getAllIssues();
    var updatedIssues = allIssues.filter(issue => issue.id !== issueId);

    localStorage.setItem(Issue_Storage_Key, JSON.stringify(updatedIssues));

    // Refresh the dashboard instantly
    if (typeof displayIssues === "function") {
        displayIssues();
    }

    // If we were looking at this bug on the view page, go back to the list
    if (typeof currentlyViewingId !== "undefined" && currentlyViewingId === issueId) {
        goToDashboardPage();
    }
}
