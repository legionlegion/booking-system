import 'cypress-real-events/support'

describe('Registration and Login', () => {
  it('should register and login', () => {
    const username = 'TestUser4';
    const password = 'TestPass4';
    
    // Go to Homepage
    cy.visit('http://localhost:3000/');
    
    // Click on 'Register' button
    cy.get('button:contains("Register")').click();
    
    // Fill in the registration form
    cy.get('input#username').type(username);
    cy.get('input#password').type(password);
    
    // Click on 'Submit' button - Replace with your actual Submit button element
    cy.get('button:contains("Register")').last().click();

    // Validate redirection to homepage
    cy.url().should('eq', 'http://localhost:3000/');
    
    // Fill out login form
    cy.get('input[placeholder="Username"]').type(username);
    cy.get('input[placeholder="Password"]').type(password);
    
    // Click on 'Login' button - Replace with your actual Login button element
    cy.get('button:contains("Login")').click();

  });
});



describe('Form submission', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');

    // Assumes that this is the login page
    cy.get('input[placeholder="Username"]').type('admin');
    cy.get('input[placeholder="Password"]').type('admin');
    cy.get('button:contains("Login")').click();

  });

  it('fills and submits the form', () => {

    cy.get('[data-testid="name-field"]').type('Form Test');

    // Interacting with MUI Select, DatePicker and TimePicker can be tricky.
    // You need to interact with the underlying DOM elements.
    // For demonstration, the direct interaction is used, but it might not work in real world application.
    cy.get('[data-testid="purpose-field"]').click().get('li[data-value="Personal"]').click();

    cy.get('[data-testid="unitlevel-field"]').click().get('li[data-value="3"]').click();

    cy.get('[data-testid="unitroom-field"]').click().get('li[data-value="01"]').click();

    cy.get('[data-testid="unitletter-field"]').click().get('li[data-value="A"]').click();


    cy.contains('label', 'Start date').parent().find('button').click().then(() => {
      cy.wait(500); // wait for half a second
      cy.get('div[role="dialog"]').should('be.visible'); // Wait for the date picker to open
      cy.get('button.MuiButtonBase-root.MuiPickersDay-root').contains('1').click(); // Click on the 31 day
    });  
    
    // Open the clock for Start Time
    cy.contains('Start Time').parent().find('div.MuiInputBase-root').click();
    cy.get('.MuiClock-wrapper').within(() => {
      cy.get('span[role="option"][aria-label="1 hours"]').realClick();   // select 1 hour
    });
    cy.contains('button', 'OK').click(); 


    cy.contains('label', 'End date').parent().find('button').click().then(() => {
      cy.wait(500); // wait for half a second
      cy.get('div[role="dialog"]').should('be.visible'); // Wait for the date picker to open
      cy.get('button.MuiButtonBase-root.MuiPickersDay-root').contains('1').click(); // Click on the 31 day
    });

    // Open the clock for End Time
    cy.contains('End Time').parent().find('div.MuiInputBase-root').click();
    cy.get('.MuiClock-wrapper').within(() => {
      cy.get('span[role="option"][aria-label="2 hours"]').realClick();   // select 3 hour
    });
    cy.contains('button', 'OK').click(); 

    cy.get('input[value="Submit"]').click();
  });
});


