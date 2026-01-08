// Get DOM elements
const birthDateInput = document.getElementById('birthDate');
const calculateBtn = document.getElementById('calculateBtn');
const resultSection = document.getElementById('resultSection');
const errorMessage = document.getElementById('errorMessage');

// Age calculation elements
const yearsElement = document.getElementById('years');
const monthsElement = document.getElementById('months');
const daysElement = document.getElementById('days');
const totalDaysElement = document.getElementById('totalDays');
const totalHoursElement = document.getElementById('totalHours');
const totalMinutesElement = document.getElementById('totalMinutes');

// Set maximum date to today
birthDateInput.max = new Date().toISOString().split('T')[0];

// Calculate age function
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    
    // Adjust for negative days
    if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }
    
    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Calculate total time
    const timeDiff = today - birth;
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    
    return {
        years,
        months,
        days,
        totalDays,
        totalHours,
        totalMinutes
    };
}

// Animate number counting
function animateNumber(element, targetValue, duration = 1000) {
    const startValue = parseInt(element.textContent) || 0;
    const difference = targetValue - startValue;
    const steps = 30;
    const increment = difference / steps;
    const stepDuration = duration / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
        currentStep++;
        const currentValue = Math.round(startValue + (increment * currentStep));
        element.textContent = currentValue;
        
        // Add animation class for pop effect
        element.classList.add('animate');
        setTimeout(() => {
            element.classList.remove('animate');
        }, 300);
        
        if (currentStep >= steps) {
            element.textContent = targetValue;
            clearInterval(timer);
        }
    }, stepDuration);
}

// Format large numbers with commas
function formatNumber(num) {
    return num.toLocaleString();
}

// Display results
function displayResults(ageData) {
    // Show result section
    resultSection.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    
    // Scroll to results smoothly
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
    
    // Animate numbers
    animateNumber(yearsElement, ageData.years);
    animateNumber(monthsElement, ageData.months);
    animateNumber(daysElement, ageData.days);
    
    // Update additional info with formatted numbers
    setTimeout(() => {
        totalDaysElement.textContent = formatNumber(ageData.totalDays);
        totalHoursElement.textContent = formatNumber(ageData.totalHours);
        totalMinutesElement.textContent = formatNumber(ageData.totalMinutes);
    }, 500);
}

// Show error
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    resultSection.classList.add('hidden');
    
    // Scroll to error
    setTimeout(() => {
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Validate date
function validateDate(dateString) {
    if (!dateString) {
        return { valid: false, message: 'Please select your birth date' };
    }
    
    const selectedDate = new Date(dateString);
    const today = new Date();
    
    if (selectedDate > today) {
        return { valid: false, message: 'Birth date cannot be in the future' };
    }
    
    // Check if date is too old (more than 150 years)
    const yearsDiff = today.getFullYear() - selectedDate.getFullYear();
    if (yearsDiff > 150) {
        return { valid: false, message: 'Please enter a valid birth date' };
    }
    
    return { valid: true };
}

// Handle calculate button click
calculateBtn.addEventListener('click', () => {
    const birthDate = birthDateInput.value;
    
    // Validate input
    const validation = validateDate(birthDate);
    if (!validation.valid) {
        showError(validation.message);
        return;
    }
    
    // Calculate age
    const ageData = calculateAge(birthDate);
    
    // Display results
    displayResults(ageData);
});

// Handle Enter key press on date input
birthDateInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateBtn.click();
    }
});

// Add ripple effect to button
calculateBtn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    this.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
});

// Add some interactive feedback
birthDateInput.addEventListener('focus', () => {
    birthDateInput.style.transform = 'scale(1.02)';
});

birthDateInput.addEventListener('blur', () => {
    birthDateInput.style.transform = 'scale(1)';
});

