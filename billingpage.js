let backupContent = null;
var totalAmount = 0;
var advanceAmount = 0;
var billNumber = "";
var serialNumber = 1;
var showPerUnitPrice = true;
var customerName = "";
var phoneNumber = "";
var changesMade = false;
var username = ""
var password = ""


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
    showBillHistory();
     document.getElementById("accountName").textContent = `Session UserName: ${username}`; 
    
    }
    

// Function to generate a random bill number (you can modify this logic as needed)
function generateBillNumber() {
  billNumber = Math.floor(Math.random() * 1000) + 1;
   document.getElementById("billNumber").textContent = `Bill Number: ` + billNumber; 
 
}

// Function to get the current date in the format: MM/DD/YYYY
function getCurrentDate() {
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const year = now.getFullYear();
  return `${month}/${day}/${year}`;
}

function enterCustomerDetails() {
  document.getElementById("customerDetails").style.display = "block";
}

function submitCustomerDetails() {
  customerName = document.getElementById("customerNameInput").value;
  phoneNumber = document.getElementById("phoneNumberInput").value;

  // Display customer details above summary table
  document.getElementById("customerInfo").textContent = `Customer Name: ${customerName} | Phone Number: ${phoneNumber}`;
 document.getElementById("customerDetails").style.display = "none";
  
  var cashierName = document.getElementById("cashierName").value;
  document.getElementById("cashier").textContent = cashierName;
 
generateBillNumber(); 
 document.getElementById("currentDate").textContent = `Date: ` + getCurrentDate();
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
  } else {
    alert("Please enter valid item details.");
  }
  
}

function addAdvanceAmount() {
  var userAdvance = parseFloat(prompt("Enter Advance Amount:", "0.00"));
  if (!isNaN(userAdvance)) {
    advanceAmount = userAdvance;
    document.getElementById("advanceAmountDisplay").textContent = "(-) Advance Amount: ₹" + advanceAmount.toFixed(2);
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
        totalAmount -= itemPrice * itemQuantity;
        document.getElementById("totalAmount").textContent = "₹" + totalAmount.toFixed(2);
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
  advanceAmount = document.getElementById("advanceAmountDisplay").textContent.replace("Advance Amount: ₹0.00","");
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
     
      const billId = `${customerName}-${billNumber}`;
      const fileName = prompt('Enter bill file name:', billId);
      if (!fileName) return;

      // Set the HTML content and save it as a bill
      const billContent = document.documentElement.outerHTML;
      localStorage.setItem(billId, billContent);

      // Refresh bill history dropdown
      showBillHistory();
    }

function showBillHistory() {
 
      const viewBillHistoryDropdown = document.getElementById('viewBillHistory');
      viewBillHistoryDropdown.innerHTML = '<option value="" disabled selected>View Bill History</option>'; // Clear previous content

      // Retrieve and display bill history from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        viewBillHistoryDropdown.innerHTML += `<option value="${key}">${key}</option>`;
      }

      // Display the bill history dropdown
      viewBillHistoryDropdown.style.display = 'block';
    }

function viewSelectedBill() {
  const viewBillHistoryDropdown = document.getElementById('viewBillHistory');
  const selectedBillKey = viewBillHistoryDropdown.value;
  const printPreviewContent = document.getElementById('printPreviewContent');
  const printPreviewModal = document.getElementById('printPreviewModal');

  if (selectedBillKey) {
    const savedBillContent = localStorage.getItem(selectedBillKey);

    // Populate the print preview content with the saved bill details
    printPreviewContent.innerHTML = savedBillContent;

    // Show the modal overlay to display the hover page
    printPreviewModal.style.display = 'block';
  }
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

function removeBill() {
      const viewBillHistoryDropdown = document.getElementById('viewBillHistory');
      const selectedBillKey = viewBillHistoryDropdown.value;

      if (selectedBillKey) {
        localStorage.removeItem(selectedBillKey);
        // hideDetailedBill();
        showBillHistory();
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
  }, 3000); // 3000 milliseconds = 3 seconds
}

function showLoading() {
  var loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) {
    loadingOverlay.style.display = "flex"; // Show the loading overlay
  }
}
