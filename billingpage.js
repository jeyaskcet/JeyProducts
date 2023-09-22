let backupContent = null;
var totalAmount = 0;
var advanceAmount = 0;
var billNumber = "";
var serialNumber = 1;
var showPerUnitPrice = true;
var customerName = "";
var phoneNumber = "";
var changesMade = false;
var username = "";
var password = "";
var timeStamp = "";
let paymentStatus = 'Pending';
var weekday = "";


const items = [
      { name: "Item 1", price: 10, quantity: 1 },
      { name: "Item 2", price: 15, quantity: 1 },
      { name: "Item 3", price: 20, quantity: 1 },
      { name: "Item 4", price: 25, quantity: 1 },
      { name: "Item 5", price: 30, quantity: 1 },
      { name: "Item 6", price: 35, quantity: 1 },
      { name: "Item 7", price: 40, quantity: 1 },
      { name: "Item 8", price: 45, quantity: 1 },
      { name: "Item 9", price: 50, quantity: 1 },
      { name: "Item 10", price: 100, quantity: 1 },
      // Add more items as needed
    ];
    
    
document.addEventListener("DOMContentLoaded", function() {
showSavedBillHistory();
   });

// Function to prompt the user to save the current bill
function promptToSave() {
  const shouldSave = window.confirm('Do you want to save your changes before refreshing?');
  if (shouldSave) {
     // Call your saveBill function
     saveBill();
  } else {
   
   // Leave this since Regresh page function will handle this part
  }
}

function refreshPage() {

     promptToSave()
  
    // Preserve the current URL (home page)
    var currentUrl = window.location.href;

    // Reload the current URL
    window.location.href = currentUrl;
            
        }

function showLoggedInContent() {

    // Retrieve the HTML code from the script tag
    const billingPageHtmlCode = document.getElementById('BillingPageHtmlCode').innerHTML;
    
    document.body.innerHTML = billingPageHtmlCode;
    
     // Initial population of bill history dropdown
    showSavedBillHistory();
     document.getElementById("accountName").textContent = `Session UserName: ${username}`; 
    
    }
    

// Function to generate a random bill number (you can modify this logic as needed)
function generateBillNumber() {
  billNumber = Math.floor(Math.random() * 1000) + 1;
   return billNumber; 
 
}

// Function to get the current date in the format: DD/MM/YYYY
function getCurrentDate() {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

function getWeekdayFromDate(dateString) {
  const parts = dateString.split('/');
  if (parts.length !== 3) {
    return 'Invalid date format';
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-based (0 = January, 11 = December)
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return 'Invalid date';
  }

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dateObj = new Date(year, month, day);
  const weekday = weekdays[dateObj.getDay()];

  return weekday;
}

function enterCustomerDetails() {
    const customerDetails = document.getElementById("customerDetails");
    
    // Toggle the display property between 'block' and 'none'
    if (customerDetails.style.display === "none" || customerDetails.style.display === "") {
        customerDetails.style.display = "block";
    } else {
        customerDetails.style.display = "none";
    }
}


function submitCustomerDetails() {

    const customerName = document.getElementById("customerNameInput").value;
    const phoneNumber = document.getElementById("phoneNumberInput").value;
    
    const cashierName = document.getElementById("cashierName").value;
   
    const billNumber = generateBillNumber();
    
    const currentDate = getCurrentDate() + ' (' + getWeekdayFromDate(getCurrentDate()) + ')';
    
    const timeStamp = generateTimeStamp();
    
    if (!customerName) {
       
        // Display a popup with a message
        alert("Please enter the customer name to proceed.");
        return; // Stop further processing
    } 
   document.getElementById("customerDetails").style.display = "none";

const billNumberSpan = document.getElementById("billNumber");
const currentDateSpan = document.getElementById("currentDate");
const timeStampSpan = document.getElementById("timeStamp");
const customerNameSpan = document.getElementById("customerName");
const phoneNumberSpan = document.getElementById("phoneNumber");
const cashierSpan = document.getElementById("cashierName");

// Update the content of the spans with dynamic values
billNumberSpan.textContent = billNumber;
currentDateSpan.textContent = currentDate;
timeStampSpan.textContent = timeStamp;
customerNameSpan.textContent = customerName;
phoneNumberSpan.textContent = phoneNumber;
cashierSpan.textContent = cashierName;

}

function generateTimeStamp() {

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;

    const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${meridiem}`;
    
    return formattedTime;
}


function addItem() {
  var itemName = document.getElementById("itemName").value;
  var itemQuantity = parseInt(document.getElementById("itemQuantity").value);
    var itemPrice = parseFloat(document.getElementById("itemPrice").value);

  if (itemName && !isNaN(itemQuantity) && !isNaN(itemPrice)) {
    var table = document.getElementById("itemTable");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    
    var perUnitPrice = itemPrice / itemQuantity;

    cell1.innerHTML = serialNumber;
    cell2.innerHTML = itemName;
    cell3.innerHTML = itemQuantity;
    cell4.innerHTML = showPerUnitPrice ? "₹" + perUnitPrice.toFixed(2) : "";
    cell5.innerHTML = "₹" + itemPrice.toFixed(2);

    serialNumber++;
    document.getElementById("itemName").value = "";
    document.getElementById("itemQuantity").value = "";
    document.getElementById("itemPrice").value = "";
    
    calculateTotal();
  } else {
    alert("Please enter valid item details.");
  }
  
}

function addAdvanceAmount() {
  var userAdvance = parseFloat(prompt("Enter Advance Amount:", "0"));
  if (!isNaN(userAdvance)) {
    advanceAmount = userAdvance;
    document.getElementById("advanceAmountDisplay").textContent = "₹" + advanceAmount.toFixed(2);
    
    calculateTotal();
  }
  
}

function togglePerUnitPrice() {
  showPerUnitPrice = document.getElementById("showPerUnitPrice").checked;
  document.getElementById("perUnitPriceHeader").style.display = showPerUnitPrice ? "table-cell" : "none";
  var perUnitPriceCells = document.querySelectorAll("#itemTable td:nth-child(4)");
  perUnitPriceCells.forEach(cell => {
    cell.style.display = showPerUnitPrice ? "table-cell" : "none";
  });
}

function removeItem() {
  var serialToRemove = parseInt(prompt("Enter Serial Number of the item to remove:"));
  if (!isNaN(serialToRemove)) {
    var table = document.getElementById("itemTable");
    var rows = table.getElementsByTagName("tr");
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      var serialCell = row.cells[0];
      var itemPriceCell = row.cells[4];
      var itemQuantity = parseInt(row.cells[2].innerHTML);
      var itemPrice = parseFloat(itemPriceCell.innerHTML.replace("$", ""));
      
      if (parseInt(serialCell.innerHTML) === serialToRemove) {
       // totalAmount -= itemPrice * itemQuantity;
        //document.getElementById("totalAmount").textContent = "₹" + totalAmount.toFixed(2);
        row.parentNode.removeChild(row);
        break;
      }
    }

    // Renumber the serial numbers
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      var serialCell = row.cells[0];
      serialCell.innerHTML = i;
    }
    calculateTotal();
    
  } else {
    alert("Please enter a valid serial number.");
  }
  
}

function calculateTotal() {
  totalAmount = 0;
  var rows = document.querySelectorAll("#itemTable tr");
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var itemPrice = parseFloat(row.cells[4].innerHTML.replace("₹", ""));
    totalAmount += itemPrice;
  }
 // advanceAmount = document.getElementById("advanceAmountDisplay").textContent.replace("Advance Amount: ₹0.00","");
  totalAmount -= advanceAmount;
  document.getElementById("totalAmount").textContent = "₹" + totalAmount.toFixed(2);
}

function printSummary() {

  var printContents = document.querySelector(".container").innerHTML;
  var originalContents = document.body.innerHTML;

  // Add footer description
  var footerDescription = "<p>Thank you for shopping at Grocery Store!</p>";

  document.body.innerHTML = printContents + footerDescription;

  window.print();

  document.body.innerHTML = originalContents;
}

function saveAsPDF() {
  var printContents = document.querySelector(".container").innerHTML;

  // Create a new PDF document
  var doc = new jsPDF();
  
  // Add content to the PDF
  doc.html(printContents, {
    callback: function () {
      // Save the PDF
      if (typeof window.orientation !== "undefined") {
        // Mobile device
        var pdfBlob = doc.output("blob");
        var pdfUrl = URL.createObjectURL(pdfBlob);
        var a = document.createElement("a");
        a.style.display = "none";
        a.href = pdfUrl;
        a.download = "grocery_bill.pdf";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(pdfUrl);
      } else {
        // Desktop/laptop device
        doc.save("grocery_bill.pdf");
      }
    }
  });
}

function saveBill() {

    const customerName = document.getElementById('customerNameInput').value;
    const billNumberText = document.getElementById('billNumber').textContent;

const billNumber = parseInt(billNumberText.replace("Bill Number:", "").trim(), 10);

    if (!customerName || !billNumber) {
        // Prompt the user to enter customer details
        alert('Please enter customer details before saving the bill.');
        return;
    }
     
      const billId = `${customerName}-${billNumber}`;
      const fileName = prompt('Enter bill file name:', billId);
      
      if (!fileName) return;

      // Set the HTML content and save it as a bill
      
      //const billContent = document.documentElement.outerHTML;
      const billContent = document.getElementById('printableDetails').innerHTML;
      localStorage.setItem(billId, billContent);
      
      // Set the payment status to "Saved"
    const billStatusElement = document.getElementById('billStatus');
    billStatusElement.value = "Saved";

}
    
function saveDoneBillHistory() {

    const customerName = document.getElementById('customerNameInput').value;
    const billNumberText = document.getElementById('billNumber').textContent;
    const billNumber = parseInt(billNumberText.replace("Bill Number:", "").trim(), 10);

    if (!customerName || !billNumber) {
        alert('Please enter customer details before saving the bill.');
        return;
    }

const paymentPrintPreviewStatusElement = document.querySelector('.payment-status');
var paymentStatus = paymentPrintPreviewStatusElement.textContent;

const billStatusElement = document.getElementById('billStatus');
billStatusElement.value = paymentStatus;

    const billId = `${customerName}-${billNumber}`;
    const fileName = `${billId}`; // Use a predefined or generated filename
    const billContent = document.getElementById('printableDetails').innerHTML + document.getElementById('printPreviewFooter').innerHTML;
    
    localStorage.setItem(fileName, billContent);

    closePrintPreview();
}

function showSavedBillHistory() {

    const viewBillHistoryDropdown = document.getElementById('viewSavedBills');
    viewBillHistoryDropdown.innerHTML = '<option value="" disabled selected>View Saved Bills</option>'; // Clear previous content

    // Retrieve and display bill history from localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);

        // Retrieve the bill content from localStorage
        const billContent = localStorage.getItem(key);

const billStatusIdentifier = 'value="Saved"'; 

if (billContent && billContent.includes(billStatusIdentifier)) {
   
            viewBillHistoryDropdown.innerHTML += `<option value="${key}">${key}</option>`;
        }
    }

    // Display the bill history dropdown
    viewBillHistoryDropdown.style.display = 'block';
}


function viewSelectedSavedBills() {
  const viewBillHistoryDropdown = document.getElementById('viewSavedBills');
  const selectedBillKey = viewBillHistoryDropdown.value;
  const billHistoryContent = document.getElementById('savedBillsContent');
  
  if (selectedBillKey) {
    const savedBillContent = localStorage.getItem(selectedBillKey);

    // Populate the print preview content with the saved bill details
    billHistoryContent.innerHTML = savedBillContent;

    // Show the modal overlay to display the hover page
    const billHistoryModal = document.getElementById('savedBillsModal');
    
    billHistoryModal.style.display = 'block';
  }
}

function closeViewSavedBills() {
  var billHistoryModal = document.getElementById("savedBillsModal");
  billHistoryModal.style.display = "none";
}

function editSavedBills() {

closeViewSavedBills();

  // Get the content of savedBillsContent
  const savedBillsContent = document.getElementById('savedBillsContent').cloneNode(true);

  // Get the printableDetails element within billingpage.html (assuming it has an ID)
  const printableDetails = document.getElementById('printableDetails');

  // Clear the existing content of printableDetails
  printableDetails.innerHTML = '';

  // Append the content of savedBillsContent to printableDetails
   printableDetails.appendChild(savedBillsContent);

  
}

function viewSelectedBill_old() {
  const viewBillHistoryDropdown = document.getElementById('viewBillHistory');
  const selectedBillKey = viewBillHistoryDropdown.value;
  const detailedBillContent = document.getElementById('detailedBillContent');
  const detailedBill = document.getElementById('detailedBill');
  const backupContent = document.getElementById('backupContent');

  if (selectedBillKey) {
    // Backup the current content only if it hasn't been backed up yet
    if (!backupContent.hasAttribute('data-backup')) {
      backupContent.innerHTML = document.documentElement.outerHTML;
      backupContent.setAttribute('data-backup', 'true');
    }

    // Update the current content with the selected bill
    detailedBill.innerHTML = localStorage.getItem(selectedBillKey);
    detailedBillContent.style.display = 'block';
  } else {
    // Restore the original content if no bill is selected
    backupContent.removeAttribute('data-backup');
    detailedBillContent.style.display = 'none';
  }
}


function hideDetailedBill() {
      const backupContent = document.getElementById('backupContent');
      const detailedBillContent = document.getElementById('detailedBillContent');
      detailedBillContent.style.display = 'none';

      // Restore the previous content from backup
      if (backupContent.innerHTML) {
        document.documentElement.innerHTML = backupContent.innerHTML;
      } else {
        // Show the first screen (home page)
        showBillHistory();
      }
    }

function removeSavedBill() {
      const viewBillHistoryDropdown = document.getElementById('viewSavedBills');
      const selectedBillKey = viewBillHistoryDropdown.value;

      if (selectedBillKey) {
        localStorage.removeItem(selectedBillKey);
        // hideDetailedBill();
        showSavedBillHistory();
        closeViewSavedBills();
      }
    }

function showPrintPreview() {
  var currentBillContent = document.getElementById("printableDetails").innerHTML;
  var printPreviewContent = document.getElementById("printPreviewContent");

  // Set the content of the print preview
  printPreviewContent.innerHTML = "<h2>Current Bill Preview</h2>" + currentBillContent;

  // Show the modal overlay
  var printPreviewModal = document.getElementById("printPreviewModal");
  printPreviewModal.style.display = "block";
}

function closePrintPreview() {
  var printPreviewModal = document.getElementById("printPreviewModal");
  printPreviewModal.style.display = "none";
}

function printHoverPage_old() {
  var printPreviewContent = document.getElementById("printPreviewContent").innerHTML;
  var printWindow = window.open("", "Print Preview", "width=800,height=600");
  
  // Create the print content with header, content, and footer
  var printContent = `
    <html>
    <head>
      <title>Print Preview</title>
      <style>
        /* Add your existing CSS styles here */
        .print-header, .print-footer {
          text-align: center;
          margin: 10px 0;
        }
        .print-footer {
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="print-header">
        <h2>Random Shop Name</h2>
        <p>Shop Address</p>
      </div>
      ${printPreviewContent}
      <div class="print-footer">
        <p>Thank you for shopping at Random Shop!</p>
      </div>
    </body>
    </html>
  `;

  // Display the print content in the print preview window
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
}

function printHoverPage() {
  var printPreviewContent = document.getElementById("printPreviewContent").innerHTML;
  
  // Create a hidden element to hold the print content
  var printContainer = document.createElement("div");
  printContainer.style.display = "none";
  printContainer.innerHTML = `
    <style>
      /* Add your existing CSS styles here */
      .print-header, .print-footer {
        text-align: center;
        margin: 10px 0;
      }
      .print-footer {
        font-style: italic;
      }
    </style>
    <div class="print-header">
      <h2>Random Shop Name</h2>
      <p>Shop Address</p>
    </div>
    ${printPreviewContent}
    <div class="print-footer">
      <p>Thank you for shopping at Random Shop!</p>
    </div>
  `;

  // Append the hidden element to the document body
  document.body.appendChild(printContainer);

  // Print the hidden element's content
  window.print();

  // Remove the hidden element after printing
  document.body.removeChild(printContainer);
}


function onRefreshClick() {
            if (changesMade) {
                showSaveChangesDialog();
            } else {
                loadHomePageAfterRefresh();
            }
        }

function navigateToHome() {
  showLoading();
  setTimeout(function() {
    window.location.href = "home.html"; // Replace with the actual home page URL
  }, 3000); // 3000 milliseconds = 3 seconds
}

function navigateToLogout() {
  showLoading();
  setTimeout(function() {
    window.location.href = "index.html"; // Replace with the actual logout page URL
  }, 2000); // 3000 milliseconds = 3 seconds
}
function navigateTobillHistoryPage() {
  showLoading();
  setTimeout(function() {
    window.location.href = "billHistory.html"; // Replace with the actual logout page URL
  }, 2000); // 3000 milliseconds = 3 seconds
}

function showLoading() {
  var loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) {
    loadingOverlay.style.display = "flex"; // Show the loading overlay
  }
}

function markPaid() {
    
    if (paymentStatus === 'Paid') {
        return;
    }

    paymentStatus = 'Paid';

    const paidSealImage = document.querySelector('.paid-seal-image');
    paidSealImage.style.display = 'block';

    const markPaidButton = document.querySelector('.mark-paid-button');
    markPaidButton.style.display = 'none';

    const paymentStatusElement = document.querySelector('.payment-status');
    paymentStatusElement.textContent = paymentStatus;
    paymentStatusElement.style.color = 'green'; 
    paymentStatusElement.style.fontweight = 'bold'; 
    
    paymentStatusElement.value = "Paid";
}


function editSavedBills_new() {
  const ViewPageContent = document.getElementById('printableDetails');
  const savedBillsContent = document.getElementById('savedBillsContent');
  
  // Create an iframe element
  const iframe = document.createElement('iframe');
  
  // Set the source URL to load into the iframe
  iframe.src = 'billingpage.html';
  
  // Define an onload event handler for the iframe
  iframe.onload = function () {
    // Append the content of the savedBillsContent element
    iframe.contentDocument.body.appendChild(savedBillsContent.cloneNode(true));
  };
  
  // Clear previous content and append the iframe to the ViewPageContent element
  ViewPageContent.innerHTML = '';
  ViewPageContent.appendChild(iframe);
}

function suggestItem() {

  const itemNameInput = document.getElementById("itemName");
  const suggestionContainer = document.getElementById("suggestionContainer");

  suggestionContainer.innerHTML = "";

  const userInput = itemNameInput.value.trim().toLowerCase(); // Trim and convert to lowercase

  if (userInput !== "") { // Check if userInput is not empty
    const matchingItems = items.filter((item) =>
      item.name.toLowerCase().includes(userInput)
    );

    matchingItems.forEach((item) => {
      const suggestion = document.createElement("div");
      suggestion.classList.add("suggestion");
      suggestion.textContent = item.name;

      suggestion.addEventListener("click", () => selectSuggestion(item));

      suggestionContainer.appendChild(suggestion);
    });
  }
}

function selectSuggestion(item) {
      const itemNameInput = document.getElementById("itemName");
      const itemQuantityInput = document.getElementById("itemQuantity");
      const itemPriceInput = document.getElementById("itemPrice");

      itemNameInput.value = item.name;
      itemQuantityInput.value = item.quantity;
      itemPriceInput.value = item.price;
    
  suggestionContainer.innerHTML = "";
  
  //itemPriceInput.focus();
 // itemQuantityInput.focus();
 
}
