document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatOutput = document.getElementById('chat-output');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const message = userInput.value;
        if (!message.trim()) {
            return;
        }

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            chatOutput.textContent = data.answer;

        } catch (error) {
            console.error('Error:', error);
            chatOutput.textContent = 'An error occurred while processing your request.';
        } finally {
            userInput.value = ''; // Clear input field
        }
    });
});
