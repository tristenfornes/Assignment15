// Function to open Add Craft Modal
function openModal() {
    document.getElementById('myModal').style.display = 'block';
}

// Function to close Add Craft Modal
function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}

// Function to clear form inputs
function clearForm() {
    document.getElementById('add-craft-form').reset();
    document.getElementById('additional-supplies').innerHTML = '';
}

// Event listener for opening Add Craft Modal
document.getElementById('add-item').addEventListener('click', function() {
    openModal();
    clearForm();
});

// Event listener for closing Add Craft Modal
document.getElementsByClassName('close')[0].addEventListener('click', function() {
    closeModal();
});

// Event listener for cancel button in Add Craft Modal
document.getElementById('cancel-btn').addEventListener('click', function() {
    closeModal();
});

// Event listener for adding new supply input field
document.getElementById('add-supply-btn').addEventListener('click', function(event) {
    event.preventDefault();
    const suppliesContainer = document.getElementById('additional-supplies');
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'supplies';
    input.required = true;
    suppliesContainer.appendChild(input);
    suppliesContainer.appendChild(document.createElement('br'));
});

// Event listener for form submission in Add Craft Modal
document.getElementById('add-craft-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Fetch form data
    const formData = new FormData(this);

    // Send form data to server using Fetch API
    fetch('/crafts', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add craft');
        }
        closeModal();
        clearForm();
        // Reload page to display newly added craft
        window.location.reload();
    })
    .catch(error => console.error(error));
});
