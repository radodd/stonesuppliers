import ReactDOMServer from "react-dom/server";
import EmailTemplate from "@/components/EmailTemplate";

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

export function renderEmailHtml(data: EmailData): string {
  return ReactDOMServer.renderToString(<EmailTemplate {...data} />);
}
