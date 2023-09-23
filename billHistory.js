function openBillHistory(filename) {

    const billHistoryContent = localStorage.getItem(filename);

    if (billHistoryContent !== null) {
        // Display the retrieved content
        document.getElementById("printPreviewContent").innerHTML = billHistoryContent;
        
         // Show the modal overlay
  var printPreview = document.getElementById("printPreviewModal");
  printPreview.style.display = "block";
  
    } else {
       
        alert("The selected bill is not available in the bill history.");
    }
}

function createAccordionSection(date, bills) {
            const section = document.createElement('div');
            section.classList.add('accordion');

            const header = document.createElement('div');
            header.classList.add('accordion-header');
            header.textContent = date;
            header.addEventListener('click', toggleAccordion);

            const button = document.createElement('span');
            button.classList.add('accordion-button');
            button.textContent = '▶';

            header.appendChild(button);
            section.appendChild(header);

            const content = document.createElement('div');
            content.classList.add('accordion-content');
            content.style.display = 'none';

            bills.forEach(bill => {
                const entry = document.createElement('div');
                entry.classList.add('bill-entry');
                entry.innerHTML = `
                    
                    <div>
                        <strong>${bill.filename}</strong><br>
                        Total Amount: ₹${bill.totalAmount}<br>
                        Payment Status: ${bill.paymentStatus}
                    </div>
                    <div>
                        <button onclick="openBillHistory('${bill.filename}')">Open</button>
                        <button onclick="removeBillHistory('${bill.filename}')">Remove</button>
                    </div>
                `;
                content.appendChild(entry);
            });

            section.appendChild(content);
            return section;
           }
      
function toggleAccordion(event) {
            const content = event.target.nextElementSibling;
            const button = event.target.querySelector('.accordion-button');

            // Get all accordion sections on the page
            const allSections = document.querySelectorAll('.accordion-content');

            // Collapse all sections (hide their content)
            allSections.forEach(section => {
                if (section !== content) {
                    section.style.display = 'none';
                }
            });

            // Toggle the display of the content related to the clicked date section
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
                button.textContent = '▼';
            } else {
                content.style.display = 'none';
                button.textContent = '▶';
            }
        }
        
function displaySavedBillHistory() {

    const billHistoryData = {};

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const billContent = localStorage.getItem(key);

        // Parse the billContent to extract the totalAmount and paymentStatus
        const parser = new DOMParser();
        const doc = parser.parseFromString(billContent, 'text/html');
     //   const totalAmount = parseFloat(doc.getElementById('totalAmount').textContent.trim().replace('₹', ''));
        const totalAmount = doc.getElementById('totalAmount').textContent.trim().replace('₹', '');
        const paymentStatus = getPaymentStatus(key); // You can set this value dynamically

        // Get the date mentioned in the bill content
        const currentDateElement = doc.getElementById('currentDate');
        const dateString = currentDateElement.textContent.trim(); // Assuming it's in a valid date format

        // Create a bill object
        const bill = {
            filename: key, // Set the filename to the key (e.g., 'CustomerName-BillNumber')
            totalAmount: totalAmount,
            paymentStatus: paymentStatus,
            date: dateString, // Store the date from the billContent
        };

        // Check if a date entry with the same date already exists in the billHistoryData object
        if (!billHistoryData[dateString]) {
            billHistoryData[dateString] = [];
        }

        // Add the bill to the corresponding date entry
        billHistoryData[dateString].push(bill);
    }

    // Display the retrieved bill history data in the UI
    const billHistory = document.getElementById('billHistory');

    // Loop through the bill history data and create accordion sections
    for (const dateString in billHistoryData) {
        if (billHistoryData.hasOwnProperty(dateString)) {
            const date = dateString;
            const bills = billHistoryData[dateString];

            const section = createAccordionSection(date, bills);
            billHistory.appendChild(section);
        }
    }
}

function showLoading() {
  var loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) {
    loadingOverlay.style.display = "flex"; // Show the loading overlay
  }
}

function removeBillHistory(filename) {
    if (filename) {
        const removedItem = localStorage.getItem(filename);
        if (removedItem) {
            localStorage.removeItem(filename);

            // Show the delete message popup
            var deleteMessage = document.getElementById("deleteMessage");
            var deleteMessageText = document.getElementById("deleteMessageText");
            deleteMessage.style.display = "block";
            deleteMessageText.textContent = filename + " is deleted successfully.";
            
            // Hide the delete message after 5 seconds
            setTimeout(function () {
                location.reload();
                deleteMessage.style.display = "none";
            }, 2000);
        } else {
            alert(filename + " is not available in the bill history.");
        }
    }
}

function closePopup() {
    var deleteMessage = document.getElementById("deleteMessage");
    deleteMessage.style.display = "none";
}

function closePrintPreview() {
  var printPreviewModal = document.getElementById("printPreviewModal");
  printPreviewModal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
displaySavedBillHistory();
   });

function getPaymentStatusFromFilename(filename) {
    
    var fileContent = localStorage.getItem(filename);
    
    // Extract the payment status from the filename
    var paymentStatus = extractPaymentStatus(fileContent);

    // Update the payment status in the HTML
    var paymentStatusElement = document.querySelector(".payment-status");
    if (paymentStatusElement) {
        paymentStatusElement.textContent = paymentStatus;
    }

    // Show or hide buttons based on payment status
    if (paymentStatus === "Paid") {
        document.querySelector(".paid-seal-image").style.display = "block";
    } else {
        document.getElementById("markPaidButton").style.display = "block";
        document.getElementById("doneButton").style.display = "block";
    }
}

// Function to extract payment status from the filename
function extractPaymentStatus(fileContent) {
    
    if (fileContent.includes("Paid</span></p>")) {
        return "Paid";
    } else {
        return "Pending";
    }
}

function markPaid() {
    document.querySelector(".payment-status").textContent = "Paid";
     document.getElementById("markPaidButton").style.display = "none";
    
}

function saveUpdatedBill(fileName) {

    const newfileName = fileName; // Use a predefined or generated filename
    
    const billContent = document.getElementById('printPreviewContent').innerHTML;
    
    localStorage.setItem(newfileName, billContent);

    closePrintPreview();
}

function getPaymentStatus(filename) {
    var fileContent = localStorage.getItem(filename);
    
    // Extract the payment status from the file content
    var paymentStatus = extractPaymentStatus(fileContent);

    // Update the payment status in the HTML
    var paymentStatusElement = document.querySelector(".payment-status");
    if (paymentStatusElement) {
        paymentStatusElement.textContent = paymentStatus;
    }

    // Return the extracted payment status
    return paymentStatus;
}

function refreshPage() {
  showLoading();
  setTimeout(function() {
    var currentUrl = window.location.href;
    window.location.href = currentUrl;
  }, 2000); 
    
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

function navigateToLogout() {
  showLoading();
  setTimeout(function() {
    window.location.href = "index.html"; // 
  }, 2000); 
}

function navigateTobillingPage() {
  showLoading();
  setTimeout(function() {
   window.history.back()
    //window.location.href = "billingPage.html"; 
  }, 2000); 
}

function clearAllBillHistory() {
    // Ask the user for confirmation
    var confirmation = confirm("Are you sure you want to delete all bill history? This action cannot be undone.");

    if (confirmation) {
        // User clicked "OK," so proceed with deletion
        localStorage.clear();

        // Show a message indicating success
        var deleteMessage = document.getElementById("deleteMessage");
        var deleteMessageText = document.getElementById("deleteMessageText");
        deleteMessage.style.display = "block";
        deleteMessageText.textContent = "All bill history has been successfully deleted.";

        setTimeout(function () {
            location.reload();
            deleteMessage.style.display = "none";
        }, 5000);
    } else {
        // User clicked "Cancel," so do nothing
    }
}
