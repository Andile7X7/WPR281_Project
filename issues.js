function displayIssues() {
    const container = document.getElementById('issueCardsContainer');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    container.innerHTML = ""; // Clear current cards

    // Assuming 'issues' is your array from storage.js
    issues.forEach((issue) => {
        if (issue.summary.toLowerCase().includes(searchTerm)) {
            
            // Construct the card HTML
            const cardHtml = `
                <div class="col-md-4">
                    <div class="issue-card shadow-sm">
                        <div class="d-flex justify-content-between">
                            <div>
                                <!-- Profile Picture -->
                                <img src="${issue.profilePic || 'images/default.jpg'}" class="profile-img">
                                <h5>${issue.assignedTo || 'Unassigned'}</h5>
                                <p class="role-text">${issue.project}</p>
                            </div>
                        </div>

                        <div class="counter-box mt-2">
                            <h6>Priority Score</h6>
                            <div class="h4 mb-2">${issue.priority === 'High' ? '3' : '1'}</div>
                            <div class="d-flex justify-content-center gap-2">
                                <button class="btn-counter">-</button>
                                <button class="btn-counter">+</button>
                            </div>
                        </div>
                        
                        <div class="mt-3 small">
                            <strong>Issue:</strong> ${issue.summary} <br>
                            <span class="badge bg-dark mt-2">${issue.status}</span>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardHtml;
        }
    });
}