function initProjects() {
    // Check if projects already exist to prevent overwriting during refresh
    if (!localStorage.getItem(Project_Storage_Key)) {
        let initialProjects = [
            {
                id: (Date.now() + 1).toString(),
                name: "FIFA 2026 World Cup"
            },
            {
                id: (Date.now() + 2).toString(),
                name: "Ubuntu Clinic System"
            },
            {
                id: (Date.now() + 3).toString(),
                name: "Bunkhouse Rental Portal"
            },

            {
                id: (Date.now() + 4).toString(),
                name: "Student Lab Network"
            }
        ];
        localStorage.setItem(Project_Storage_Key, JSON.stringify(initialProjects)); // [cite: 14, 190]
    }
}




function populateProjectDropdown() {
    let dropdown = document.getElementById('selectProject');
    let projects = getAllProjects();

    if (!dropdown || !projects) return;

    dropdown.innerHTML = '<option value="">-- Select Option --</option>';

    projects.forEach(project => {
        let option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        dropdown.appendChild(option);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    initProjects();
    populateProjectDropdown();
});
