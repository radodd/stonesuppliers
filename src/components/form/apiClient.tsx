import { FormValues } from "../../lib/formTypes";
import EmailTemplate from "../EmailTemplate";
import ReactDOMServer from "react-dom/server";

export const sendFormData = async (formData: FormValues) => {
  const emailHtml = ReactDOMServer.renderToString(
    <EmailTemplate {...formData} />,
  );
  try {
    const response = await fetch("https://mrc-two.vercel.app/api/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        from: "Your Email <ethan@madasacollective.com>",
        to: "info@santapaulamaterials.com",
        subject: "Contact Form Submission",
        html: emailHtml,
      }),
    });
    // Log the raw response
    // Check for HTTP errors
    if (!response.ok) {
      const errorText = await response.text(); // Read error response for debugging
      console.error("Error response text:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Log parsed response

    // Return a standardized response structure
    return {
      success: !!data.data,
      data: data.data,
      error: !data.data ? "Unexpected response format" : null,
    };
  } catch (error) {
    console.error("Error in sendFormData:", error);
    throw error; // Rethrow for the calling site
  }
};
