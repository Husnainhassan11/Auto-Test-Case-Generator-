// Example user stories
const examples = {
    login: "As a user, I want to be able to login with my email and password so that I can access my account.\nAs a user, I want the system to prevent login after multiple failed attempts to enhance security.",
    cart: "As a customer, I want to add items to my shopping cart so that I can purchase them later.\nAs a customer, I want to remove items from my shopping cart so that I can update my order before purchasing.",
    profile: "As a user, I want to update my profile information including name, email, and password so that I can keep my account details current.\nAs a user, I want to upload a profile picture so that others can recognize me in the system.",
    payment: "As a customer, I want to pay for my order using a credit card so that I can complete my purchase.\nAs a customer, I want to receive a confirmation email after successful payment so that I have proof of purchase."
};

// Set up example buttons
document.querySelectorAll('.example-btn').forEach(button => {
    button.addEventListener('click', () => {
        const exampleType = button.getAttribute('data-example');
        document.getElementById('userStories').value = examples[exampleType];
    });
});

// Generate test cases when button is clicked
document.getElementById('generateBtn').addEventListener('click', function() {
    const userStories = document.getElementById('userStories').value;
    const testFormat = document.getElementById('testFormat').value;
    const detailLevel = document.getElementById('testDetail').value;
    const includePositive = document.getElementById('positiveTests').checked;
    const includeNegative = document.getElementById('negativeTests').checked;
    const includeEdgeCases = document.getElementById('edgeCases').checked;
    const testCount = parseInt(document.getElementById('testCount').value);
    const includeSetup = document.getElementById('includeSetup').value;
    
    if (!userStories.trim()) {
        alert('Please enter at least one user story or requirement.');
        return;
    }
    
    const testCases = generateTestCases(userStories, testFormat, detailLevel, 
                                      includePositive, includeNegative, includeEdgeCases, 
                                      testCount, includeSetup);
    
    displayTestCases(testCases, testFormat);
});

// Function to generate test cases based on user stories
function generateTestCases(stories, testFormat, detailLevel, 
                         includePositive, includeNegative, includeEdgeCases, 
                         testCount, includeSetup) {
    const lines = stories.split('\n').filter(line => line.trim().length > 0);
    const testCases = [];
    let testId = 1;
    
    for (const line of lines) {
        if (line.trim().length === 0) continue;
        
        const testCase = {
            id: testId++,
            title: extractTestCaseTitle(line),
            description: line,
            tests: []
        };
        
        // Generate positive tests
        if (includePositive) {
            for (let i = 0; i < testCount; i++) {
                testCase.tests.push(...generatePositiveTests(line, testFormat, detailLevel, i, includeSetup));
            }
        }
        
        // Generate negative tests
        if (includeNegative) {
            for (let i = 0; i < testCount; i++) {
                testCase.tests.push(...generateNegativeTests(line, testFormat, detailLevel, i, includeSetup));
            }
        }
        
        // Generate edge cases
        if (includeEdgeCases) {
            for (let i = 0; i < testCount; i++) {
                testCase.tests.push(...generateEdgeCases(line, testFormat, detailLevel, i, includeSetup));
            }
        }
        
        testCases.push(testCase);
    }
    
    return testCases;
}

// Extract test case title from user story
function extractTestCaseTitle(userStory) {
    // Simple pattern matching to extract the core functionality
    if (userStory.includes(' so that ')) {
        return userStory.split(' so that ')[0].replace(/^As a [^,]+?, I want to /, '').trim();
    }
    
    if (userStory.includes(' I want to ')) {
        return userStory.split(' I want to ')[1].trim();
    }
    
    return userStory;
}

// Generate positive tests based on user story content
function generatePositiveTests(userStory, testFormat, detailLevel, index, includeSetup) {
    const tests = [];
    const testType = "positive";
    
    // Extract key actions from the user story
    if (userStory.toLowerCase().includes('login')) {
        tests.push({
            name: `Valid login with correct credentials`,
            type: testType,
            description: "Verify that a user can successfully login with valid credentials",
            steps: [
                "Navigate to the login page",
                "Enter a valid email address",
                "Enter the correct password",
                "Click the login button",
                "Verify that the user is redirected to the dashboard",
                "Verify that the user session is established"
            ],
            expected: "User should be successfully logged in and redirected to the dashboard",
            setup: includeSetup === 'yes' ? [
                "Ensure test user account exists with known credentials",
                "Clear any existing user sessions"
            ] : [],
            teardown: includeSetup === 'yes' ? [
                "Logout the user after test completion",
                "Clear test data if created during test"
            ] : []
        });
        
        if (detailLevel !== 'basic') {
            tests.push({
                name: `Login with remember me option`,
                type: testType,
                description: "Verify that login persists when 'Remember Me' is selected",
                steps: [
                    "Navigate to the login page",
                    "Enter valid credentials",
                    "Check the 'Remember Me' checkbox",
                    "Click the login button",
                    "Close and reopen the browser",
                    "Navigate to the application URL"
                ],
                expected: "User should remain logged in without needing to re-enter credentials",
                setup: includeSetup === 'yes' ? [
                    "Ensure test user account exists",
                    "Clear browser cookies and cache before test"
                ] : [],
                teardown: includeSetup === 'yes' ? [
                    "Logout and clear cookies after test"
                ] : []
            });
        }
    }
    
    if (userStory.toLowerCase().includes('add') && userStory.toLowerCase().includes('cart')) {
        tests.push({
            name: `Add valid item to shopping cart`,
            type: testType,
            description: "Verify that a user can add a valid product to the shopping cart",
            steps: [
                "Navigate to the product catalog",
                "Select a product that is in stock",
                "Click the 'Add to Cart' button",
                "Verify that the cart icon updates with the item count",
                "Navigate to the shopping cart page",
                "Verify the product is listed in the cart"
            ],
            expected: "Product should be successfully added to the cart with correct details",
            setup: includeSetup === 'yes' ? [
                "Ensure test products are available in the catalog",
                "Clear the shopping cart before test"
            ] : [],
            teardown: includeSetup === 'yes' ? [
                "Remove items from cart after test completion"
            ] : []
        });
    }
    
    if (userStory.toLowerCase().includes('profile')) {
        tests.push({
            name: `Update profile information`,
            type: testType,
            description: "Verify that a user can update their profile information",
            steps: [
                "Login to the application",
                "Navigate to the profile settings page",
                "Update the name field with a new value",
                "Update the email field with a valid email",
                "Click the 'Save Changes' button",
                "Verify success message is displayed",
                "Logout and login again to verify changes persist"
            ],
            expected: "Profile information should be updated successfully and persist after logout/login",
            setup: includeSetup === 'yes' ? [
                "Ensure test user account exists",
                "Note original profile values for restoration"
            ] : [],
            teardown: includeSetup === 'yes' ? [
                "Restore original profile values after test"
            ] : []
        });
    }
    
    // Generic test case if no specific patterns matched
    if (tests.length === 0) {
        tests.push({
            name: `Successful operation with valid inputs`,
            type: testType,
            description: "Verify that the functionality works correctly with valid inputs",
            steps: [
                "Navigate to the relevant page/feature",
                "Provide valid input data",
                "Execute the operation",
                "Verify the operation completes successfully",
                "Verify the expected outcome is achieved"
            ],
            expected: "Operation should complete successfully with expected results",
            setup: includeSetup === 'yes' ? [
                "Prepare test environment with necessary data"
            ] : [],
            teardown: includeSetup === 'yes' ? [
                "Clean up test data after completion"
            ] : []
        });
    }
    
    return tests;
}

// Generate negative tests based on user story content
function generateNegativeTests(userStory, testFormat, detailLevel, index, includeSetup) {
    const tests = [];
    const testType = "negative";
    
    if (userStory.toLowerCase().includes('login')) {
        tests.push({
            name: `Login with incorrect credentials`,
            type: testType,
            description: "Verify that login fails with incorrect credentials",
            steps: [
                "Navigate to the login page",
                "Enter a valid email address",
                "Enter an incorrect password",
                "Click the login button"
            ],
            expected: "Login should fail with appropriate error message",
            setup: includeSetup === 'yes' ? [
                "Ensure test user account exists"
            ] : [],
            teardown: includeSetup === 'yes' ? [
                "Clear any error states after test"
            ] : []
        });
        
        if (userStory.toLowerCase().includes('attempt')) {
            tests.push({
                name: `Login after multiple failed attempts`,
                type: testType,
                description: "Verify that account gets locked after multiple failed login attempts",
                steps: [
                    "Navigate to the login page",
                    "Enter a valid email address",
                    "Enter incorrect password 5 times consecutively",
                    "Attempt to login with correct credentials on the 6th attempt"
                ],
                expected: "Account should be temporarily locked after 5 failed attempts",
                setup: includeSetup === 'yes' ? [
                    "Ensure test user account exists and is not locked"
                ] : [],
                teardown: includeSetup === 'yes' ? [
                    "Reset account lock status after test"
                ] : []
            });
        }
    }
    
    if (userStory.toLowerCase().includes('add') && userStory.toLowerCase().includes('cart')) {
        tests.push({
            name: `Add invalid item to shopping cart`,
            type: testType,
            description: "Verify that invalid items cannot be added to the cart",
            steps: [
                "Navigate to the product catalog",
                "Attempt to add a product that doesn't exist (via URL manipulation)",
                "Verify the system response"
            ],
            expected: "System should reject the request with appropriate error message",
            setup: includeSetup === 'yes' ? [
                "Ensure test environment is properly configured"
            ] : [],
            teardown: includeSetup === 'yes' ? [] : []
        });
    }
    
    // Generic negative test case
    if (tests.length === 0) {
        tests.push({
            name: `Operation failure with invalid inputs`,
            type: testType,
            description: "Verify that the functionality fails gracefully with invalid inputs",
            steps: [
                "Navigate to the relevant page/feature",
                "Provide invalid or malformed input data",
                "Execute the operation",
                "Verify the operation fails appropriately"
            ],
            expected: "Operation should fail with clear error message, not crash",
            setup: includeSetup === 'yes' ? [
                "Prepare test environment"
            ] : [],
            teardown: includeSetup === 'yes' ? [
                "Clean up any error states"
            ] : []
        });
    }
    
    return tests;
}

// Generate edge case tests based on user story content
function generateEdgeCases(userStory, testFormat, detailLevel, index, includeSetup) {
    const tests = [];
    const testType = "edge";
    
    if (userStory.toLowerCase().includes('login')) {
        tests.push({
            name: `Login with empty credentials`,
            type: testType,
            description: "Verify behavior when login is attempted with empty fields",
            steps: [
                "Navigate to the login page",
                "Leave both email and password fields empty",
                "Click the login button"
            ],
            expected: "System should display appropriate validation messages",
            setup: includeSetup === 'yes' ? [] : [],
            teardown: includeSetup === 'yes' ? [] : []
        });
    }
    
    if (userStory.toLowerCase().includes('add') && userStory.toLowerCase().includes('cart')) {
        tests.push({
            name: `Add out-of-stock item to cart`,
            type: testType,
            description: "Verify behavior when attempting to add an out-of-stock item",
            steps: [
                "Navigate to a product that is out of stock",
                "Attempt to add the product to the cart"
            ],
            expected: "System should prevent adding out-of-stock items with appropriate message",
            setup: includeSetup === 'yes' ? [
                "Ensure an out-of-stock product exists in catalog"
            ] : [],
            teardown: includeSetup === 'yes' ? [] : []
        });
    }
    
    if (userStory.toLowerCase().includes('profile')) {
        tests.push({
            name: `Update profile with extremely long values`,
            type: testType,
            description: "Verify behavior when profile fields contain maximum allowed characters",
            steps: [
                "Login to the application",
                "Navigate to profile settings",
                "Enter the maximum allowed characters in each field",
                "Save the changes"
            ],
            expected: "System should accept and properly handle maximum length inputs",
            setup: includeSetup === 'yes' ? [
                "Ensure test user account exists"
            ] : [],
            teardown: includeSetup === 'yes' ? [
                "Restore original profile values"
            ] : []
        });
    }
    
    return tests;
}

// Display generated test cases based on selected format
function displayTestCases(testCases, testFormat) {
    const outputDiv = document.getElementById('testOutput');
    outputDiv.innerHTML = '';
    
    if (testCases.length === 0) {
        outputDiv.innerHTML = '<p>No test cases generated. Please check your input.</p>';
        return;
    }
    
    testCases.forEach((testCase, index) => {
        const testCaseDiv = document.createElement('div');
        testCaseDiv.className = 'test-case';
        
        if (testFormat === 'standard') {
            testCaseDiv.innerHTML = generateStandardFormat(testCase);
        } else if (testFormat === 'detailed') {
            testCaseDiv.innerHTML = generateDetailedFormat(testCase);
        } else if (testFormat === 'simple') {
            testCaseDiv.innerHTML = generateSimpleFormat(testCase);
        }
        
        outputDiv.appendChild(testCaseDiv);
    });
    
    // Add copy functionality
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
            const testCaseElement = button.closest('.test-case');
            const textToCopy = testCaseElement.innerText;
            copyToClipboard(textToCopy);
            showNotification('Test case copied to clipboard!');
        });
    });
}

// Generate standard test case format
function generateStandardFormat(testCase) {
    let html = `<h3>Test Case ${testCase.id}: ${testCase.title}</h3>`;
    html += `<p><strong>User Story:</strong> ${testCase.description}</p>`;
    
    testCase.tests.forEach(test => {
        html += `
            <div class="test-scenario">
                <p><span class="test-id">${test.name}</span> <span class="test-type ${test.type}">${test.type}</span></p>
                <p><strong>Description:</strong> ${test.description}</p>
                
                <div class="test-details">
                    <p><strong>Test Steps:</strong></p>
                    ${test.steps.map(step => `<div class="test-step">${step}</div>`).join('')}
                </div>
                
                <p><strong>Expected Result:</strong> ${test.expected}</p>
                
                ${test.setup.length > 0 ? `
                    <div class="test-meta">
                        <div class="meta-item"><strong>Setup:</strong> ${test.setup.join('; ')}</div>
                    </div>
                ` : ''}
                
                ${test.teardown.length > 0 ? `
                    <div class="test-meta">
                        <div class="meta-item"><strong>Teardown:</strong> ${test.teardown.join('; ')}</div>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += `<button class="copy-btn">Copy Test Case</button>`;
    return html;
}

// Generate detailed test scenario format
function generateDetailedFormat(testCase) {
    let html = `<h3>Test Scenario ${testCase.id}: ${testCase.title}</h3>`;
    html += `<p><strong>Related User Story:</strong> ${testCase.description}</p>`;
    
    testCase.tests.forEach((test, idx) => {
        html += `
            <div class="test-scenario">
                <p><span class="test-id">Scenario ${testCase.id}.${idx + 1}: ${test.name}</span> <span class="test-type ${test.type}">${test.type}</span></p>
                <p><strong>Objective:</strong> ${test.description}</p>
                
                <div class="test-details">
                    <p><strong>Preconditions:</strong></p>
                    ${test.setup.length > 0 ? 
                        test.setup.map(precondition => `<div class="test-step">${precondition}</div>`).join('') : 
                        '<div class="test-step">None</div>'
                    }
                </div>
                
                <div class="test-details">
                    <p><strong>Test Procedure:</strong></p>
                    ${test.steps.map((step, stepIdx) => `<div class="test-step"><strong>Step ${stepIdx + 1}:</strong> ${step}</div>`).join('')}
                </div>
                
                <p><strong>Expected Outcome:</strong> ${test.expected}</p>
                
                ${test.teardown.length > 0 ? `
                    <div class="test-details">
                        <p><strong>Postconditions:</strong></p>
                        ${test.teardown.map(postcondition => `<div class="test-step">${postcondition}</div>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    html += `<button class="copy-btn">Copy Test Scenario</button>`;
    return html;
}

// Generate simple checklist format
function generateSimpleFormat(testCase) {
    let html = `<h3>${testCase.title} - Test Checklist</h3>`;
    html += `<p><strong>Based on:</strong> ${testCase.description}</p>`;
    
    testCase.tests.forEach((test, idx) => {
        html += `
            <div class="test-scenario">
                <p><input type="checkbox"> <span class="test-id">${test.name}</span> <span class="test-type ${test.type}">${test.type}</span></p>
                <p>${test.description}</p>
            </div>
        `;
    });
    
    html += `<button class="copy-btn">Copy Checklist</button>`;
    return html;
}

// Copy text to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}