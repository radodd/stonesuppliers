import React from "react";

interface EmailTemplateProps {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  position: string;
  company: string;
  message: string;
  cartItems?: CartItem[];
}

interface CartItem {
  name?: string;
  quantity?: string;
  category?: string;
  size?: string;
  image?: string;
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  lastName,
  phoneNumber,
  email,
  position,
  company,
  message,
  cartItems = [],
}: EmailTemplateProps) => (
  <div
    style={{
      fontFamily: "'Arial', sans-serif",
      lineHeight: "1.5",
      color: "#333",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
    }}
  >
    <h2 style={{ fontWeight: "bold", fontSize: "13px" }}>
      Subject:
      <span
        style={{ fontWeight: "normal", fontSize: "13px", paddingLeft: "4px" }}
      >
        New Quote Request - {firstName} {lastName}
      </span>
    </h2>
    <span
      style={{
        fontWeight: "bold",
        fontSize: "13px",
        marginBottom: "13px",
        paddingBottom: "13px",
      }}
    >
      Dear MRC Rock & Sand/Santa Paula Materials/Stoneyard
    </span>
    <span
      style={{
        display: "block",
        borderBottom: "1px solid #ccc",
        paddingTop: "13px",
        paddingBottom: "13px",
        // marginBottom: "8px",
        fontSize: "13px",
      }}
    >
      You have received a new materials quote request. Please find the details
      below:
    </span>

    <h1 style={{ fontWeight: "bold", fontSize: "15px" }}>
      Customer Information
    </h1>

    <ul
      style={{
        padding: 0,
        marginLeft: "30px",
        borderBottom: "1px solid #ccc",
        paddingBottom: "13px",
        fontSize: "13px",
      }}
    >
      <li style={{ marginBottom: "8px" }}>
        <strong>Name:</strong> {firstName} {lastName}
      </li>
      <li style={{ marginBottom: "8px" }}>
        <strong>Phone Number:</strong> {phoneNumber}
      </li>
      <li style={{ marginBottom: "8px" }}>
        <strong>Email Address:</strong> {email}
      </li>
      <li style={{ marginBottom: "8px" }}>
        <strong>Role:</strong> {position}
      </li>
      <li style={{ marginBottom: "8px" }}>
        <strong>Company (if applicable):</strong> {company}
      </li>
      <li>
        <strong>Message:</strong> {message === "" ? "N/A" : message}
      </li>
    </ul>
    <h1 style={{ fontWeight: "bold", fontSize: "15px" }}>
      Requested Materials
    </h1>

    {cartItems?.length > 0 ? (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <thead style={{ fontSize: "13px" }}>
          <tr>
            <th
              style={{
                border: "1px solid black",
                padding: "8px",
                textAlign: "left",
                backgroundColor: "#d9d9d9",
                fontSize: "13px",
              }}
            >
              Name
            </th>
            <th
              style={{
                border: "1px solid black",
                padding: "8px",
                textAlign: "left",
                backgroundColor: "#d9d9d9",
                fontSize: "13px",
              }}
            >
              Category
            </th>
            <th
              style={{
                border: "1px solid black",
                padding: "8px",
                textAlign: "left",
                backgroundColor: "#d9d9d9",
              }}
            >
              Size
            </th>
            <th
              style={{
                border: "1px solid black",
                padding: "8px",
                textAlign: "left",
                backgroundColor: "#d9d9d9",
              }}
            >
              Quantity
            </th>
          </tr>
        </thead>
        <tbody style={{ fontSize: "13px" }}>
          {cartItems.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: "8px", border: "1px solid black" }}>
                <strong>{item?.name}</strong>
              </td>
              <td style={{ padding: "8px", border: "1px solid black" }}>
                {item?.category}
              </td>
              <td style={{ padding: "8px", border: "1px solid black" }}>
                {item?.size}
              </td>
              <td style={{ padding: "8px", border: "1px solid black" }}>
                {item?.quantity} tons
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>{firstName} did not add any materials to their cart.</p>
    )}

    <h2 style={{ fontWeight: "bold", fontSize: "13px", paddingBottom: "13px" }}>
      Total Materials Requested: {cartItems.length}
    </h2>
    <span
      style={{
        fontWeight: "normal",
        fontSize: "13px",
        paddingBottom: "13px",
        display: "block",
      }}
    >
      Please reply to this email with a detailed quote fro the requested
      materials.
    </span>
    <span style={{ fontWeight: "normal", fontSize: "13px" }}>
      Thank you,
      <strong style={{ display: "block", fontSize: "13px" }}>
        {firstName} {lastName}
      </strong>
    </span>
  </div>
);

export default EmailTemplate;
