var totalAmount = 0;
var advanceAmount = 0;
var billNumber = new Date().getTime();
var serialNumber = 1;
var showPerUnitPrice = true;
var customerName = "";
var phoneNumber = "";

// Function to generate a random bill number (you can modify this logic as needed)
function generateBillNumber() {
  return Math.floor(Math.random() * 1000000) + 1;
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

  totalAmount -= advanceAmount;
  document.getElementById("totalAmount").textContent = "₹" + totalAmount.toFixed(2);
}

function printSummary() {
  var cashierName = document.getElementById("cashierName").value;
  document.getElementById("cashier").textContent = cashierName;

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
