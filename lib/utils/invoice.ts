import { Order } from "@/types";
import { formatPrice } from "@/lib/utils/currency";

/**
 * Generates and downloads or opens a printable luxury GST Tax Invoice document
 */
export function downloadOrderInvoicePDF(order: Order) {
  if (!order) return;

  const taxableAmount = Math.round(order.subtotal / 1.18);
  const totalTax = order.subtotal - taxableAmount;
  const cgst = Math.round(totalTax / 2);
  const sgst = totalTax - cgst;
  const invoiceNumber = `INV-${order.orderNumber}`;
  const invoiceDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    dateStyle: "long",
  });

  const itemsRows = order.items
    .map(
      (item, idx) => `
    <tr>
      <td style="text-align: center;">${idx + 1}</td>
      <td>
        <strong>${item.productName}</strong><br/>
        <small style="color: #666;">
          Category: ${item.category.toUpperCase()} | HSN: ${
            item.category === "sunglasses" ? "90041000" : item.category === "watches" ? "91021100" : "64039190"
          } ${item.selectedColor ? `| Color: ${item.selectedColor}` : ""} ${item.selectedSize ? `| Size: ${item.selectedSize}` : ""}
        </small>
      </td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">${formatPrice(item.price)}</td>
      <td style="text-align: right;">${formatPrice(item.price * item.quantity)}</td>
    </tr>
  `
    )
    .join("");

  const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tax Invoice - ${invoiceNumber} - WEALTHY STYLE</title>
  <style>
    @media print {
      @page { margin: 15mm; size: A4; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #111;
      background: #fff;
      margin: 0;
      padding: 20px;
      font-size: 12px;
      line-height: 1.5;
    }
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #111;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-family: serif;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #000;
      margin: 0;
    }
    .brand-subtitle {
      font-size: 10px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #666;
      margin-top: 4px;
    }
    .inv-title {
      text-align: right;
    }
    .inv-title h2 {
      margin: 0;
      font-size: 18px;
      text-transform: uppercase;
      color: #b8860b;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 25px;
      background: #f9f9f9;
      border: 1px solid #eee;
      border-radius: 6px;
      padding: 15px;
    }
    .section-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #888;
      font-weight: bold;
      margin-bottom: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #111;
      color: #fff;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 10px 8px;
      border: 1px solid #111;
    }
    td {
      padding: 10px 8px;
      border: 1px solid #eee;
      vertical-align: top;
    }
    .tax-summary {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 30px;
    }
    .summary-box {
      width: 320px;
      border: 1px solid #eee;
      border-radius: 6px;
      padding: 12px 16px;
      background: #fafafa;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 12px;
    }
    .summary-row.total {
      font-size: 15px;
      font-weight: 900;
      border-top: 2px solid #111;
      padding-top: 8px;
      margin-top: 8px;
      color: #000;
    }
    .footer {
      border-top: 1px solid #eee;
      padding-top: 15px;
      text-align: center;
      font-size: 10px;
      color: #777;
    }
    .btn-bar {
      max-width: 800px;
      margin: 0 auto 15px auto;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .btn {
      background: #d4af37;
      color: #000;
      border: none;
      padding: 8px 18px;
      border-radius: 4px;
      font-weight: bold;
      cursor: pointer;
      font-size: 12px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="btn-bar no-print">
    <button class="btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="invoice-card">
    <div class="header">
      <div>
        <h1 class="brand-title">WEALTHY STYLE</h1>
        <div class="brand-subtitle">Haute Luxury & Horology Atelier</div>
        <p style="margin: 6px 0 0 0; color: #555; font-size: 11px;">
          Luxury Retail Private Limited • CIN: U18101DL2024PTC392810<br/>
          GSTIN: <strong>07AAACW8891P1Z9</strong> | State: Delhi (07)
        </p>
      </div>

      <div class="inv-title">
        <h2>TAX INVOICE</h2>
        <p style="margin: 4px 0 0 0; font-size: 12px;">
          Invoice No: <strong>${invoiceNumber}</strong><br/>
          Date: ${invoiceDate}<br/>
          Place of Supply: ${order.shippingAddress.state || "India"}
        </p>
      </div>
    </div>

    <div class="grid">
      <div>
        <div class="section-label">Billed To / Customer Details</div>
        <strong>${order.shippingAddress.fullName || order.customerName}</strong><br/>
        Email: ${order.customerEmail}<br/>
        Phone: ${order.shippingAddress.phone || order.customerPhone}
      </div>

      <div>
        <div class="section-label">Delivery & Shipping Address</div>
        ${order.shippingAddress.houseFlat}, ${order.shippingAddress.street}<br/>
        ${order.shippingAddress.area ? order.shippingAddress.area + ", " : ""}${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br/>
        Country: India
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 30px; text-align: center;">#</th>
          <th style="text-align: left;">Item Description & Specifications</th>
          <th style="width: 40px; text-align: center;">Qty</th>
          <th style="width: 90px; text-align: right;">Unit Price</th>
          <th style="width: 100px; text-align: right;">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="tax-summary">
      <div class="summary-box">
        <div class="summary-row">
          <span>Subtotal (Gross):</span>
          <strong>${formatPrice(order.subtotal)}</strong>
        </div>
        <div class="summary-row">
          <span>Taxable Amount (Excl. Tax):</span>
          <span>${formatPrice(taxableAmount)}</span>
        </div>
        <div class="summary-row">
          <span>CGST (9.00%):</span>
          <span>${formatPrice(cgst)}</span>
        </div>
        <div class="summary-row">
          <span>SGST (9.00%):</span>
          <span>${formatPrice(sgst)}</span>
        </div>
        <div class="summary-row">
          <span>Total Integrated Taxes (18%):</span>
          <strong style="color: #b8860b;">${formatPrice(totalTax)}</strong>
        </div>
        ${order.discount ? `
        <div class="summary-row" style="color: #059669;">
          <span>Privilege Coupon (${order.couponCode || "DISCOUNT"}):</span>
          <strong>-${formatPrice(order.discount)}</strong>
        </div>` : ''}
        <div class="summary-row">
          <span>Shipping & Courier Fee:</span>
          <span>${order.shippingCost === 0 ? "FREE" : formatPrice(order.shippingCost)}</span>
        </div>

        <div class="summary-row total">
          <span>Grand Total (Net):</span>
          <span>${formatPrice(order.grandTotal)}</span>
        </div>

        ${order.advancePaid ? `
        <div class="summary-row" style="margin-top: 6px; color: #059669; font-weight: bold;">
          <span>Advance Paid Online:</span>
          <span>₹${order.advancePaid}</span>
        </div>` : ''}
        ${order.balanceDue ? `
        <div class="summary-row" style="color: #d97706; font-weight: bold;">
          <span>Balance on Delivery (COD):</span>
          <span>${formatPrice(order.balanceDue)}</span>
        </div>` : ''}
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 4px 0;">This is a computer-generated tax invoice and requires no physical signature under the Information Technology Act, 2000.</p>
      <p style="margin: 0;">For concierge assistance, warranty registrations or returns, write to <strong>concierge@wealthstyle.luxury</strong></p>
    </div>
  </div>
</body>
</html>
`;

  // 1. Trigger direct file download onto the user's computer / system
  try {
    const blob = new Blob([invoiceHtml], { type: "text/html;charset=utf-8;" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `Tax-Invoice-${invoiceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
  } catch (err) {
    console.error("Error creating direct invoice file download:", err);
  }

  // 2. Also open printable invoice window for instant "Save as PDF" or Print
  try {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        try {
          printWindow.print();
        } catch {
          // print might be blocked by browser policy, user can click print button inside window
        }
      }, 500);
    }
  } catch (err) {
    console.error("Error opening print window:", err);
  }
}
