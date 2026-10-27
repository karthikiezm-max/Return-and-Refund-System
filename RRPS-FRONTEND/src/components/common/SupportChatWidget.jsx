import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot, ShieldCheck } from 'lucide-react';
import './SupportChatWidget.css';

export const SupportChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello Karthik! Welcome to the Return Center Support Desk. How can I assist you with your reverse pickup, return policy, or refund today?'
    }
  ]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Instant smart bot logic
    setTimeout(() => {
      let botResponse = "I have noted your request. A customer support specialist can override your return window if needed.";
      const lower = query.toLowerCase();

      if (lower.includes('refund') || lower.includes('sla') || lower.includes('tat') || lower.includes('days')) {
        botResponse = "Under Consumer Protection Rules 2020, refunds to the original payment method take 5-7 business days. Store credit is credited within 24 hours with an extra 5% bonus!";
      } else if (lower.includes('electronics') || lower.includes('keyboard') || lower.includes('monitor')) {
        botResponse = "Consumer Electronics carry a 7-day return window from delivery date. Defective items require photo evidence and QC inspection prior to settlement.";
      } else if (lower.includes('apparel') || lower.includes('t-shirt') || lower.includes('clothing')) {
        botResponse = "Apparel items carry a 30-day free return window provided original manufacturer tags remain attached and unworn.";
      } else if (lower.includes('reschedule') || lower.includes('pickup')) {
        botResponse = "You can reschedule your reverse pickup up to 2 times directly from the Track Return or Return History view.";
      } else if (lower.includes('exchange')) {
        botResponse = "Exchanges for size or color are available for eligible categories once per order item. A replacement AWB is issued after pickup confirmation.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <>
      <button
        className="chat-widget-fab"
        onClick={() => setIsOpen(!isOpen)}
        title="Live Return Support Chat"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {isOpen && (
        <div className="chat-modal-window">
          <div className="chat-window-header">
            <div className="chat-header-info">
              <div className="chat-avatar-bot">
                <Bot size={16} />
              </div>
              <div>
                <div className="chat-bot-name">RETRIEVE Assistant</div>
                <div className="chat-bot-status">● Live Automated Help</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="chat-body-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-bubble ${m.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="chat-quick-replies">
            <button className="chat-quick-btn" onClick={() => handleSend("What is the refund SLA?")}>
              Refund SLA?
            </button>
            <button className="chat-quick-btn" onClick={() => handleSend("Electronics return window?")}>
              Electronics Window
            </button>
            <button className="chat-quick-btn" onClick={() => handleSend("Can I reschedule pickup?")}>
              Reschedule Pickup
            </button>
          </div>

          <form
            className="chat-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className="chat-text-input"
              placeholder="Ask about return policy, refund..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
