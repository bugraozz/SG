import React from 'react';
import { MessageCircle } from 'lucide-react';
import './FloatingWidgets.css';

const FloatingWidgets = () => {
  return (
    <div className="floating-widgets">
      <a href="https://wa.me/905555555555" target="_blank" rel="noreferrer" className="whatsapp-btn">
        <MessageCircle size={32} />
      </a>
    </div>
  );
};

export default FloatingWidgets;
