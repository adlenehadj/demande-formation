document.getElementById('demande-formation-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = {
        employeeName: document.getElementById('employee-name').value,
        courseProvider: document.getElementById('course-provider').value,
        courseCode: document.getElementById('course-code').value,
        courseTitle: document.getElementById('course-title').value,
        registrationDeadline: document.getElementById('registration-deadline').value,
        category: document.getElementById('category').value,
        learningMode: document.getElementById('learning-mode').value,
        courseLanguage: document.getElementById('course-language').value,
        courseDuration: document.getElementById('course-duration').value,
        courseFee: document.getElementById('course-fee').value,
        courseStartDate: document.getElementById('course-start-date').value
    };
    
    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
