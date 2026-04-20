// ============================================================
// Person A - Issue (Ticket) Management
// Responsibilities: Create, Edit, View, Delete issues
// Data is saved in localStorage under the key "bugTrackerIssues"
// ============================================================


// The key used to save and load issues from localStorage (Linked to person4.js)
var STORAGE_KEY = Issue_Storage_Key;

// Keeps track of which issue we are currently viewing
var currentlyViewingId = null;


// ── Get all issues from localStorage ────────────────────────

getAllIssues();


// ── Save all issues back into localStorage ───────────────────
function saveAllIssues(issuesArray) {

    localStorage.setItem(STORAGE_KEY, JSON.stringify(issuesArray));  // convert array to string and save
}


// ── Show the form page and hide the view page ────────────────
function goToFormPage() {
    document.getElementById("formPage").style.display = "";
    document.getElementById("viewPage").style.display = "none";
    document.getElementById("dashboardPage").style.display = "none";
}


// ── Show the view page and hide the form page ────────────────
function goToViewPage() {
    document.getElementById("formPage").style.display = "none";
    document.getElementById("viewPage").style.display = "";
    document.getElementById("dashboardPage").style.display = "none";
}


function goToDashboardPage() {
    document.getElementById("formPage").style.display = "none";
    document.getElementById("viewPage").style.display = "none";
    document.getElementById("dashboardPage").style.display = "";
    // Refresh the table whenever we go to the dashboard
    if (typeof displayIssues === "function") {
        displayIssues();
    }
}


// ── Clear the form and reset it to "Create New Issue" mode ───
function clearForm() {
    // Clear all text inputs and textareas
    document.getElementById("hiddenTicketId").value = "";
    document.getElementById("inputSummary").value = "";
    document.getElementById("inputDescription").value = "";
    document.getElementById("inputReportedBy").value = "";
    document.getElementById("inputDateIdentified").value = "";
    document.getElementById("inputTargetDate").value = "";
    document.getElementById("inputActualResolutionDate").value = "";
    document.getElementById("inputResolutionSummary").value = "";

    // Reset the dropdowns back to the first option
    document.getElementById("selectAssignedTo").value = "";
    document.getElementById("selectProject").value = "";
    document.getElementById("selectPriority").value = "";
    document.getElementById("selectStatus").value = "";

    // Reset the heading back to "Create"
    document.getElementById("formTitle").textContent = "Create New Issue";
    document.getElementById("formSubtitle").textContent = "Fill in the details below to log a bug.";
}


// ── Go to a blank new issue form ─────────────────────────────
// This is called by the "New Issue" button in the navbar
function goToNewIssueForm() {
    clearForm();       // wipe the form clean first
    goToFormPage();    // then show the form page
}


// ── Read the form, validate, and save the issue ───────────────
function saveIssue() {

    // Read all values from the form
    var ticketId = document.getElementById("hiddenTicketId").value;
    var summary = document.getElementById("inputSummary").value.trim();
    var description = document.getElementById("inputDescription").value.trim();
    var reportedBy = document.getElementById("inputReportedBy").value.trim();
    var dateIdentified = document.getElementById("inputDateIdentified").value;
    var assignedTo = document.getElementById("selectAssignedTo").value;
    var project = document.getElementById("selectProject").value;
    var priority = document.getElementById("selectPriority").value;
    var status = document.getElementById("selectStatus").value;
    var targetDate = document.getElementById("inputTargetDate").value;
    var actualResolutionDate = document.getElementById("inputActualResolutionDate").value;
    var resolutionSummary = document.getElementById("inputResolutionSummary").value.trim();

    // Check that all required fields are filled in
    if (!validateIssue(summary, description, reportedBy, dateIdentified, priority, status)) {
        alert("Please fill in all required fields marked with *");
        //logging to see what function returns
        console.log("validate issue returned:" + validateIssue(summary, description, reportedBy, dateIdentified, priority, status))

        return;  // stop here, do not save
    }

    // Build the issue object with all the data
    var issue = {
        id: ticketId ? ticketId : Date.now().toString(),
        summary: summary,
        description: description,
        reportedBy: reportedBy,
        dateIdentified: dateIdentified,
        assignedTo: assignedTo || "Unassigned",
        project: project || "No Project",
        priority: priority,
        status: status,
        targetDate: targetDate,
        actualResolutionDate: actualResolutionDate,
        resolutionSummary: resolutionSummary
    };

    // Load the current list of issues from localStorage
    var allIssues = getAllIssues();
    console.log(allIssues)
    //function to compute the status of a issue to prevent inaccurate data
    issue.status = computeStatus(issue);
    if (ticketId) {
        // We are EDITING - find the old issue and replace it
        for (var i = 0; i < allIssues.length; i++) {
            if (allIssues[i].id === ticketId) {
                allIssues[i] = issue;
                break;
            }
        }
        alert("Issue updated successfully!");
    } else {
        // We are CREATING - add the new issue to the list
        //function to compute the status of a issue to prevent inaccurate data
        allIssues.push(issue);
        alert("Issue saved successfully!");
    }

    // Save the updated list back to localStorage
    saveAllIssues(allIssues);
    console.log(allIssues)

    // Force refresh dashboard if we ever go back to it
    if (typeof displayIssues === "function") {
        displayIssues();
    }

    // Show the issue we just saved on the view page
    showIssueOnViewPage(issue.id);
}


// ── Find an issue by ID and display it on the view page ──────
function showIssueOnViewPage(issueId) {
    var allIssues = getAllIssues();
    var foundIssue = null;

    // Loop through all issues to find the one with the matching ID
    for (var i = 0; i < allIssues.length; i++) {
        if (allIssues[i].id === issueId) {
            foundIssue = allIssues[i];
            break;
        }
    }

    if (!foundIssue) {
        alert("Issue not found.");
        return;
    }

    // Remember which issue we are viewing (needed for edit and delete)
    currentlyViewingId = foundIssue.id;

    UpdateViewPage(foundIssue);


    // Show coloured badges for priority and status
    var priorityColours = { Low: "success", Medium: "warning", High: "danger" };
    var statusColours = { Open: "primary", Resolved: "success", Overdue: "danger" };

    document.getElementById("viewStatusAndPriorityBadges").innerHTML =
        '<span class="badge bg-' + (priorityColours[foundIssue.priority] || "secondary") + ' me-1">' + foundIssue.priority + '</span>' +
        '<span class="badge bg-' + (statusColours[foundIssue.status] || "secondary") + '">' + foundIssue.status + '</span>';

    // Show the "View Issue" button in the navbar and go to the view page
    document.getElementById("btnViewIssue").style.display = "";
    goToViewPage();
}

// Make this function available to Person B's dashboard
// so they can call showIssueOnViewPage(id) when a ticket is clicked
window.BT_showIssue = showIssueOnViewPage;


// ── Load an issue back into the form for editing ─────────────
function loadIssueIntoForm() {
    var allIssues = getAllIssues();
    var foundIssue = null;

    for (var i = 0; i < allIssues.length; i++) {
        if (allIssues[i].id === currentlyViewingId) {
            foundIssue = allIssues[i];
            break;
        }
    }

    if (!foundIssue) return;

    // Use the helper function from person4.js
    loadEditForm(foundIssue);
}


// ── Delete the issue we are currently viewing ────────────────
function deleteIssue() {
    var confirmed = confirm("Are you sure you want to delete this issue?");
    if (!confirmed) return;

    var allIssues = getAllIssues();
    var updatedIssues = [];

    // Keep every issue EXCEPT the one we want to delete
    for (var i = 0; i < allIssues.length; i++) {
        if (allIssues[i].id !== currentlyViewingId) {
            updatedIssues.push(allIssues[i]);
        }
    }

    saveAllIssues(updatedIssues);
    alert("Issue deleted.");

    // Go back to a blank new issue form
    goToNewIssueForm();
}
