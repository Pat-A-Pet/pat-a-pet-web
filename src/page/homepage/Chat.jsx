// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {ArrowLeft} from 'lucide-react';
// import { FiMessageSquare, FiSend, FiMoreVertical, FiX, FiUser, FiHeart, FiMapPin, FiClock, FiSearch, FiPhone, FiVideo, FiPlusCircle } from 'react-icons/fi';
// import Navbar from '../../component/Navbar';

// const ChatPage = () => {
//   const [activeChat, setActiveChat] = useState(null);
//   const [message, setMessage] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [conversations, setConversations] = useState([
//     {
//       id: 1,
//       user: {
//         name: "Alex Johnson",
//         avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
//         role: "Pet Owner",
//         location: "San Francisco, CA",
//         joined: "Member since 2022",
//         isOnline: true
//       },
//       pet: {
//         name: "Max",
//         breed: "German Shepherd",
//         image: "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=300&h=300&fit=crop",
//         age: "3 years",
//         status: "Available"
//       },
//       messages: [
//         { id: 1, text: "Hi! I'm interested in adopting Max. Is he still available?", sender: "me", time: "10:30 AM", status: "delivered" },
//         { id: 2, text: "Yes, Max is still available! He's a wonderful dog. Do you have any specific questions about him?", sender: "them", time: "10:32 AM", status: "read" },
//         { id: 3, text: "I was wondering about his energy level. I live in an apartment but I'm very active.", sender: "me", time: "10:35 AM", status: "delivered" },
//         { id: 4, text: "Max has moderate energy. He needs about 60-90 minutes of exercise daily, but he's calm indoors. He's been great in my apartment!", sender: "them", time: "10:37 AM", status: "read" },
//         { id: 5, text: "That sounds perfect! Could we schedule a meetup this weekend?", sender: "me", time: "10:40 AM", status: "delivered" },
//         { id: 6, text: "Absolutely! How about Saturday at 2 PM at Golden Gate Park?", sender: "them", time: "10:42 AM", status: "read" }
//       ],
//       unread: 0,
//       lastActive: "10:42 AM",
//       isTyping: false
//     },
//     {
//       id: 2,
//       user: {
//         name: "Sarah Miller",
//         avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
//         role: "Adopter",
//         location: "Oakland, CA",
//         joined: "Member since 2023",
//         isOnline: true
//       },
//       pet: {
//         name: "Bella",
//         breed: "Labrador Mix",
//         image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop",
//         age: "2 years",
//         status: "Available"
//       },
//       messages: [
//         { id: 1, text: "Hello! I saw your message about Bella. She's beautiful!", sender: "them", time: "Yesterday", status: "read" },
//         { id: 2, text: "Thank you! She's a sweetheart. Are you looking to adopt a dog?", sender: "me", time: "Yesterday", status: "delivered" },
//         { id: 3, text: "Yes, I've been searching for a family-friendly dog. I have two kids (8 and 10).", sender: "them", time: "Yesterday", status: "read" },
//         { id: 4, text: "Bella is great with kids! She's very gentle and patient. Would you like to meet her?", sender: "me", time: "Yesterday", status: "delivered" }
//       ],
//       unread: 2,
//       lastActive: "9:15 AM",
//       isTyping: false
//     },
//     {
//       id: 3,
//       user: {
//         name: "Michael Chen",
//         avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
//         role: "Pet Owner",
//         location: "San Jose, CA",
//         joined: "Member since 2021",
//         isOnline: false
//       },
//       pet: {
//         name: "Charlie",
//         breed: "Tabby Cat",
//         image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop",
//         age: "1 year",
//         status: "Available"
//       },
//       messages: [
//         { id: 1, text: "Hi Michael, I'm interested in Charlie. Is he good with other cats?", sender: "me", time: "2 days ago", status: "delivered" },
//         { id: 2, text: "Yes, Charlie has lived with another cat before and was very friendly.", sender: "them", time: "2 days ago", status: "read" },
//         { id: 3, text: "Great! I have a 3-year-old female cat at home. Could you tell me about his personality?", sender: "me", time: "2 days ago", status: "delivered" }
//       ],
//       unread: 0,
//       lastActive: "1:20 PM",
//       isTyping: false
//     }
//   ]);
  
//   const messagesEndRef = useRef(null);
//   const textareaRef = useRef(null);

//   // Filter conversations based on search
//   const filteredConversations = conversations.filter(conv => 
//     conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     conv.pet.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Auto scroll to bottom of chat
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     if (activeChat) {
//       scrollToBottom();
//     }
//   }, [activeChat?.messages]);

//   // Auto-resize textarea
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = 'auto';
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//     }
//   }, [message]);

//   const sendMessage = () => {
//     if (!message.trim() || !activeChat) return;
    
//     const newMessage = {
//       id: Date.now(),
//       text: message.trim(),
//       sender: "me",
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       status: "sending"
//     };
    
//     // Update conversations state
//     setConversations(prev => prev.map(conv => 
//       conv.id === activeChat.id 
//         ? { 
//             ...conv, 
//             messages: [...conv.messages, newMessage],
//             lastActive: newMessage.time,
//             unread: 0
//           } 
//         : conv
//     ));
    
//     // Update active chat
//     setActiveChat(prev => ({
//       ...prev,
//       messages: [...prev.messages, newMessage],
//       lastActive: newMessage.time
//     }));
    
//     setMessage('');
    
//     // Simulate message status updates
//     setTimeout(() => {
//       const deliveredMessage = { ...newMessage, status: "delivered" };
//       setConversations(prev => prev.map(conv => 
//         conv.id === activeChat.id 
//           ? { 
//               ...conv, 
//               messages: conv.messages.map(msg => 
//                 msg.id === newMessage.id ? deliveredMessage : msg
//               )
//             } 
//           : conv
//       ));
//       setActiveChat(prev => ({
//         ...prev,
//         messages: prev.messages.map(msg => 
//           msg.id === newMessage.id ? deliveredMessage : msg
//         )
//       }));
//     }, 1000);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const selectChat = (conversation) => {
//     setActiveChat(conversation);
//     // Mark as read
//     if (conversation.unread > 0) {
//       setConversations(prev => prev.map(conv => 
//         conv.id === conversation.id 
//           ? { ...conv, unread: 0 }
//           : conv
//       ));
//     }
//   };

//   const getMessageStatusIcon = (status) => {
//     switch (status) {
//       case 'sending':
//         return <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />;
//       case 'delivered':
//         return <div className="w-2 h-2 bg-emerald-400 rounded-full" />;
//       case 'read':
//         return <div className="w-2 h-2 bg-emerald-500 rounded-full" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <>
//     <Navbar/>
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 mt-16">
//       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row h-[calc(100vh-80px)]">
//         {/* Sidebar */}
//         <motion.div 
//           className={`lg:w-1/3 xl:w-1/4 border-r border-gray-200 bg-white/80 backdrop-blur-sm flex flex-col ${activeChat ? 'hidden lg:flex' : 'flex'}`}
//           initial={{ x: -20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ duration: 0.3 }}
//         >
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center justify-between mb-6">
//               <button 
//               onClick={() => window.history.back()}
//               className="p-2 rounded-full hover:bg-gray-100 transition-colors">
//                 <ArrowLeft className="w-5 h-5 text-gray-600" />
//               </button>  
//               <motion.h1 
//                 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
//                 initial={{ y: -10, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.1 }}
//               >
//                 Messages
//               </motion.h1>
//               <motion.button 
//                 className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <FiPlusCircle className="w-5 h-5 text-emerald-600" />
//               </motion.button>
//             </div>
            
//             <motion.div 
//               className="relative"
//               initial={{ y: 10, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.2 }}
//             >
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiSearch className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search conversations..."
//                 className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all duration-200 border border-transparent focus:border-emerald-200"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </motion.div>
//           </div>
          
//           <div className="flex-1 overflow-y-auto">
//             <AnimatePresence>
//               {filteredConversations.map((conversation, index) => (
//                 <motion.div
//                   key={conversation.id}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   transition={{ delay: index * 0.05 }}
//                   whileHover={{ 
//                     backgroundColor: "rgba(249, 250, 251, 0.8)",
//                     scale: 1.02,
//                   }}
//                   whileTap={{ scale: 0.98 }}
//                   className={`border-b border-gray-100 p-4 cursor-pointer flex items-start gap-3 transition-all duration-200 ${
//                     activeChat?.id === conversation.id ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200' : ''
//                   }`}
//                   onClick={() => selectChat(conversation)}
//                 >
//                   <div className="relative">
//                     <motion.img
//                       src={conversation.user.avatar}
//                       alt={conversation.user.name}
//                       className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
//                       whileHover={{ scale: 1.05 }}
//                     />
//                     <motion.div 
//                       className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
//                         conversation.user.isOnline ? 'bg-green-500' : 'bg-gray-400'
//                       }`}
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       transition={{ delay: 0.3 }}
//                     />
//                   </div>
                  
//                   <div className="flex-1 min-w-0">
//                     <div className="flex justify-between items-start">
//                       <h3 className="font-semibold text-gray-900 truncate">{conversation.user.name}</h3>
//                       <span className="text-xs text-gray-500 whitespace-nowrap">{conversation.lastActive}</span>
//                     </div>
                    
//                     <div className="flex items-center gap-1 mt-1">
//                       <span className="text-xs text-gray-500 flex items-center gap-1">
//                         <FiUser className="w-3 h-3" /> {conversation.user.role}
//                       </span>
//                       <span className="text-xs text-gray-500">•</span>
//                       <span className="text-xs text-emerald-600 flex items-center gap-1">
//                         <FiHeart className="w-3 h-3" /> {conversation.pet.name}
//                       </span>
//                     </div>
                    
//                     <p className="text-sm text-gray-500 truncate mt-1">
//                       {conversation.isTyping ? (
//                         <span className="text-emerald-600 italic">Typing...</span>
//                       ) : (
//                         conversation.messages[conversation.messages.length - 1].text
//                       )}
//                     </p>
//                   </div>
                  
//                   {conversation.unread > 0 && (
//                     <motion.div 
//                       className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-xs text-white font-medium shadow-lg"
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       whileHover={{ scale: 1.1 }}
//                     >
//                       {conversation.unread}
//                     </motion.div>
//                   )}
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         </motion.div>
        
//         {/* Chat Area */}
//         <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden lg:flex' : 'flex'}`}>
//           {activeChat ? (
//             <motion.div 
//               className="flex flex-col h-full"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               {/* Chat Header */}
//               <div className="border-b border-gray-200 p-4 bg-white/90 backdrop-blur-sm flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <motion.button 
//                     onClick={() => setActiveChat(null)} 
//                     className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <FiX className="w-5 h-5 text-gray-600" />
//                   </motion.button>
                  
//                   <div className="flex items-center gap-3">
//                     <motion.img
//                       src={activeChat.user.avatar}
//                       alt={activeChat.user.name}
//                       className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-200"
//                       whileHover={{ scale: 1.05 }}
//                     />
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{activeChat.user.name}</h3>
//                       <div className="flex items-center gap-2">
//                         <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full font-medium">
//                           {activeChat.user.role}
//                         </span>
//                         <span className="text-xs text-gray-500 flex items-center gap-1">
//                           <FiMapPin className="w-3 h-3" /> {activeChat.user.location}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <motion.button 
//                     className="p-2 rounded-full hover:bg-gray-100 transition-colors text-emerald-600"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <FiPhone className="w-5 h-5" />
//                   </motion.button>
//                   <motion.button 
//                     className="p-2 rounded-full hover:bg-gray-100 transition-colors text-emerald-600"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <FiVideo className="w-5 h-5" />
//                   </motion.button>
//                   <motion.button 
//                     className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <FiMoreVertical className="w-5 h-5 text-gray-600" />
//                   </motion.button>
//                 </div>
//               </div>
              
//               {/* Pet Info Bar */}
//               <motion.div 
//                 className="bg-gradient-to-r from-emerald-50 via-white to-green-50 border-b border-emerald-200 p-4 flex items-center gap-4"
//                 initial={{ y: -10, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.1 }}
//               >
//                 <motion.img
//                   src={activeChat.pet.image}
//                   alt={activeChat.pet.name}
//                   className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
//                   whileHover={{ scale: 1.05 }}
//                 />
//                 <div className="flex-1">
//                   <h4 className="font-semibold text-gray-900">{activeChat.pet.name}</h4>
//                   <p className="text-sm text-gray-600">{activeChat.pet.breed} • {activeChat.pet.age}</p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="text-xs text-gray-500 flex items-center gap-1">
//                     <FiClock className="w-3 h-3" /> {activeChat.pet.status}
//                   </span>
//                   <motion.button 
//                     className="text-xs bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1.5 rounded-full hover:from-emerald-600 hover:to-green-600 transition-all shadow-md"
//                     whileHover={{ scale: 1.05, y: -1 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     View Profile
//                   </motion.button>
//                 </div>
//               </motion.div>
              
//               {/* Messages Area */}
//               <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white via-gray-50/30 to-emerald-50/20">
//                 <div className="max-w-3xl mx-auto space-y-4">
//                   <AnimatePresence>
//                     {activeChat.messages.map((msg) => (
//                       <motion.div
//                         key={msg.id}
//                         initial={{ opacity: 0, y: 20, scale: 0.95 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: -20, scale: 0.95 }}
//                         transition={{ duration: 0.2 }}
//                         className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
//                       >
//                         <motion.div 
//                           className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
//                             msg.sender === 'me' 
//                               ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-br-md' 
//                               : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
//                           }`}
//                           whileHover={{ 
//                             scale: 1.02,
//                             boxShadow: msg.sender === 'me' 
//                               ? '0 8px 25px rgba(16, 185, 129, 0.3)' 
//                               : '0 8px 25px rgba(0, 0, 0, 0.1)'
//                           }}
//                         >
//                           <p className="whitespace-pre-wrap">{msg.text}</p>
//                           <div className={`flex items-center justify-between mt-2 ${
//                             msg.sender === 'me' ? 'text-emerald-100' : 'text-gray-500'
//                           }`}>
//                             <p className="text-xs">{msg.time}</p>
//                             {msg.sender === 'me' && (
//                               <div className="ml-2">
//                                 {getMessageStatusIcon(msg.status)}
//                               </div>
//                             )}
//                           </div>
//                         </motion.div>
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>
//                   <div ref={messagesEndRef} />
//                 </div>
//               </div>
              
//               {/* Message Input */}
//               <motion.div 
//                 className="border-t border-gray-200 p-4 bg-white/90 backdrop-blur-sm"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <div className="max-w-3xl mx-auto flex gap-3">
//                   <div className="flex-1 relative">
//                     <textarea
//                       ref={textareaRef}
//                       value={message}
//                       onChange={(e) => setMessage(e.target.value)}
//                       onKeyPress={handleKeyPress}
//                       placeholder="Type your message..."
//                       className="w-full px-4 py-3 pr-12 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none max-h-32"
//                       rows="1"
//                       style={{ minHeight: '48px' }}
//                     />
//                     <motion.button 
//                       onClick={sendMessage}
//                       className={`absolute right-3 bottom-3 p-2 rounded-full transition-all ${
//                         message.trim() 
//                           ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg hover:from-emerald-600 hover:to-green-600' 
//                           : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                       }`}
//                       disabled={!message.trim()}
//                       whileHover={message.trim() ? { scale: 1.05, y: -1 } : {}}
//                       whileTap={message.trim() ? { scale: 0.95 } : {}}
//                     >
//                       <FiSend className="w-4 h-4" />
//                     </motion.button>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           ) : (
//             <motion.div 
//               className="flex-1 flex flex-col items-center justify-center p-8 text-center"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4 }}
//             >
//               <motion.div 
//                 className="bg-gradient-to-r from-emerald-100 to-green-100 p-8 rounded-full mb-8 shadow-lg"
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//                 whileHover={{ scale: 1.05, rotate: 5 }}
//               >
//                 <FiMessageSquare className="w-16 h-16 text-emerald-600" />
//               </motion.div>
              
//               <motion.h2 
//                 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 Your Messages
//               </motion.h2>
              
//               <motion.p 
//                 className="text-gray-600 max-w-md mb-8 text-lg"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 Select a conversation to start chatting about pet adoption, or start a new conversation with a pet owner or adopter.
//               </motion.p>
              
//               <motion.div 
//                 className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.5 }}
//               >
//                 {[
//                   {
//                     icon: FiUser,
//                     title: "Connect with Owners",
//                     description: "Ask questions about pets you're interested in adopting",
//                     color: "from-blue-500 to-cyan-500"
//                   },
//                   {
//                     icon: FiHeart,
//                     title: "Discuss Adoption",
//                     description: "Arrange meetups and discuss adoption details",
//                     color: "from-pink-500 to-rose-500"
//                   },
//                   {
//                     icon: FiMapPin,
//                     title: "Share Information",
//                     description: "Exchange location and pet care information",
//                     color: "from-emerald-500 to-green-500"
//                   }
//                 ].map((item, index) => (
//                   <motion.div 
//                     key={index}
//                     className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all cursor-pointer"
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.6 + index * 0.1 }}
//                     whileHover={{ y: -5, scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     <motion.div 
//                       className={`bg-gradient-to-r ${item.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg`}
//                       whileHover={{ rotate: 360 }}
//                       transition={{ duration: 0.5 }}
//                     >
//                       <item.icon className="w-7 h-7 text-white" />
//                     </motion.div>
//                     <h3 className="font-semibold text-gray-900 mb-3 text-lg">{item.title}</h3>
//                     <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             </motion.div>
//           )}
//         </div>
//       </div>
    
      
//       {/* Bottom Navigation (Mobile) */}
//       <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
//         <div className="grid grid-cols-3">
//           <button className="py-4 flex flex-col items-center justify-center text-emerald-600">
//             <FiMessageSquare className="w-6 h-6" />
//             <span className="text-xs mt-1">Chats</span>
//           </button>
//           <button className="py-4 flex flex-col items-center justify-center text-gray-500">
//             <FiHeart className="w-6 h-6" />
//             <span className="text-xs mt-1">Pets</span>
//           </button>
//           <button className="py-4 flex flex-col items-center justify-center text-gray-500">
//             <FiUser className="w-6 h-6" />
//             <span className="text-xs mt-1">Profile</span>
//           </button>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// };



import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { 
  FiMessageSquare, FiSend, FiMoreVertical, FiX, FiUser, FiHeart, 
  FiMapPin, FiClock, FiSearch, FiPhone, FiVideo, FiPlusCircle 
} from 'react-icons/fi';
import Navbar from '../../component/Navbar';
import { UserContext } from '../../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import { StreamChat } from 'stream-chat';
import axios from 'axios';

const STREAM_CHAT_API_KEY = 'd2nrfjcvqrjy'; // Replace with your actual API key

const ChatPage = () => {
  const { user } = useContext(UserContext);
  const { channelId } = useParams();
  const navigate = useNavigate();
  
  const [streamClient, setStreamClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState({
    client: true,
    conversations: true,
    messages: true
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  

  // Helper function to safely get the other member in a channel
  const getOtherMember = (channel, currentUserId) => {
    if (!channel?.state?.members) return null;
    
    const members = channel.state.members;
    const membersArray = Array.isArray(members) ? members : Object.values(members);
    
    return membersArray.find(m => m.user_id !== currentUserId);
  };

  // Format channel data for UI display
  const formatConversation = (channel, currentUserId) => {
    const lastMessage = channel.state.messages?.[channel.state.messages.length - 1];
    const otherMember = getOtherMember(channel, currentUserId);
    const petName = channel.data?.name?.replace('Adoption Chat for Pet ', '') || 
                   channel.data?.custom_fields?.pet_name || 
                   'Unknown Pet';
    
    return {
      id: channel.id,
      channel: channel,
      user: {
        id: otherMember?.user_id,
        name: otherMember?.user?.name || 'Unknown User',
        image: otherMember?.user?.image || 'https://via.placeholder.com/150',
        isOnline: otherMember?.user?.online || false
      },
      pet: {
        id: channel.data?.custom_fields?.pet_id,
        name: petName
      },
      lastMessage: lastMessage?.text || 'No messages yet',
      lastMessageTime: lastMessage?.created_at,
      unread: channel.countUnread()
    };
  };

  const checkUserAuth = () => {
    const token = localStorage.getItem('token');
    if (!user?._id || !token) {
      setError("User not logged in");
      setLoading(prev => ({ ...prev, client: false }));
      return false;
    }
    return true;
  };

  // Initialize Stream Chat client
  useEffect(() => {
    const initializeChat = async () => {
      if (!checkUserAuth()) return;
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(prev => ({ ...prev, client: false }));
        setError("User not logged in");
        navigate('/signin');
        return;
      }

      try {
        const chatClient = StreamChat.getInstance(STREAM_CHAT_API_KEY);
        
        // Get chat token from your backend
        const tokenResponse = await axios.post(
          'http://localhost:5000/api/chat/chatToken',
          { userId: user?._id },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        await chatClient.connectUser(
          {
            id: user._id,
            name: user.username || user.email,
            image: user.profilePicture || `https://getstream.io/random_png/?id=${user._id}&name=${user.username || user.email}`,
          },
          tokenResponse.data.token
        );

        setStreamClient(chatClient);
        setLoading(prev => ({ ...prev, client: false }));
      } catch (err) {
        console.error("Failed to initialize chat:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/signin');
        }
        setError("Failed to connect to chat service");
        setLoading(prev => ({ ...prev, client: false }));
      }
    };

    initializeChat();

    return () => {
      if (streamClient) {
        streamClient.disconnectUser().catch(console.error);
      }
    };
  }, [user?._id, navigate]);

  // Load user's conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (!streamClient || !user?._id) return;

      try {
        setLoading(prev => ({ ...prev, conversations: true }));
        
        // Query channels where user is a member
        const channels = await streamClient.queryChannels(
          { members: { $in: [user._id] } },
          { last_message_at: -1 },
          { 
            watch: true,
            state: true
          }
        );

        const formattedConversations = channels.map(channel => 
          formatConversation(channel, user._id)
        );

        setConversations(formattedConversations);
      } catch (err) {
        console.error("Failed to load conversations:", err);
        setError("Failed to load conversations");
      } finally {
        setLoading(prev => ({ ...prev, conversations: false }));
      }
    };

    if (streamClient) {
      loadConversations();
    }
  }, [streamClient, user?._id]);

  // Load specific channel when channelId changes
  useEffect(() => {
    const loadChannel = async () => {
      if (!streamClient) {
        setActiveChannel(null);
        setMessages([]);
        return;
      }

      try {
        setLoading(prev => ({ ...prev, messages: true }));
        
        if (channelId) {
          const channel = streamClient.channel('messaging', channelId);
          await channel.watch();
          
          // Set initial messages
          setMessages(channel.state.messages || []);
          setActiveChannel(channel);
          
          // Add message listener
          const handleMessage = (event) => {
            setMessages(prev => [...prev, event.message]);
          };

          channel.on('message.new', handleMessage);
          
          // Add message updated listener (for status changes)
          const handleMessageUpdated = (event) => {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === event.message.id ? event.message : msg
              )
            );
          };
          
          channel.on('message.updated', handleMessageUpdated);
          
          return () => {
            channel.off('message.new', handleMessage);
            channel.off('message.updated', handleMessageUpdated);
          };
        } else {
          setActiveChannel(null);
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to load channel:", err);
        setError("Failed to load chat");
      } finally {
        setLoading(prev => ({ ...prev, messages: false }));
      }
    };

    loadChannel();
  }, [streamClient, channelId]);

  // Auto scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageInput]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChannel) return;

    try {
      await activeChannel.sendMessage({
        text: messageInput.trim(),
      });
      setMessageInput('');
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message");
    }
  };

  // Create new channel (for the "New Chat" button)
  const createNewChannel = async (petId, otherUserId) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/chat/create-channel',
        {
          petId,
          requesterId: user._id,
          ownerId: otherUserId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      navigate(`/chat/${response.data.channelId}`);
    } catch (err) {
      console.error("Failed to create channel:", err);
      setError("Failed to start new chat");
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.pet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading.client && !streamClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Connecting to chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to access chat.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row h-[calc(100vh-80px)]">
          {/* Sidebar - Conversation List */}
          <div className={`lg:w-1/3 xl:w-1/4 border-r border-gray-200 bg-white/80 backdrop-blur-sm flex flex-col ${channelId ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => navigate(-1)} 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Messages
                </h1>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => {/* Implement new chat modal */}}
                >
                  <FiPlusCircle className="w-5 h-5 text-emerald-600" />
                </button>
              </div>
              
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading.conversations ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading conversations...</p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredConversations.map(conv => (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className={`border-b border-gray-100 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        channelId === conv.id ? 'bg-emerald-50' : ''
                      }`}
                      onClick={() => navigate(`/chat/${conv.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={conv.user.image}
                            alt={conv.user.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          {conv.user.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="font-semibold text-gray-900 truncate">{conv.user.name}</h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-emerald-600 flex items-center gap-1">
                              <FiHeart className="w-3 h-3" /> {conv.pet.name}
                            </span>
                            {conv.unread > 0 && (
                              <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {conv.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
          
          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${!channelId ? 'hidden lg:flex' : 'flex'}`}>
            {channelId ? (
              loading.messages ? (
                <div className="flex-1 flex items-center justify-center">
                  <p>Loading chat...</p>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="border-b border-gray-200 p-4 bg-white/90 backdrop-blur-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => navigate('/chat')}
                        className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <FiX className="w-5 h-5 text-gray-600" />
                      </button>
                      
                      <div className="flex items-center gap-3">
                        <img
                          src={getOtherMember(activeChannel, user._id)?.user?.image || 'https://via.placeholder.com/150'}
                          alt="User"
                          className="w-10 h-10 rounded-full object-cover border-2 border-emerald-100"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {getOtherMember(activeChannel, user._id)?.user?.name || 'Unknown User'}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {activeChannel?.data?.name?.replace('Adoption Chat for Pet ', '') || 'Pet Chat'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-full hover:bg-gray-100 text-emerald-600 transition-colors">
                        <FiPhone className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-100 text-emerald-600 transition-colors">
                        <FiVideo className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <FiMoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white via-gray-50/30 to-emerald-50/20">
                    <div className="max-w-3xl mx-auto space-y-4">
                      {messages.length === 0 && !loading.messages && (
                        <div className="text-center text-gray-500 py-8">
                          Start your conversation about pet adoption!
                        </div>
                      )}
                      {messages.map(msg => {
                        const isCurrentUser = msg.user.id === user._id;
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <motion.div 
                              className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
                                isCurrentUser 
                                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-br-none' 
                                  : 'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
                              }`}
                              whileHover={{ 
                                scale: 1.02,
                                boxShadow: isCurrentUser 
                                  ? '0 8px 25px rgba(16, 185, 129, 0.3)' 
                                  : '0 8px 25px rgba(0, 0, 0, 0.1)'
                              }}
                            >
                              {!isCurrentUser && (
                                <div className="text-xs font-medium text-gray-500 mb-1">
                                  {getOtherMember(activeChannel, user._id)?.user?.name || 'Unknown User'}
                                </div>
                              )}
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                              <div className={`flex items-center justify-between mt-2 ${
                                isCurrentUser ? 'text-emerald-100' : 'text-gray-500'
                              }`}>
                                <p className="text-xs">
                                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                {isCurrentUser && (
                                  <div className="ml-2 flex items-center gap-1">
                                    {msg.status === 'sending' && (
                                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                                    )}
                                    {msg.status === 'delivered' && (
                                      <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                                    )}
                                    {msg.status === 'read' && (
                                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                    )}
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          </motion.div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                  
                  {/* Message Input */}
                  <div className="border-t border-gray-200 p-4 bg-white/90 backdrop-blur-sm">
                    <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex gap-3">
                      <div className="flex-1 relative">
                        <textarea
                          ref={textareaRef}
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage(e);
                            }
                          }}
                          placeholder="Type your message..."
                          className="w-full px-4 py-3 pr-12 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none max-h-32"
                          rows={1}
                        />
                        <button
                          type="submit"
                          disabled={!messageInput.trim()}
                          className={`absolute right-3 bottom-3 p-2 rounded-full transition-all ${
                            messageInput.trim()
                              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg hover:from-emerald-600 hover:to-green-600'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <FiSend className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )
            ) : (
              <motion.div 
                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div 
                  className="bg-gradient-to-r from-emerald-100 to-green-100 p-8 rounded-full mb-8 shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <FiMessageSquare className="w-16 h-16 text-emerald-600" />
                </motion.div>
                
                <motion.h2 
                  className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Your Messages
                </motion.h2>
                
                <motion.p 
                  className="text-gray-600 max-w-md mb-8 text-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Select a conversation to start chatting about pet adoption, or start a new conversation with a pet owner or adopter.
                </motion.p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;