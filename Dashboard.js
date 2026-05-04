function updateDashboard() {
    const issues = getAllIssues();
    const total = issues.length;
    document.getElementById('totalIssues').innerText = total;

    const open = issues.filter(issue => issue.status === 'Open').length;
    document.getElementById('openCount').innerText = open;

    const resolved = issues.filter(issue => issue.status === 'Resolved').length;
    document.getElementById('resolvedCount').innerText = resolved;

    const today = new Date().toISOString().split('T')[0];
    const overdue = issues.filter(issue => {
        return issue.status !== 'Resolved' && issue.targetDate < today && issue.targetDate !== "";
    }).length;
    
    document.getElementById('overdueCount').innerText = overdue;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
    showPage('dashboardPage');
});

// Navigation function
function showPage(pageId) {
    // 1. Find all elements with the class 'page' and hide them
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });

    // 2. Show the specific page the user clicked on
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
    } else {
        console.error("Page ID not found: " + pageId);
    }
}



