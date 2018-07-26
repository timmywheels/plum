(function( $ ) {
	'use strict';

	const calculator = {

		nextBtn: {
		  btn1: document.getElementById('nextBtn-1'),
		  btn2: document.getElementById('nextBtn-2'),
		  btn3: document.getElementById('nextBtn-3'),
		  btn4: document.getElementById('nextBtn-4'),
		  submitBtn: document.getElementById('submitBtn')
		},
	  
		pages: {
		  pg1: document.getElementById('page-1'),
		  pg2: document.getElementById('page-2'),
		  pg3: document.getElementById('page-3'),
		  pg4: document.getElementById('page-4'),
		  pg5: document.getElementById('page-5')
		},
	  
		clientInput: {
		  age: document.getElementById('ageInput'),
		  annualIncome: document.getElementById('annualIncomeInput'),
		  currentRetirementSavings: document.getElementById('currentRetirementSavingsInput'),
		  percentageAnnualRaises: document.getElementById('percentageAnnualRaisesInput'),
		  expectedRetirementAge: document.getElementById('expectedRetirementAgeInput'),
		  expectedRetirementLength: document.getElementById('expectedRetirementLengthInput'),
		  percentPreRetirementIncome: document.getElementById('percentPreRetirementIncomeInput'),
		  taxReturnBeforeRetirement: document.getElementById('taxReturnBeforeRetirementInput'),
		  taxReturnAfterRetirement: document.getElementById('taxReturnAfterRetirementInput'),
		  firstName: document.getElementById('clientFirstNameInput'),
		  lastName: document.getElementById('clientLastNameInput'),
		  email: document.getElementById('clientEmailInput'),
		  phone: document.getElementById('clientPhoneInput')
		},
	  
		clientInfo: {
		  section: document.getElementById('clientInfo'),
		  age: document.getElementById('age'),
		  annualIncome: document.getElementById('annualIncome'),
		  currentRetirementSavings: document.getElementById('currentRetirementSavings'),
		  percentageAnnualRaises: document.getElementById('percentageAnnualRaises'),
		  expectedRetirementAge: document.getElementById('expectedRetirementAge'),
		  expectedRetirementLength: document.getElementById('expectedRetirementLength'),
		  percentPreRetirementIncome: document.getElementById('percentPreRetirementIncome'),
		  taxReturnBeforeRetirement: document.getElementById('taxReturnBeforeRetirement'),
		  taxReturnAfterRetirement: document.getElementById('taxReturnAfterRetirement'),
		  firstName: document.getElementById('clientFirstName'),
		  lastName: document.getElementById('clientLastName'),
		  email: document.getElementById('clientEmail'),
		  phone: document.getElementById('clientPhone')
		},
	  
	  
	  };
	  
	  const client = {
		age: '', // 20 - 80
		annualIncome: '', // $0 - $500k
		currentRetirementSavings: '', // $0 - $500K
		percentageAnnualRaises: '', // 0% - 12%
		expectedRetirementAge: '', // 35 - 85
		expectedRetirementLength: '', // 0 - 40
		percentPreRetirementIncome: '', // 0% - 100%
		taxReturnBeforeRetirement: '', // 0% - 10%
		taxReturnAfterRetirement: '', // 0% - 10%
		firstName: '',
		lastName: '',
		email: '',
		phone: ''
	  };
	  
	  const handlers = {
	  
		setupEventListeners: () => {
		  const form = document.getElementById('calculator');
	  
		  form.addEventListener('click', (e) => {
			e.preventDefault();
	  
			if(e.target.id === 'nextBtn-1') {
			  calculator.pages.pg1.classList.add('displayNone');
			  calculator.pages.pg2.classList.remove('displayNone');
			  handlers.updateClientAge();
			  handlers.updateClientAnnualIncome();
			  // console.log(client);
	  
			}
	  
			if(e.target.id === 'nextBtn-2') {
			  calculator.pages.pg2.classList.add('displayNone');
			  calculator.pages.pg3.classList.remove('displayNone');
			  handlers.updateClientCurrentRetirementSavings();
			  handlers.updateClientPercentageAnnualRaises();
			  // console.log(client);
	  
			}
	  
			if(e.target.id === 'nextBtn-3') {
			  calculator.pages.pg3.classList.add('displayNone');
			  calculator.pages.pg4.classList.remove('displayNone');
			  handlers.updateClientExpectedRetirementAge();
			  handlers.updateClientExpectedRetirementLength();
			  // console.log(client);
	  
			}
	  
			if(e.target.id === 'nextBtn-4') {
			  calculator.pages.pg4.classList.add('displayNone');
			  calculator.pages.pg5.classList.remove('displayNone');
			  handlers.updateClientPercentPreRetirementIncome();
			  handlers.updateClientTaxReturnBeforeRetirement();
			  handlers.updateClientTaxReturnAfterRetirement();
			}
	  
			if(e.target.id === 'submitBtn') {
			  // calculator.pages.pg4.classList.add('displayNone');
			  handlers.updateClientFirstName();
			  handlers.updateClientLastName();
			  handlers.updateClientEmail();
			  handlers.updateClientPhone();
			  calculator.clientInfo.section.classList.remove('displayNone');
			  console.log(client);
			  console.log(JSON.stringify(client));
	  
			  $.ajax({
				type: "POST",
				url: "https://mandrillapp.com/api/1.0/messages/send.json",
				data: {
				  'key': 'xWpoj3QqZHv7pDNIz1VJEg',
				  'message': {
					'from_email': 'tim@devplum.com',
					'to': [
					  {
						'email': 'tim@devplum.com',
						'name': 'Plum Direct Marketing',
						'type': 'to'
					  },
					  {
						'email': client.email,
						'name': client.firstName + '' + client.lastName,
						'type': 'to'
					  }
					],
					'autotext': 'true',
					'subject': 'YOUR SUBJECT HERE!',
					'html': JSON.stringify(client)
				  }
				}
			  }).done(function(response) {
				console.log(response); // if you're into that sorta thing
			  });
	  
	  
			}
	  
		  });
		},
	  
		updateClientAge: () => {
	  
		  client.age = calculator.clientInput.age.value;
		  calculator.clientInfo.age.innerText = 'Age: ' + calculator.clientInput.age.value;
		},
	  
		updateClientAnnualIncome: () => {
		  client.annualIncome = calculator.clientInput.annualIncome.value;
		  calculator.clientInfo.annualIncome.innerText = 'Annual Income: $' + parseFloat(calculator.clientInput.annualIncome.value.replace(/,/g, ''));
	  
		},
	  
		updateClientCurrentRetirementSavings: () => {
		  client.currentRetirementSavings = calculator.clientInput.currentRetirementSavings.value;
		  calculator.clientInfo.currentRetirementSavings.innerText = 'Current Retirement Savings: $' + parseFloat(calculator.clientInput.currentRetirementSavings.value.replace(/,/g, ''));
	  
		},
	  
		updateClientPercentageAnnualRaises: () => {
		  client.percentageAnnualRaises = calculator.clientInput.percentageAnnualRaises.value;
		  calculator.clientInfo.percentageAnnualRaises.innerText = 'Percentage of Annual Raises: ' + parseFloat(calculator.clientInput.percentageAnnualRaises.value.replace(/,/g, '')) + '%';
	  
		},
	  
		updateClientExpectedRetirementAge: () => {
		  client.expectedRetirementAge = calculator.clientInput.expectedRetirementAge.value;
		  calculator.clientInfo.expectedRetirementAge.innerText = 'Expected Retirement Age: ' + calculator.clientInput.expectedRetirementAge.value;
	  
		},
	  
		updateClientExpectedRetirementLength: () => {
		  client.expectedRetirementLength = calculator.clientInput.expectedRetirementLength.value;
		  calculator.clientInfo.expectedRetirementLength.innerText = 'Expected Retirement Length: ' + calculator.clientInput.expectedRetirementLength.value;
	  
		},
	  
		updateClientPercentPreRetirementIncome: () => {
		  client.percentPreRetirementIncome = calculator.clientInput.percentPreRetirementIncome.value;
		  calculator.clientInfo.percentPreRetirementIncome.innerText = 'Percentage Pre-Retirement Income: $' + parseFloat(calculator.clientInput.percentPreRetirementIncome.value.replace(/,/g, '')) + '%';
	  
	  
		},
	  
		updateClientTaxReturnBeforeRetirement: () => {
		  client.taxReturnBeforeRetirement = calculator.clientInput.taxReturnBeforeRetirement.value;
		  calculator.clientInfo.taxReturnBeforeRetirement.innerText = 'Tax Returns Before Retirement: $' + parseFloat(calculator.clientInput.taxReturnBeforeRetirement.value.replace(/,/g, ''));
	  
	  
		},
	  
		updateClientTaxReturnAfterRetirement: () => {
		  client.taxReturnAfterRetirement = calculator.clientInput.taxReturnAfterRetirement.value;
		  calculator.clientInfo.taxReturnAfterRetirement.innerText = 'Tax Returns After Retirement: $' + parseFloat(calculator.clientInput.taxReturnAfterRetirement.value.replace(/,/g, ''));
	  
	  
		},
		updateClientFirstName: () => {
		  client.firstName = calculator.clientInput.firstName.value;
		  calculator.clientInfo.firstName.innerText = 'First Name: ' + calculator.clientInput.firstName.value;
		},
	  
		updateClientLastName: () => {
		  client.lastName = calculator.clientInput.lastName.value;
		  calculator.clientInfo.lastName.innerText = 'Last Name: ' + calculator.clientInput.lastName.value;
		},
		updateClientEmail: () => {
		  client.email = calculator.clientInput.email.value;
		  calculator.clientInfo.email.innerText = 'Email: ' + calculator.clientInput.email.value;
		},
		updateClientPhone: () => {
		  client.phone = calculator.clientInput.phone.value;
		  calculator.clientInfo.phone.innerText = 'Phone: ' + calculator.clientInput.phone.value;
		},
	  
	  };
	  
	  handlers.setupEventListeners(); // Setup event listeners for the form
	  

})( jQuery );
