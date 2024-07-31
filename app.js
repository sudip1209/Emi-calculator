document.addEventListener("DOMContentLoaded", () => {
  // Select the input elements and the corresponding display elements
  const loanAmountInput = document.querySelector("#loan-amount");
  const loanAmountRange = document.querySelector("#amount");
  const interestRateInput = document.querySelector("#interest-rate");
  const interestRateRange = document.querySelector("#roi");
  const loanPeriodInput = document.querySelector("#loan-period");
  const loanPeriodRange = document.querySelector("#loan-period-range");

  // Function to sync input and range values
  const syncValues = (inputElement, rangeElement) => {
    inputElement.value = rangeElement.value;
  };

  // Initial synchronization of input values
  syncValues(loanAmountInput, loanAmountRange);
  syncValues(interestRateInput, interestRateRange);
  syncValues(loanPeriodInput, loanPeriodRange);

  // Event listeners to update the input and range values when they change
  loanAmountRange.addEventListener("input", () =>
    syncValues(loanAmountInput, loanAmountRange)
  );
  interestRateRange.addEventListener("input", () =>
    syncValues(interestRateInput, interestRateRange)
  );
  loanPeriodRange.addEventListener("input", () =>
    syncValues(loanPeriodInput, loanPeriodRange)
  );
});

// toggle button
const toggleButton = document.querySelector("#toggleButton");
const dataContainer = document.querySelector(".dataContainer");
const paymentTypeContainer = document.querySelector(".payment-type");
const header = document.querySelector(".section-hero--subcontent");
const loanAmountContainer = document.querySelector(".loan-amount-container");
const loanAmountRangeContainer = document.querySelector(
  ".loan-amount-range-container"
);

toggleButton.addEventListener("change", () => {
  if (toggleButton.checked) {
    // Toggle is on
    header.style.marginBottom = "2rem";
    dataContainer.style.display = "block";
    paymentTypeContainer.style.display = "block";
    loanAmountContainer.style.display = "none"; // Hide loan amount container
    loanAmountRangeContainer.style.display = "none"; // Hide loan amount range container
    dataContainer.innerHTML = `
      <select
        class="form-select"
        id="login__type"
        aria-label="Floating label select example"
        required
      >
      <option value=''>--Select Years--</option>
        <option value="1">1 Year</option>
        <option value="2">2 Years</option>
        <option value="3">3 Years</option>
        <option value="4">4 Years</option>
        <option value="5">5 Years</option>
      </select>
    `;
    attachSelectEventListener(); // Attach event listener to the newly created select element
  } else {
    // Toggle is off
    dataContainer.innerHTML = ""; // Clear content
    dataContainer.style.display = "none"; // Hide container
    paymentTypeContainer.innerHTML = ""; // Clear payment-type content
    paymentTypeContainer.style.display = "none"; // Hide payment-type container
    loanAmountContainer.style.display = "flex"; // Show loan amount container
    loanAmountRangeContainer.style.display = "block"; // Show loan amount range container
    paymentTypeContainer.style.backgroundColor = "";
  }
});

// Function to handle the addition of event listener to the dynamically created select element
let noOfSem; // Global variable for number of semesters
let moratoriumTime; // Global variable for moratorium time

function attachSelectEventListener() {
  const selectElement = document.getElementById("login__type");
  if (selectElement) {
    selectElement.addEventListener("change", () => {
      const selectedValue = selectElement.value;
      noOfSem = selectedValue * 2; // Update the global variable
      console.log("Number of Semesters:", noOfSem);
      sem(noOfSem);
    });
  }
}

function moratorium() {
  const selectElement = document.getElementById("month__type");
  if (selectElement) {
    selectElement.addEventListener("change", () => {
      moratoriumTime = selectElement.value;
      //   console.log("Selected months:", moratoriumTime);
    });
  }
}
moratorium();

// function for putting sem in html
function sem(n) {
  const semAmount = document.querySelector(".payment-type");
  semAmount.style.display = "block";
  // Clear existing content
  semAmount.innerHTML = "";

  // Loop to create and append the amount containers
  for (let i = 0; i < n; i++) {
    semAmount.innerHTML += `
      <div class="section-hero--subcontent data-input amount-container">
        <label for="loan-amount-${i}">Loan required in semester ${i + 1}</label>
        <div class="input-container">
          <span class="symbol">₹</span>
          <input type="number" class="loan-amount-input" id="loan-amount-${i}" value="0" />
        </div>
      </div>
      <div class="range-container">
        <input
          type="range"
          id="amount-${i}"
          name="amount-${i}"
          step="100"
          min="0"
          max="5000000"
          value="0"
        />
      </div>
    `;
  }

  // Attach event listeners to the dynamically created input and range elements
  for (let i = 0; i < n; i++) {
    const loanAmountInput = document.querySelector(`#loan-amount-${i}`);
    const loanAmountRange = document.querySelector(`#amount-${i}`);
    paymentTypeContainer.style.backgroundColor = "#e4effe";
    // Function to sync input and range values
    const syncValues = (inputElement, rangeElement) => {
      inputElement.value = rangeElement.value;
    };
    const syncValuesReverse = (rangeElement, inputElement) => {
      rangeElement.value = inputElement.value;
    };
    loanAmountRange.addEventListener("input", () =>
      syncValues(loanAmountInput, loanAmountRange)
    );
    loanAmountInput.addEventListener("input", () =>
      syncValuesReverse(loanAmountRange, loanAmountInput)
    );
  }
}

const repaymentScheduleContainer = document.querySelector(
  "#repayment-schedule"
);
/// Repayment Schedule
// Function to calculate repayment schedule
// Function to calculate repayment schedule
function calculateRepaymentSchedule(
  principal,
  annualInterestRate,
  loanPeriodInYears
) {
  const monthlyInterestRate = annualInterestRate / (12 * 100); // Convert annual interest rate to monthly interest rate
  const numberOfInstallments = loanPeriodInYears * 12; // Convert loan period in years to number of monthly installments

  // Calculate EMI
  const emi =
    (principal *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, numberOfInstallments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfInstallments) - 1);

  let outstandingPrincipal = principal;
  const repaymentSchedule = [];

  for (let month = 1; month <= numberOfInstallments; month++) {
    const interestPortion = outstandingPrincipal * monthlyInterestRate;
    const principalPortion = emi - interestPortion;
    outstandingPrincipal -= principalPortion;

    repaymentSchedule.push({
      month,
      emi: Math.round(emi),
      interestPortion: Math.round(interestPortion),
      principalPortion: Math.round(principalPortion),
      loanOutstanding: Math.round(outstandingPrincipal),
    });
  }

  return repaymentSchedule;
}

// Function to render the repayment schedule table
function renderRepaymentSchedule(schedule) {
  repaymentScheduleContainer.innerHTML = `
      <table class="container">
        <thead>
          <tr>
            <th>#</th>
            <th>EMI</th>
            <th>Interest portion</th>
            <th>Principal portion</th>
            <th>Loan Outstanding</th>
          </tr>
        </thead>
        <tbody>
          ${schedule
            .map(
              (entry) => `
            <tr>
              <td>${entry.month}</td>
              <td>${entry.emi}</td>
              <td>${entry.interestPortion}</td>
              <td>${entry.principalPortion}</td>
              <td>${entry.loanOutstanding}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  document.getElementById("download-button").classList.remove("hidden");
}
//   ******************`EMI download`******************

// Function to convert table data to CSV
function tableToCSV(table) {
  const rows = table.querySelectorAll("tr");
  const csv = [];

  rows.forEach((row) => {
    const cols = row.querySelectorAll("td, th");
    const rowData = Array.from(cols)
      .map((col) => col.innerText)
      .join(",");
    csv.push(rowData);
  });

  return csv.join("\n");
}

// Function to trigger the CSV download
function downloadCSV(csv, filename) {
  const csvFile = new Blob([csv], { type: "text/csv" });
  const downloadLink = document.createElement("a");

  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

//   ******************`EMI download`******************

//   ******************`EMI Calculation `******************

let loanAmounts = [];
let interestValues = [];
document.getElementById("calculate-button").addEventListener("click", () => {
  loanAmounts = [];
  interestValues = [];
  document.getElementById("error-message").innerText = "";
  document.getElementById("error-message").classList.add("hidden");
  const loanAmountInputs = document.querySelectorAll(".loan-amount-input");
  const loanPeriod = parseInt(document.getElementById("loan-period").value);
  const interestRate = parseFloat(
    document.getElementById("interest-rate").value
  );
  const oneYearAmount = parseInt(document.getElementById("loan-amount").value);

  // Input validation
  if (
    isNaN(loanPeriod) ||
    loanPeriod <= 0 ||
    isNaN(interestRate) ||
    interestRate <= 0 ||
    (isNaN(oneYearAmount) && loanAmountInputs.length === 0) ||
    isNaN(moratoriumTime)
  ) {
    displayErrorMessage("Please enter a valid input.");
    return;
  }
  if (oneYearAmount > 0) {
    calculateEMIForOneYear(oneYearAmount, interestRate, loanPeriod);
    console.log("One Year Amount:", oneYearAmount);
    return;
  }

  loanAmountInputs.forEach((input) => {
    const amount = parseFloat(input.value);
    if (!isNaN(amount) && amount > 0) {
      loanAmounts.push(amount);
    } else {
      displayErrorMessage("Please enter valid loan amounts.");
      return;
    }
  });

  calculateEMI(loanAmounts, interestRate, loanPeriod);
});

// Function to display error message
function displayErrorMessage(message) {
  document.getElementById("error-message").classList.remove("hidden");
  document.getElementById("error-message").innerText = message;
}

//************* emi for one year *************//

const calculateEMIForOneYear = (oneYearAmount, interestRate, loanPeriod) => {
  const Mtime = parseFloat(moratoriumTime);
  const ontYearInterest = (oneYearAmount * 1 * interestRate) / 100;

  const mod = Math.round(
    ((ontYearInterest + oneYearAmount) * Mtime * interestRate) / (100 * 12)
  );
  const totalAmount = Math.round(oneYearAmount + mod);
  //   monthly(totalAmount, interestRate, loanPeriod, tenureInMonths);

  const tenureInMonths = loanPeriod * 12;
  console.log("Total Loan Amount After Moratorium: ₹", totalAmount);
  console.log("interest: ₹", ontYearInterest);
  console.log("interest rate : ₹", interestRate);
  console.log("tenure in month: ₹", tenureInMonths);
  console.log("EMI: ₹", monthly(totalAmount, interestRate, tenureInMonths));
  const schedule = calculateRepaymentSchedule(
    totalAmount,
    interestRate,
    loanPeriod
  );
  renderRepaymentSchedule(schedule);

  let emi = monthly(totalAmount, interestRate, tenureInMonths);
  console.log("EMI: ₹", emi);

  document.getElementById("loan-amount-result").innerHTML = `₹ ${totalAmount}`;

  document.getElementById("total-interest-result").innerHTML = `₹ ${
    emi * tenureInMonths - totalAmount
  }`;

  document.getElementById("total-payment-result").innerHTML = `₹ ${
    emi * tenureInMonths
  }`;

  document.getElementById("emi-result").innerHTML = `₹ ${emi}`;
};

// Function to calculate EMI

const calculateEMI = (loanAmounts, interestRate, loanPeriod) => {
  const Mtime = parseFloat(moratoriumTime);
  const courseDurationMonths = noOfSem / 2;

  loanAmounts.forEach((loanAmount, index) => {
    const duration = courseDurationMonths - index * 0.5;
    const interest = (loanAmount * duration * interestRate) / 100;
    interestValues.push(interest);
    console.log(
      `Loan Amount: ₹${loanAmount}, Duration: ${duration} month, Interest: ₹${interest}`
    );
  });

  sum(loanAmounts);
  console.log("Total Loan Amount: ₹", sum(loanAmounts));

  const totalInterest =
    Math.round(sum(interestValues)) + Math.round(sum(loanAmounts));
  console.log("Total Loan Interest: ₹", totalInterest);
  const mod = Math.round((totalInterest * Mtime * interestRate) / (100 * 12));
  const totalAmount = Math.round(sum(loanAmounts) + sum(interestValues) + mod);
  console.log("Total Loan Amount In Moratorium: ₹", mod);

  console.log("Total Loan Amount After Moratorium: ₹", totalAmount);
  const tenureInMonths = loanPeriod * 12;
  //   monthly(totalAmount, interestRate, loanPeriod, tenureInMonths);

  console.log("EMI: ₹", monthly(totalAmount, interestRate, tenureInMonths));
  const schedule = calculateRepaymentSchedule(
    totalAmount,
    interestRate,
    loanPeriod
  );
  renderRepaymentSchedule(schedule);

  let emi = monthly(totalAmount, interestRate, tenureInMonths);

  document.getElementById("loan-amount-result").innerHTML = `₹ ${totalAmount}`;

  document.getElementById("total-interest-result").innerHTML = `₹ ${
    emi * tenureInMonths - totalAmount
  }`;

  document.getElementById("total-payment-result").innerHTML = `₹ ${
    emi * tenureInMonths
  }`;

  document.getElementById("emi-result").innerHTML = `₹ ${emi}`;

  // {
  //   alert("Enter valid details");
  //   return;
  // }
};

const sum = (arr) => {
  let sum = 0;
  arr.forEach((i) => {
    sum += i;
  });
  return Math.round(sum);
};

const monthly = function (principal, annualInterestRate, tenureInMonths) {
  // Convert annual interest rate to a monthly interest rate
  const monthlyInterestRate = annualInterestRate / (12 * 100);

  // EMI formula
  const emi =
    (principal *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, tenureInMonths)) /
    (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);

  return Math.round(emi);
};

// repayment schedule download

// Event listener for the download button
document.getElementById("download-button").addEventListener("click", () => {
  const table = document.querySelector("#repayment-schedule table");
  if (table) {
    const csv = tableToCSV(table);
    downloadCSV(csv, "repayment_schedule.csv");
  } else {
    alert("No data available to download.");
  }
});
