$(document).ready(function() {
    $('#send-btn').click(function() {
        const userInput = $('#user-input').val();
        if (userInput.trim() === '') return;
        
        // Display user message
        $('#messages').append(`<div class="user-message">${userInput}</div>`);
        $('#user-input').val(''); // Clear input field
        
        // Call the API
        $.ajax({
            url: 'https://api.example.com/chat', // Replace with your API URL
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ message: userInput }),
            success: function(response) {
                // Display chatbot response
                $('#messages').append(`<div class="bot-message">${response.reply}</div>`);
            },
            error: function() {
                // Handle error
                $('#messages').append('<div class="bot-message">Sorry, there was an error.</div>');
            }
        });
    });
});
