let issues = getAllIssues();

let currentPage = 1;
const rowsPerPage = 5;

function displayIssues() {
  const table = document.getElementById("issueTable");
  if (!table) return;
  table.innerHTML = "";

  // Always get fresh data from storage
  let issues = getAllIssues();

  let filtered = issues.filter(issue => {
    const status = document.getElementById("statusFilter").value;
    const priority = document.getElementById("priorityFilter").value;
    const search = document.getElementById("searchInput").value.toLowerCase();

    return (
      (status === "" || issue.status === status) &&
      (priority === "" || issue.priority === priority) &&
      (issue.summary.toLowerCase().includes(search))
    );
  });

  // Pagination logic
  const start = (currentPage - 1) * rowsPerPage;
  const paginatedItems = filtered.slice(start, start + rowsPerPage);

  paginatedItems.forEach(issue => {
    const row = `
        <tr style="cursor: pointer;" onclick="showIssueOnViewPage('${issue.id}')">
          <td>${issue.summary}</td>
          <td><span class="badge bg-${getStatusColor(issue.status)}">${issue.status}</span></td>
          <td><span class="badge bg-${getPriorityColor(issue.priority)} text-dark">${issue.priority}</span></td>
          <td>${getPersonNameById(issue.assignedTo)}</td>
          <td>${getProjectNameById(issue.project)}</td>
          <td>${issue.targetDate}</td>
          <td onclick="event.stopPropagation()">
            <div class="dropdown">
              <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                Actions
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><button class="dropdown-item" onclick="showIssueOnViewPage('${issue.id}')">👁️ View</button></li>
                <li><button class="dropdown-item" onclick="editIssueById('${issue.id}')">✏️ Edit</button></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item text-danger" onclick="DeleteById('${issue.id}')">🗑️ Delete</button></li>
              </ul>
            </div>
          </td>
        </tr>
      `;
    table.innerHTML += row;
  });

  setupPagination(filtered.length);
}

function editIssueById(id) {
  let issues = getAllIssues();
  let issue = issues.find(i => i.id === id);
  if (!issue) return;

  // Use shared function from person4.js
  loadEditForm(issue);

  // Remember ID for person1.js tracking
  currentlyViewingId = id;

  // Switch view
  goToFormPage();
}

function getStatusColor(status) {
  if (status === "Open") return "primary";
  if (status === "Resolved") return "success";
  if (status === "Overdue") return "danger";
  return "secondary";
}

function getPriorityColor(priority) {
  if (priority === "Low") return "success";
  if (priority === "Medium") return "warning";
  if (priority === "High") return "danger";
  return "secondary";
}

function setupPagination(totalItems) {
  const pageCount = Math.ceil(totalItems / rowsPerPage);
  const pagination = document.getElementById("pagination");
  if (!pagination) return;
  pagination.innerHTML = "";

  for (let i = 1; i <= pageCount; i++) {
    pagination.innerHTML += `
        <li class="page-item ${i === currentPage ? "active" : ""}">
          <button class="page-link" onclick="changePage(${i})">${i}</button>
        </li>
      `;
  }
}

function changePage(page) {
  currentPage = page;
  displayIssues();
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  const statusFilter = document.getElementById("statusFilter");
  const priorityFilter = document.getElementById("priorityFilter");
  const searchInput = document.getElementById("searchInput");

  if (statusFilter) statusFilter.addEventListener("change", displayIssues);
  if (priorityFilter) priorityFilter.addEventListener("change", displayIssues);
  if (searchInput) searchInput.addEventListener("keyup", displayIssues);

  displayIssues();
});

// Make globally accessible
window.displayIssues = displayIssues;
window.editIssueById = editIssueById;
