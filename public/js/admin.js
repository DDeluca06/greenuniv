console.log('Admin.js loaded'); // Debugging

const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.onsubmit = async function(event) {
        event.preventDefault(); // Prevent default form submission
        console.log('handleFormSubmit function triggered for:', form.action);
        await handleFormSubmit(event, this);
    };
});
console.log('Event listeners attached to forms');

async function handleFormSubmit(event, form) {
    console.log('handleFormSubmit function triggered for:', form.action);

    const formData = new FormData(form);
    const action = form.action;

    // Define formJSON from formData
    const formJSON = Object.fromEntries(formData.entries());

    try {
        console.log('Submitting form to:', action);
        console.log('Form data:', formJSON); // Logs form values

        const response = await fetch(action, {
            method: 'POST',
            body: JSON.stringify(formJSON),
            headers: {
                'Accept': 'application/json', // Ensures response is JSON
                'Content-Type': 'application/json' // Tells the server we are sending JSON
            }
        });

        if (!response.ok) {
            throw new Error('Failed to create entry');
        }

        const result = await response.json();
        console.log('Response received:', result);

        if (result && result.message) {
            console.log('Triggering showModal with:', result.message); // Debug log
            showModal('Success', result.message);
        } else {
            console.error('Unexpected API response:', result);
            showModal('Error', 'Unexpected response from server.');
        }        
    } catch (error) {
        console.error(error);
        showModal('Error', 'Failed to create entry.');
    }
}

function showModal(title, message) {
    console.log('showModal called with:', title, message);

    const modal = document.getElementById('feedback-modal');
    if (!modal) {
        console.error('Modal element not found!');
        return;
    }

    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = message;

    // Ensure modal is visible
    modal.style.display = "flex"; // Alternative: modal.classList.replace('hidden', 'flex');
}

function closeModal() {
    const modal = document.getElementById('feedback-modal');
    if (modal) {
        modal.style.display = "none"; // Alternative: modal.classList.add('hidden');
    }
}
