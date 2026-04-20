// Data Structure people entity
function initPeople() {
  if (!localStorage.getItem(People_Storage_Key)) {
    // We use Date.now() + a small offset for initial static data
    let initialPeople = [
      {
        id: (Date.now() + 1) + Math.random(),
        name: "John",
        surname: "Doe",
        email: "john.doe@example.com",
        username: "jdoe2026",
        profilePic: "images/john.jpg"
      },
      {
        id: (Date.now() + 2) + Math.random(),
        name: "Jane",
        surname: "Smith",
        email: "jane.smith@example.com",
        username: "jsmith_d",
        profilePic: "images/jane.jpg"
      },

      {
        id: (Date.now() + 3) + Math.random(),
        name: "Sarah",
        surname: "Meyer",
        email: "sarah.meyer@example.com",
        username: "Sarah_M",
        profilePic: "images/Sarah.jpg"
      },

      {
        id: (Date.now() + 4) + Math.random(),
        name: "Troy",
        surname: "Anderson",
        email: "troy.anderson@example.com",
        username: "johnAnders06",
        profilePic: "images/troy.jpg"
      },

      {
        id: (Date.now() + 5) + Math.random(),
        name: "Andrew",
        surname: "Whithers",
        email: "andrew.whithers@example.com",
        username: "andrewWhithers_W",
        profilePic: "images/Andrew.jpg"
      },

      {
        id: (Date.now() + 6) + Math.random(),
        name: "Alex",
        surname: "Ferguson",
        email: "alex.ferguson@example.com",
        username: "AlexFur6",
        profilePic: "images/alex.jpg"
      },

      {
        id: (Date.now() + 7) + Math.random(),
        name: "Maggy",
        surname: "Laurens",
        email: "maggy.laurens@example.com",
        username: "MaggyLaur_88",
        profilePic: "images/maggy.jpg"
      },

      {
        id: (Date.now() + 8) + Math.random(),
        name: "Paul",
        surname: "Mitchell",
        email: "paul.mitcheldel@example.com",
        username: "pMitch_M",
        profilePic: "images/paul.jpg"
      },

      {
        id: (Date.now() + 9) + Math.random(),
        name: "Shane",
        surname: "Carson",
        email: "shane.carson@example.com",
        username: "shaneCars_15",
        profilePic: "images/shane.jpg"
      },

      {
        id: (Date.now() + 10) + Math.random(),
        name: "Mary",
        surname: "Stewart",
        email: "mary.stewart@example.com",
        username: "Mary_Stewart",
        profilePic: "images/mary.jpg"
      },

      {
        id: (Date.now() + 11) + Math.random(),
        name: "Kate",
        surname: "Larson",
        email: "kate.larson@example.com",
        username: "KateLar_son",
        profilePic: "images/kate.jpg"
      },

      {
        id: (Date.now() + 12) + Math.random(),
        name: "Jordan",
        surname: "King",
        email: "jordan.king@example.com",
        username: "JordanK",
        profilePic: "images/jordan.jpg"
      },

      {
        id: (Date.now() + 13) + Math.random(),
        name: "Nikolai",
        surname: "Sokolov",
        email: "nikolai.sokolov@example.com",
        username: "NikoSokolov_kolia",
        profilePic: "images/nikolai.jpg"
      },
    ];
    localStorage.setItem(People_Storage_Key, JSON.stringify(initialPeople)); //[cite: 14, 190]
  }
}


function populateAssigneeDropdown() {
  let dropdown = document.getElementById('assignee');
  let people = getAllPeople(); // Get data 

  if (!dropdown || !people) return;

  // Clear existing options first (except the default one)
  dropdown.innerHTML = '<option value="">-- Select Option --</option>';

  people.forEach(person => {
    let option = document.createElement('option');
    option.value = person.id; // Store the ID as the value
    option.textContent = `${person.name} ${person.surname}`; // Show name to user
    dropdown.appendChild(option);
  });
}



// --- PERSON C: LOOKUP HELPERS ---

// This function finds a person's full name using their unique Date.now() ID [cite: 148]
function getPersonNameById(id) {
  let people = getAllPeople();
  // We use == instead of === in case the ID is stored as a string or number
  let person = people.find(p => p.id == id);
  return person ? `${person.name} ${person.surname}` : "Unassigned"; //[cite: 178]

}

function getPersonProfilePicById(id) {
  let person = getPersonById(id);
  return person ? person.profilePic : "images/default.jpg";
}

// Helper to get the full person object by ID
function getPersonById(id) {
  let people = getAllPeople();
  return people.find(p => p.id == id);
}

// This function finds a project's name using its unique ID [cite: 151]
function getProjectNameById(id) {
  let projects = getAllProjects();
  let project = projects.find(p => p.id == id);
  return project ? project.name : "No Project"; //[cite: 188]
}

// 3. Populate Dropdowns (For the Form Page)
function populateAssigneeDropdown() {
  let personSelect = document.getElementById('selectAssignedTo');


  let people = getAllPeople();

  // Allow for "Delayed Assignment" by adding a default empty option
  if (personSelect) {
    personSelect.innerHTML = '<option value="">-- Assign Later --</option>';
    people.forEach(p => {
      personSelect.innerHTML += `<option value="${p.id}">${p.name} ${p.surname}</option>`;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initPeople();
  populateAssigneeDropdown(); // This now populates both project and assignee
});