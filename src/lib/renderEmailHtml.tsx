export interface EmailData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  position: string;
  company: string;
  message: string;
  cartItems?: Array<{
    name?: string;
    category?: string;
    size?: string;
    quantity?: string;
  }>;
}

function esc(str: string | undefined): string {
  return (str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderEmailHtml(data: EmailData): string {
  const { firstName, lastName, phoneNumber, email, position, company, message, cartItems = [] } = data;

  const cartSection =
    cartItems.length > 0
      ? `<table style="width:100%;border-collapse:collapse;margin-bottom:20px;border-bottom:1px solid #ccc">
        <thead style="font-size:13px">
          <tr>
            <th style="border:1px solid black;padding:8px;text-align:left;background-color:#d9d9d9;font-size:13px">Name</th>
            <th style="border:1px solid black;padding:8px;text-align:left;background-color:#d9d9d9;font-size:13px">Category</th>
            <th style="border:1px solid black;padding:8px;text-align:left;background-color:#d9d9d9">Size</th>
            <th style="border:1px solid black;padding:8px;text-align:left;background-color:#d9d9d9">Quantity</th>
          </tr>
        </thead>
        <tbody style="font-size:13px">
          ${cartItems
            .map(
              (item) => `
            <tr>
              <td style="padding:8px;border:1px solid black"><strong>${esc(item?.name)}</strong></td>
              <td style="padding:8px;border:1px solid black">${esc(item?.category)}</td>
              <td style="padding:8px;border:1px solid black">${esc(item?.size)}</td>
              <td style="padding:8px;border:1px solid black">${esc(item?.quantity)} tons</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>`
      : `<p>${esc(firstName)} did not add any materials to their cart.</p>`;

  return `<div style="font-family:'Arial',sans-serif;line-height:1.5;color:#333;max-width:600px;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:8px">
    <h2 style="font-weight:bold;font-size:13px">Subject:<span style="font-weight:normal;font-size:13px;padding-left:4px">New Quote Request - ${esc(firstName)} ${esc(lastName)}</span></h2>
    <span style="font-weight:bold;font-size:13px;margin-bottom:13px;padding-bottom:13px">Dear MRC Rock &amp; Sand/Santa Paula Materials/Stoneyard</span>
    <span style="display:block;border-bottom:1px solid #ccc;padding-top:13px;padding-bottom:13px;font-size:13px">You have received a new materials quote request. Please find the details below:</span>
    <h1 style="font-weight:bold;font-size:15px">Customer Information</h1>
    <ul style="padding:0;margin-left:30px;border-bottom:1px solid #ccc;padding-bottom:13px;font-size:13px">
      <li style="margin-bottom:8px"><strong>Name:</strong> ${esc(firstName)} ${esc(lastName)}</li>
      <li style="margin-bottom:8px"><strong>Phone Number:</strong> ${esc(phoneNumber)}</li>
      <li style="margin-bottom:8px"><strong>Email Address:</strong> ${esc(email)}</li>
      <li style="margin-bottom:8px"><strong>Role:</strong> ${esc(position)}</li>
      <li style="margin-bottom:8px"><strong>Company (if applicable):</strong> ${esc(company)}</li>
      <li><strong>Message:</strong> ${message === "" ? "N/A" : esc(message)}</li>
    </ul>
    <h1 style="font-weight:bold;font-size:15px">Requested Materials</h1>
    ${cartSection}
    <h2 style="font-weight:bold;font-size:13px;padding-bottom:13px">Total Materials Requested: ${cartItems.length}</h2>
    <span style="font-weight:normal;font-size:13px;padding-bottom:13px;display:block">Please reply to this email with a detailed quote fro the requested materials.</span>
    <span style="font-weight:normal;font-size:13px">Thank you,<strong style="display:block;font-size:13px">${esc(firstName)} ${esc(lastName)}</strong></span>
  </div>`;
}
