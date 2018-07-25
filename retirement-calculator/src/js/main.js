// const nextBtn1 = document.getElementById('nextBtn-1');
// const nextBtn2 = document.getElementById('nextBtn-2');
// nextBtn1.addEventListener('click', (e)=> {
//   e.preventDefault();
//
//   const page1 = document.getElementById('page-1');
//   const page2 = document.getElementById('page-2');
//
//
//   page1.classList.add('displayNone');
//   page2.classList.add('display');
//
// });


const calculator = {

  nextBtn: {
    btn1: document.getElementById('nextBtn-1'),
    btn2: document.getElementById('nextBtn-2'),
    btn3: document.getElementById('nextBtn-3'),
    btn4: document.getElementById('nextBtn-4'),
  },

  pages: {
    pg1: document.getElementById('page-1'),
    pg2: document.getElementById('page-2'),
    pg3: document.getElementById('page-3'),
    pg4: document.getElementById('page-4')
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
    taxReturnAfterRetirement: document.getElementById('taxReturnAfterRetirementInput')
  },

  clientInfo: {
    age: document.getElementById('age'),
    annualIncome: document.getElementById('annualIncome'),
    currentRetirementSavings: document.getElementById('currentRetirementSavings'),
    percentageAnnualRaises: document.getElementById('percentageAnnualRaises'),
    expectedRetirementAge: document.getElementById('expectedRetirementAge'),
    expectedRetirementLength: document.getElementById('expectedRetirementLength'),
    percentPreRetirementIncome: document.getElementById('percentPreRetirementIncome'),
    taxReturnBeforeRetirement: document.getElementById('taxReturnBeforeRetirement'),
    taxReturnAfterRetirement: document.getElementById('taxReturnAfterRetirement')
  }

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
  taxReturnAfterRetirement: '' // 0% - 10%
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
        handlers.updateClientPercentPreRetirementIncome();
        handlers.updateClientTaxReturnBeforeRetirement();
        handlers.updateClientTaxReturnAfterRetirement();
        console.log(client);
      }

    });

  },

  updateClientAge: () => {

    client.age = calculator.clientInput.age.value;
    calculator.clientInfo.age.innerText = 'Age: ' + calculator.clientInput.age.value * 2;
  },

  updateClientAnnualIncome: () => {
    client.annualIncome = calculator.clientInput.annualIncome.value;
    calculator.clientInfo.annualIncome.innerText = 'Annual Income: ' + calculator.clientInput.annualIncome.value / 2;

  },

  updateClientCurrentRetirementSavings: () => {
    client.currentRetirementSavings = calculator.clientInput.currentRetirementSavings.value;
    calculator.clientInfo.currentRetirementSavings.innerText = 'Current Retirement Savings: ' + calculator.clientInput.currentRetirementSavings.value;

  },

  updateClientPercentageAnnualRaises: () => {
    client.percentageAnnualRaises = calculator.clientInput.percentageAnnualRaises.value;
    calculator.clientInfo.percentageAnnualRaises.innerText = 'Percentage of Annual Raises: ' + calculator.clientInput.percentageAnnualRaises.value;

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
    calculator.clientInfo.percentPreRetirementIncome.innerText = 'Percentage Pre-Retirement Income: ' + calculator.clientInput.percentPreRetirementIncome.value;


  },

  updateClientTaxReturnBeforeRetirement: () => {
    client.taxReturnBeforeRetirement = calculator.clientInput.taxReturnBeforeRetirement.value;
    calculator.clientInfo.taxReturnBeforeRetirement.innerText = 'Tax Returns Before Retirement: ' + calculator.clientInput.taxReturnBeforeRetirement.value;


  },

  updateClientTaxReturnAfterRetirement: () => {
    client.taxReturnAfterRetirement = calculator.clientInput.taxReturnAfterRetirement.value;
    calculator.clientInfo.taxReturnAfterRetirement.innerText = 'Tax Returns After Retirement: ' + calculator.clientInput.taxReturnAfterRetirement.value;


  }

};


handlers.setupEventListeners(); // Setup event listeners for the form
