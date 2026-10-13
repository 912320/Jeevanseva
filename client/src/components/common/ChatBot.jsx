import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FaRobot, FaTimes, FaPaperPlane, FaTrash, FaExclamationTriangle,
  FaAmbulance, FaHospital, FaUserMd, FaPills, FaMapMarkerAlt,
  FaPhone, FaStar, FaDirections, FaCalendarCheck, FaChevronDown
} from 'react-icons/fa';
import { MdHealthAndSafety } from 'react-icons/md';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// ── Constants ─────────────────────────────────────────────────────────────────
const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: `👋 Hi! I'm **JeevanSeva AI Assistant**. I can help you:

• 🏥 Find hospitals near you
• 👨‍⚕️ Discover doctors & specialists  
• 💊 Search medicine information
• 🏪 Locate nearby pharmacies
• 🩺 Understand symptoms & health info
• 🚑 Emergency guidance

How can I help you today?`,
  timestamp: new Date()
};

const SUGGESTED_PROMPTS = [
  { icon: '🔍', text: 'Find a doctor near me', category: 'doctor' },
  { icon: '🏥', text: 'Find nearby hospitals', category: 'hospital' },
  { icon: '💊', text: 'Search for a medicine', category: 'medicine' },
  { icon: '🩺', text: 'I have symptoms', category: 'symptom' },
  { icon: '🚑', text: 'Emergency help', category: 'emergency' },
  { icon: '📍', text: 'Find pharmacy near me', category: 'pharmacy' },
];

// ── Markdown-lite renderer (bold, newlines) ──────────────────────────────────
function renderMarkdown(text) {
  if (!text) return null;
  let str = '';
  if (typeof text === 'string') {
    str = text;
  } else if (typeof text === 'object') {
    str = text.message || text.error || text.reply || JSON.stringify(text);
  } else {
    str = String(text);
  }
  const lines = str.split('\n');
  return lines.map((line, i) => {
    const parts = line.split(/\*\*(.+?)\*\*/g);
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
    );
    return <span key={i}>{rendered}{i < lines.length - 1 && <br />}</span>;
  });
}

// ── Doctor Card ───────────────────────────────────────────────────────────────
const DoctorCard = ({ doctor }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow mt-2">
    <div className="flex items-start gap-3">
      <div className="bg-blue-100 text-blue-700 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
        {doctor.name?.charAt(0) || 'D'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">Dr. {doctor.name}</p>
        <p className="text-blue-600 text-xs">{doctor.specialization?.join(', ') || 'General Physician'}</p>
        {doctor.hospital && <p className="text-gray-500 text-xs truncate">🏥 {doctor.hospital}</p>}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {doctor.city && <span className="text-xs text-gray-500">📍 {doctor.city}</span>}
          {doctor.distance != null && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{doctor.distance} km</span>}
          {doctor.fee && <span className="text-xs text-gray-600">₹{doctor.fee}</span>}
          {doctor.rating > 0 && <span className="text-xs text-amber-600">⭐ {doctor.rating}</span>}
        </div>
      </div>
    </div>
    <div className="flex gap-2 mt-2">
      {doctor.phone && (
        <a href={`tel:${doctor.phone}`} className="flex-1 flex items-center justify-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg py-1.5 hover:bg-green-100 transition-colors">
          <FaPhone className="text-xs" /> Call
        </a>
      )}
      <Link to={`/book-appointment/${doctor.id}`} className="flex-1 flex items-center justify-center gap-1 text-xs bg-blue-600 text-white rounded-lg py-1.5 hover:bg-blue-700 transition-colors">
        <FaCalendarCheck className="text-xs" /> Book
      </Link>
      <Link to={`/doctors?search=${encodeURIComponent(doctor.name || '')}`} className="flex-1 flex items-center justify-center gap-1 text-xs bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-1.5 hover:bg-gray-100 transition-colors">
        View Profile
      </Link>
    </div>
  </div>
);

// ── Hospital Card ─────────────────────────────────────────────────────────────
const HospitalCard = ({ hospital }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow mt-2">
    <div className="flex items-start gap-3">
      <div className="bg-red-100 text-red-700 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
        <FaHospital className="text-sm" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900 text-sm truncate">{hospital.name}</p>
          {hospital.hasEmergency && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full flex-shrink-0">🚨 Emergency</span>}
        </div>
        <p className="text-gray-500 text-xs truncate">📍 {hospital.address || hospital.city}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {hospital.distance != null && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{hospital.distance} km</span>}
          {hospital.rating > 0 && <span className="text-xs text-amber-600">⭐ {hospital.rating}</span>}
          {hospital.type && <span className="text-xs text-gray-500 capitalize">{hospital.type}</span>}
        </div>
      </div>
    </div>
    <div className="flex gap-2 mt-2">
      {hospital.phone && (
        <a href={`tel:${hospital.phone}`} className="flex-1 flex items-center justify-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg py-1.5 hover:bg-green-100 transition-colors">
          <FaPhone className="text-xs" /> Call
        </a>
      )}
      {hospital.latitude && hospital.longitude && (
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}&dir_action=navigate`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-lg py-1.5 hover:bg-blue-100 transition-colors">
          <FaDirections className="text-xs" /> Directions
        </a>
      )}
      <Link to="/hospitals" className="flex-1 flex items-center justify-center gap-1 text-xs bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-1.5 hover:bg-gray-100 transition-colors">
        View All
      </Link>
    </div>
  </div>
);

// ── Medicine Card ─────────────────────────────────────────────────────────────
const MedicineCard = ({ medicine }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow mt-2">
    <div className="flex items-start gap-3">
      <div className="bg-purple-100 text-purple-700 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
        <FaPills className="text-sm" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900 text-sm">{medicine.name}</p>
          <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${medicine.prescriptionRequired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {medicine.prescriptionRequired ? 'Rx' : 'OTC'}
          </span>
        </div>
        {medicine.genericName && <p className="text-gray-500 text-xs">Generic: {medicine.genericName}</p>}
        {medicine.category && <p className="text-xs text-blue-600">{medicine.category}</p>}
        {medicine.uses && <p className="text-gray-600 text-xs mt-1 line-clamp-2">Uses: {medicine.uses}</p>}
      </div>
    </div>
    <div className="flex gap-2 mt-2">
      <Link to={`/medicines?search=${encodeURIComponent(medicine.name)}`} className="flex-1 flex items-center justify-center gap-1 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-lg py-1.5 hover:bg-purple-100 transition-colors">
        More Info
      </Link>
      <Link to={`/pharmacies?medicine=${encodeURIComponent(medicine.name)}`} className="flex-1 flex items-center justify-center gap-1 text-xs bg-gray-50 text-gray-700 border border-gray-200 rounded-lg py-1.5 hover:bg-gray-100 transition-colors">
        Find Pharmacy
      </Link>
    </div>
  </div>
);

// ── Pharmacy Card ─────────────────────────────────────────────────────────────
const PharmacyCard = ({ pharmacy }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow mt-2">
    <div className="flex items-start gap-3">
      <div className="bg-green-100 text-green-700 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-lg">🏪</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{pharmacy.name}</p>
        <p className="text-gray-500 text-xs truncate">📍 {pharmacy.address || pharmacy.city}</p>
        <div className="flex items-center gap-2 mt-1">
          {pharmacy.distance != null && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{pharmacy.distance} km</span>}
          {pharmacy.openingHours && <span className="text-xs text-gray-500 truncate">🕐 {pharmacy.openingHours}</span>}
        </div>
      </div>
    </div>
    <div className="flex gap-2 mt-2">
      {pharmacy.phone && (
        <a href={`tel:${pharmacy.phone}`} className="flex-1 flex items-center justify-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg py-1.5 hover:bg-green-100 transition-colors">
          <FaPhone className="text-xs" /> Call
        </a>
      )}
      {pharmacy.latitude && pharmacy.longitude && (
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}&dir_action=navigate`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-lg py-1.5 hover:bg-blue-100 transition-colors">
          <FaDirections className="text-xs" /> Directions
        </a>
      )}
    </div>
  </div>
);

// ── Emergency Banner ──────────────────────────────────────────────────────────
const EmergencyBanner = () => (
  <div className="bg-red-600 text-white rounded-xl p-3 mt-2 animate-pulse">
    <div className="flex items-center gap-2 mb-2">
      <FaExclamationTriangle className="text-yellow-300 text-lg flex-shrink-0" />
      <span className="font-bold text-sm">⚠️ MEDICAL EMERGENCY DETECTED</span>
    </div>
    <div className="space-y-2">
      <a href="tel:108" className="flex items-center justify-center gap-2 bg-white text-red-700 rounded-lg py-2 font-bold text-sm hover:bg-red-50 transition-colors">
        <FaPhone /> Call 108 (Ambulance)
      </a>
      <a href="tel:112" className="flex items-center justify-center gap-2 bg-red-500 text-white rounded-lg py-2 font-bold text-sm hover:bg-red-400 transition-colors">
        <FaPhone /> Call 112 (National Emergency)
      </a>
      <Link to="/emergency" className="flex items-center justify-center gap-2 bg-red-800 text-white rounded-lg py-2 font-bold text-sm hover:bg-red-900 transition-colors">
        <FaAmbulance /> Find Emergency Services
      </Link>
    </div>
  </div>
);

// ── Message Bubble ────────────────────────────────────────────────────────────
const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const hasResults = message.dbResults;
  const dbResults = message.dbResults || {};

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[90%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-1">
            <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center">
              <FaRobot className="text-xs" />
            </div>
            <span className="text-xs text-gray-500 font-medium">JeevanSeva AI</span>
          </div>
        )}

        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-gray-100 text-gray-800 rounded-tl-sm'
        }`}>
          {renderMarkdown(message.content)}
        </div>

        {/* Emergency Banner */}
        {message.isEmergency && !isUser && <EmergencyBanner />}

        {/* DB Result Cards */}
        {hasResults && !isUser && (
          <div className="mt-1 space-y-1">
            {dbResults.doctors?.map(d => <DoctorCard key={d.id} doctor={d} />)}
            {dbResults.hospitals?.map(h => <HospitalCard key={h.id} hospital={h} />)}
            {dbResults.medicines?.map(m => <MedicineCard key={m.id} medicine={m} />)}
            {dbResults.pharmacies?.map(p => <PharmacyCard key={p.id} pharmacy={p} />)}
          </div>
        )}

        <p className={`text-xs mt-1 ${isUser ? 'text-right text-blue-100' : 'text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

// ── Typing Indicator ──────────────────────────────────────────────────────────
const TypingIndicator = () => (
  <div className="flex justify-start mb-3">
    <div className="max-w-[90%]">
      <div className="flex items-center gap-1.5 mb-1">
        <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center">
          <FaRobot className="text-xs" />
        </div>
        <span className="text-xs text-gray-500 font-medium">JeevanSeva AI</span>
      </div>
      <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm inline-flex gap-1.5 items-center">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

// ── Main ChatBot Component ────────────────────────────────────────────────────
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [configError, setConfigError] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [messages, isOpen, scrollToBottom]);

  // Track scroll position to show "scroll down" button
  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowScrollDown(!isNearBottom);
  };

  // Try to get location on mount (silently)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {} // Silent failure — user can still chat without location
      );
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build history (exclude welcome message, last 10 turns)
      const history = messages
        .filter(m => m.id !== 'welcome')
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      const payload = {
        message: trimmed,
        history,
        ...(userLocation && { lat: userLocation.lat, lng: userLocation.lng })
      };

      const response = await api.post('/chat', payload);
      const data = response.data;

      if (data.isConfigError) {
        setConfigError(true);
      }

      let replyContent = '';
      if (typeof data.reply === 'string' && data.reply.trim()) {
        replyContent = data.reply;
      } else if (data.reply && typeof data.reply === 'object') {
        replyContent = data.reply.message || data.reply.text || JSON.stringify(data.reply);
      } else if (typeof data.message === 'string' && data.message.trim()) {
        replyContent = data.message;
      } else {
        replyContent = 'I have retrieved the relevant information for your query below.';
      }

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date(),
        isEmergency: Boolean(data.isEmergency),
        dbResults: data.dbResults
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }

    } catch (err) {
      console.error('Chat error:', err);
      let errorContent = "I'm having trouble connecting right now. Please try asking again in a moment.";

      if (typeof err.response?.data?.reply === 'string' && err.response.data.reply.trim()) {
        errorContent = err.response.data.reply;
      } else if (typeof err.response?.data?.message === 'string' && err.response.data.message.trim()) {
        errorContent = err.response.data.message;
      } else if (typeof err.response?.data?.error === 'string' && err.response.data.error.trim()) {
        errorContent = err.response.data.error;
      } else if (err.response?.data?.error?.message && typeof err.response.data.error.message === 'string') {
        errorContent = err.response.data.error.message;
      } else if (err.message && typeof err.message === 'string') {
        errorContent = err.message;
      }

      if (err.response?.data?.isConfigError) setConfigError(true);

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: `⚠️ ${errorContent}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, userLocation, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setConfigError(false);
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={handleOpen}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        } bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white`}
        aria-label="Open AI Health Assistant"
      >
        <MdHealthAndSafety className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* ── Chat Window ── */}
      <div className={`fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      }`} style={{ height: '580px', maxHeight: 'calc(100vh - 48px)' }}>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-t-2xl flex items-center gap-3">
          <div className="bg-white/20 w-9 h-9 rounded-full flex items-center justify-center">
            <MdHealthAndSafety className="text-xl" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">JeevanSeva AI</p>
            <p className="text-xs text-blue-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
              Healthcare Assistant
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={clearChat} className="text-blue-100 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Clear chat">
              <FaTrash className="text-xs" />
            </button>
            <button onClick={() => setIsOpen(false)} className="text-blue-100 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Close">
              <FaTimes className="text-sm" />
            </button>
          </div>
        </div>

        {/* Config Error Banner */}
        {configError && (
          <div className="bg-amber-50 border-b border-amber-200 px-3 py-2 text-xs text-amber-800 flex items-center gap-2">
            <FaExclamationTriangle className="flex-shrink-0 text-amber-500" />
            <span>AI key not set. Add <code className="bg-amber-100 px-1 rounded">GEMINI_API_KEY</code> to server/.env</span>
          </div>
        )}

        {/* Location status */}
        {userLocation && (
          <div className="bg-green-50 border-b border-green-100 px-3 py-1.5 text-xs text-green-700 flex items-center gap-1">
            <FaMapMarkerAlt className="text-green-500" />
            Location detected — nearby results enabled
          </div>
        )}

        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-3 py-3 space-y-1"
        >
          {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll-down button */}
        {showScrollDown && (
          <button onClick={scrollToBottom} className="absolute bottom-[80px] right-4 bg-white shadow-md border border-gray-200 rounded-full p-2 text-gray-500 hover:text-blue-600 transition-colors z-10">
            <FaChevronDown className="text-sm" />
          </button>
        )}

        {/* Suggested Prompts (only when just welcome message) */}
        {messages.length <= 1 && (
          <div className="px-3 py-2 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Quick actions:</p>
            <div className="grid grid-cols-2 gap-1.5">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt.text)}
                  className="text-left text-xs bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-gray-600 border border-gray-200 rounded-lg px-2.5 py-2 transition-colors"
                >
                  {prompt.icon} {prompt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="px-3 py-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about doctors, hospitals, medicines..."
              rows={1}
              maxLength={1000}
              className="flex-1 resize-none border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white max-h-24 overflow-y-auto"
              style={{ minHeight: '42px' }}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-center leading-tight">
            General health info only · Not medical advice · 🚑 Emergency: call <strong>108</strong>
          </p>
        </form>
      </div>
    </>
  );
};

export default ChatBot;
