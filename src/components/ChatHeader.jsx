// import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { WHATSAPP_NUMBER, CALL_NUMBER } from "../config/constants";

export default function ChatHeader() {
  const whatsappNumber =
    window.CHATBOT_CONFIG?.whatsapp || WHATSAPP_NUMBER;

  const callNumber =
    window.CHATBOT_CONFIG?.call || CALL_NUMBER;

  return (
    <div className="chat-header">
      <div className="chat-title">
        Admissions Expert • Online
      </div>

      <div className="chat-actions">
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="icon-button whatsapp"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={20} />
        </a>

        <a
          href={`tel:${callNumber}`}
          className="icon-button call"
          aria-label="Call us"
        >
          <FaPhoneAlt size={18} />
        </a>
      </div>
    </div>
  );
}
