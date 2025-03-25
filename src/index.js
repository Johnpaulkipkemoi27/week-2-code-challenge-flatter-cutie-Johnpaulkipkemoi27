const baseUrl = "https://flattacuties.vercel.app/characters";

// Fetch Character Names
function fetchCharacterNames() {
    return fetch(baseUrl)
        .then(response => response.json());
}

function renderCharacterNames(character) {
    const characterBar = document.getElementById("character-bar");
    const span = document.createElement("span");
    span.innerText = character.name;
    span.dataset.id = character.id;
    span.addEventListener("click", onSpanCharacterClick);
    characterBar.appendChild(span);
}

fetchCharacterNames().then(characters => {
    characters.forEach(character => renderCharacterNames(character));
});

// Fetch Character Details
function fetchCharacterDetails(id) {
    return fetch(`${baseUrl}/${id}`)
        .then(response => response.json());
}

function onSpanCharacterClick(event) {
    const characterId = event.target.dataset.id;
    fetchCharacterDetails(characterId).then(renderCharacterDetails);
}

function renderCharacterDetails(character) {
    const charName = document.getElementById("name");
    const charImg = document.getElementById("image");
    const charVotes = document.getElementById("vote-count");

    charName.innerText = character.name;
    charImg.src = character.image;
    charVotes.innerText = character.votes;

    // Store the currently selected character ID for voting updates
    document.getElementById("votes-form").dataset.characterId = character.id;
}

// Handle Form Submission and Update Votes
document.getElementById("votes-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const votesForm = event.target;
    const votesInput = votesForm.querySelector('input[name="votes"]');
    const addedVotes = parseInt(votesInput.value);
    const voteCountElement = document.getElementById("vote-count");

    if (!addedVotes || isNaN(addedVotes)) {
        alert("Please enter a valid number of votes.");
        return;
    }

    const updatedVotes = parseInt(voteCountElement.innerText) + addedVotes;
    voteCountElement.innerText = updatedVotes;

    const characterId = votesForm.dataset.characterId;

    // Send PATCH request to update votes on the server
    fetch(`${baseUrl}/${characterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: updatedVotes }),
    });

    votesForm.reset();
});

// Reset Button Functionality
document.getElementById("reset-btn").addEventListener("click", () => {
    const voteCountElement = document.getElementById("vote-count");
    voteCountElement.innerText = 0;
});

// Ensure the script runs after the DOM has loaded
document.addEventListener("DOMContentLoaded", function () {
    fetchCharacterNames();
});
