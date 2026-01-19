import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import { ZOOM_LINK } from "../config/constants";
import { RESOURCES } from "../config/constants";

export default function ChatWidget({ lead }) {
  const [messages, setMessages] = useState([]);
  // const [showZoomButton, setShowZoomButton] = useState(false);
  const [zoomClicked, setZoomClicked] = useState(
    localStorage.getItem("zoomClicked") === "true",
  );
  const [menuState, setMenuState] = useState("hidden");
  // possible values: "hidden" | "main"

  const rescueTimerRef = useRef(null);
  const [subMenuActive, setSubMenuActive] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [rescueActive, setRescueActive] = useState(false);
  const [userInput, setUserInput] = useState("");
  // const [submenuSource, setSubmenuSource] = useState(null);
  const [zoomCTAVisible, setZoomCTAVisible] = useState(false);
  const [zoomUnlocked, setZoomUnlocked] = useState(false);

  // Initial Zoom pitch flow
  useEffect(() => {
    const flow = [
      `Hi ${lead.name}! 👋`,
      `I see you're interested in studying at ${lead.university} in Germany. That’s a fantastic choice! 🇩🇪`,
      `The process for German admissions can be tricky, but we are live right now on Zoom to help students exactly like you.`,
      `In this session, we cover:
• Step-by-step admission for ${lead.university}
• How to skip APS delays
• Getting your Visa without rejections`,
    ];

    let i = 0;
    const interval = setInterval(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: flow[i] }]);
      i++;
      if (i === flow.length) {
        clearInterval(interval);
        setZoomCTAVisible(true);
        startRescueTimer();
      }
    }, 700);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rescue timer
  const startRescueTimer = () => {
    if (zoomClicked) return;

    rescueTimerRef.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Still here? No worries! If you can’t join the Zoom right now, I can share some of our exclusive guides to get you started. Which one do you need?",
        },
      ]);
      setMenuState("main");
      setZoomCTAVisible(false);
      setRescueActive(true);
    }, 8000);
  };

  // Zoom click
  const handleZoomClick = () => {
    localStorage.setItem("zoomClicked", "true");
    setZoomCTAVisible(false);
    window.open(ZOOM_LINK, "_blank");

    clearTimeout(rescueTimerRef.current);

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text:
          `Awesome! You're being redirected 🚀\n` +
          `Once you enter, stay on the call—you can ask the host any specific questions about ${lead.university}.`,
      },
      {
        sender: "bot",
        text: `You can also type "Know more" if you'd like additional details.`,
        type: "action",
        action: "knowMore",
        label: "Know more",
      },
    ]);

    setZoomCTAVisible(false);
  };

  const clearRescueTimer = () => {
    if (rescueTimerRef.current) {
      clearTimeout(rescueTimerRef.current);
      rescueTimerRef.current = null;
    }
  };

  // Resource handlers
  const handleAPS = () => {
    clearRescueTimer();
    setZoomCTAVisible(false);

    setActiveMenu("APS Process Guide");

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text:
          "The APS certificate is one of the most important documents for 2026.\n" +
          "Here’s the complete breakdown of how to apply:",
        type: "submenu",
      },
      {
        sender: "bot",
        text: "APS guidance is explained in detail during the live Zoom session.",
        type: "submenu",
      },
      {
        sender: "bot",
        text: "Anything else you'd like to explore?",
        type: "submenu",
      },
    ]);

    setMenuState("hidden");
    setSubMenuActive(true);
  };

  const handleStories = () => {
    clearRescueTimer();

    setActiveMenu("Success Stories");
    // setSubmenuSource("stories");

    // Hide Zoom while inside submenu
    setZoomCTAVisible(false);
    setZoomUnlocked(true);

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text:
          "We’ve helped hundreds of students reach Germany 🇩🇪\n" +
          "Through live Zoom counselling, we explain real admission journeys, visa approvals, and student success stories.",
        type: "submenu",
      },
      {
        sender: "bot",
        text: "If you want personalised guidance and real examples, you can join our live Zoom counselling.",
        type: "submenu",
      },
    ]);

    setMenuState("hidden");
    setSubMenuActive(true);
  };

  const handleLink = (label, links) => {
    clearRescueTimer();
    setZoomCTAVisible(false);
    setActiveMenu(label);

    const safeLinks = Array.isArray(links) ? links : [links];

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: label,
        type: "submenu",
        subtype: "title",
      },

      ...safeLinks.map((link) => ({
        sender: "bot",
        text: link,
        type: "submenu",
        subtype: "link",
      })),

      {
        sender: "bot",
        text: "Anything else you'd like to explore?",
        type: "submenu",
        subtype: "text",
      },
    ]);

    setMenuState("hidden");
    setSubMenuActive(true);
  };

  const openRescueMenu = () => {
    setMenuState("main");
    setRescueActive(true);
    setZoomCTAVisible(false);
  };

  const handleUserInput = () => {
    const text = userInput.trim().toLowerCase();
    if (!text) return;

    // show user message
    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);

    setUserInput("");

    // ---- KNOW MORE ----
    if (text === "know more" || text === "knowmore") {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sure 👍 Here are some resources that can help you get started:",
        },
      ]);

      openRescueMenu();
      return;
    }

    // ---- HI / MENU ----
    if (["hi", "hello", "menu"].includes(text)) {
      setMenuState("main");
      setRescueActive(true);
      return;
    }

    // ---- APS ----
    if (text.includes("aps")) {
      handleAPS();
      return;
    }

    // ---- GERMAN / A1 / A2 ----
    if (text.includes("a1") || text.includes("a2") || text.includes("german")) {
      handleLink("A1 / A2 German Guide", RESOURCES.GERMAN_A1);

      return;
    }

    // ---- MASTERS ----
    if (text.includes("master")) {
      handleLink("Masters in Germany", RESOURCES.MASTERS);

      return;
    }

    // ---- UNIVERSITIES ----
    if (text.includes("university")) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "We work with multiple public universities in Germany. " +
            "Join the Zoom session to get the updated list based on your profile.",
        },
      ]);
      return;
    }

    // ---- FALLBACK ----
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text:
          "I can help with APS, German language, Masters, or university guidance. " +
          'Type "HI" to see options.',
      },
    ]);
  };

  const renderWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split("\n").map((line, lineIndex) => {
      const parts = line.split(urlRegex);

      return (
        <div key={lineIndex}>
          {parts.map((part, index) => {
            if (part.match(urlRegex)) {
              return (
                <a
                  key={index}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#0052cc",
                    textDecoration: "underline",
                    display: "block",
                    wordBreak: "break-all",
                    marginTop: "4px",
                  }}
                >
                  {part}
                </a>
              );
            }
            return <span key={index}>{part}</span>;
          })}
        </div>
      );
    });
  };

  const handleMasters = () => {
    clearRescueTimer();

    setActiveMenu("Masters in Germany");
    setMenuState("hidden");
    setSubMenuActive(true);

    setMessages((prev) => [
      ...prev,

      // 1️⃣ First message — Intro
      {
        sender: "bot",
        text:
          "LIVE 1-to-1 Zoom Counselling (Mon–Sat):\n" +
          "10:30 AM se 06:00 PM tak main Zoom par live rehta hoon – yahi pe admission, APS, visa,\n" +
          "documents, steps, timeline, budget sab clear karunga.",
        type: "submenu",
      },

      // 2️⃣ SECOND — Zoom CTA INLINE
      {
        sender: "bot",
        type: "zoomCTA",
      },

      // 3️⃣ Third message — Links block
      {
        sender: "bot",
        text:
          "COMPLETE PLAN:\n" +
          "https://indogermaneducation.com/masters/\n\n" +
          "MASTERS IN GERMANY COMPLETE GUIDE VIDEO:\n" +
          "https://www.youtube.com/watch?v=NQwpq_xI-b0&t=2s\n\n" +
          "PRIVESH IN GERMANY:\n" +
          "https://indogermaneducation.com/privesh-in-germany/\n\n" +
          "WHY GERMANY IN 2026?\n" +
          "https://www.youtube.com/watch?v=vI_B_NjWB-c",
        type: "submenu",
      },

      // 4️⃣ Fourth message — Contact + Community
      {
        sender: "bot",
        text:
          "Direct call / WhatsApp for personal guidance:\n" +
          "+91 97124 25555 / +91 72111 25555\n\n" +
          "Very Important STUDY IN GERMANY 2026 WHATSAPP COMMUNITY:\n" +
          "https://chat.whatsapp.com/Iq0jzDZmaT30SmOEin4CPV",
        type: "submenu",
      },
    ]);
  };

  return (
    <div className="chat-widget">
      <ChatHeader />

      <div className="chat-body">
        {messages.map((m, i) => {
          // Action button (Know more)
          if (m.type === "action" && m.action === "knowMore") {
            return (
              <button
                key={i}
                className="chat-action-button"
                onClick={() => {
                  setMessages((prev) => [
                    ...prev,
                    {
                      sender: "bot",
                      text: "Sure 👍 Here are some resources that can help you get started:",
                    },
                  ]);
                  openRescueMenu();
                }}
              >
                {m.label}
              </button>
            );
          }
          // Inline Zoom CTA message
          if (m.type === "zoomCTA" && !zoomClicked) {
            return (
              <button
                key={i}
                className="zoom-button"
                onClick={handleZoomClick}
                style={{ margin: "8px auto", display: "block" }}
              >
                Join Live Zoom Session
              </button>
            );
          }

          // Normal message
          return (
            <div
              key={i}
              className={`bubble ${m.sender}
        ${m.type === "submenu" ? "submenu" : ""}
        ${m.subtype ? `submenu-${m.subtype}` : ""}
      `}
            >
              {typeof m.text === "string" ? renderWithLinks(m.text) : m.text}
            </div>
          );
        })}

        {/* {zoomCTAVisible && !zoomClicked && (
          <button className="zoom-button" onClick={handleZoomClick}>
            Join Live Zoom Session
          </button>
        )} */}

        {menuState === "main" && !subMenuActive && (
          <div className="menu">
            <button
              className={
                activeMenu === "A1 / A2 German Guide"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() =>
                handleLink("A1 / A2 German Guide", RESOURCES.GERMAN_A1)
              }
            >
              A1 / A2 German Guide
            </button>

            <button
              className={
                activeMenu === "Masters in Germany"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={handleMasters}
            >
              Masters in Germany
            </button>

            <button
              className={
                activeMenu === "APS Process Guide"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={handleAPS}
            >
              APS Process Guide
            </button>

            <button
              className={
                activeMenu === "Success Stories"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={handleStories}
            >
              Success Stories
            </button>

            <button
              className={
                activeMenu === "Education Loan Info"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() => {
                clearRescueTimer();
                setZoomCTAVisible(false);
                setActiveMenu("Education Loan Info");

                setMessages((prev) => [
                  ...prev,
                  {
                    sender: "bot",
                    text:
                      "Education loan options for Germany depend on your profile, university, and intake.\n" +
                      "We explain loan providers, blocked account requirements, and eligibility clearly during the live Zoom counselling session.",
                    type: "submenu",
                  },
                ]);

                setMenuState("hidden");
                setSubMenuActive(true);
              }}
            >
              Education Loan Info
            </button>

            {/* <button
              className="menu-secondary"
              onClick={() => {
                setMenuState("hidden");
                setActiveMenu(null);
              }}
            >
              Close Menu
            </button> */}
          </div>
        )}

        {subMenuActive && (
          <button
            className="submenu-close"
            onClick={() => {
              setMessages((prev) =>
                prev.filter((msg) => msg.type !== "submenu"),
              );

              setSubMenuActive(false);
              setMenuState("main");
              setActiveMenu(null);
              setRescueActive(true);

              // ✅ Zoom CTA ONLY if returning from Success Stories
              if (zoomUnlocked && !zoomClicked) {
                setZoomCTAVisible(true);
              } else {
                setZoomCTAVisible(false);
              }

              // setSubmenuSource(null);
            }}
          >
            Back to Menu
          </button>
        )}
      </div>

      {rescueActive && !subMenuActive && (
        <button
          className="menu-toggle-modern"
          onClick={() =>
            setMenuState((prev) => (prev === "main" ? "hidden" : "main"))
          }
        >
          {menuState === "main" ? "Hide Menu" : "Show Menu"}
        </button>
      )}

      <div className="chat-input">
        <input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder='Type here… (e.g. "HI", "APS")'
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUserInput();
            }
          }}
        />
      </div>
    </div>
  );
}
