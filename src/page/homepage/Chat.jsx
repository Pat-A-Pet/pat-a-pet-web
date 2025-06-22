import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import {
  FiMessageSquare,
  FiSend,
  FiMoreVertical,
  FiX,
  FiUser,
  FiHeart,
  FiMapPin,
  FiClock,
  FiSearch,
  FiPhone,
  FiVideo,
  FiPlusCircle,
} from "react-icons/fi";
import Navbar from "../../component/Navbar";
import { UserContext } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { StreamChat } from "stream-chat";
import axios from "axios";

const STREAM_CHAT_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { user, loading: userLoading } = useContext(UserContext);
  const { channelId } = useParams();
  const navigate = useNavigate();

  const [streamClient, setStreamClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState({
    client: true,
    conversations: true,
    messages: true,
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const getOtherMember = (channel, currentUserId) => {
    if (!channel?.state?.members) return null;
    const members = channel.state.members;
    const membersArray = Array.isArray(members)
      ? members
      : Object.values(members);
    return membersArray.find((m) => m.user.id !== currentUserId);
  };

  const formatConversation = (channel, currentUserId) => {
    const lastMessage =
      channel.state.messages?.[channel.state.messages.length - 1];
    const otherMember = getOtherMember(channel, currentUserId);
    const petName =
      channel.data?.name?.replace("Adoption Chat for Pet ", "") ||
      channel.data?.custom_fields?.pet_name ||
      "Unknown Pet";

    return {
      id: channel.id,
      channel: channel,
      user: {
        id: otherMember?.user.id,
        name: otherMember?.user?.name || "Unknown User",
        image:
          otherMember?.user?.image ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(otherMember?.user?.name || "Unknown")}&background=random`,
        isOnline: otherMember?.user?.online || false,
      },
      pet: {
        id: channel.data?.custom_fields?.pet_id,
        name: petName,
      },
      lastMessage: lastMessage?.text || "No messages yet",
      lastMessageTime: lastMessage?.created_at,
      unread: channel.countUnread(),
    };
  };

  // Initialize Stream Chat client - FIXED VERSION
  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("token");

    const initializeChat = async () => {
      if (!user?.id || !token) {
        if (isMounted) {
          setLoading((prev) => ({ ...prev, client: false }));
          if (!token) setError("User not logged in");
        }
        return;
      }

      try {
        // Skip if already connected with the same user
        if (streamClient?.user?.id === user.id) {
          if (isMounted) setLoading((prev) => ({ ...prev, client: false }));
          return;
        }

        console.log("Initializing Stream Chat for user:", user.id);

        const chatClient = StreamChat.getInstance(STREAM_CHAT_API_KEY);

        // Get Stream Chat token from your backend
        const tokenResponse = await axios.post(
          "http://localhost:5000/api/chat/chatToken",
          { userId: user.id },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        console.log("Got Stream token, connecting user...");

        // Connect user to Stream Chat
        await chatClient.connectUser(
          {
            id: user.id,
            name: user.fullname || user.email,
            image:
              user.profilePicture ||
              `https://getstream.io/random_png/?id=${user.id}&name=${user.fullname || user.email}`,
          },
          tokenResponse.data.token,
        );

        console.log("Stream Chat connected successfully");

        if (isMounted) {
          setStreamClient(chatClient);
          setLoading((prev) => ({ ...prev, client: false }));
        }
      } catch (err) {
        console.error("Failed to initialize chat:", err);
        if (isMounted) {
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/signin");
          }
          setError(`Failed to connect to chat service: ${err.message}`);
          setLoading((prev) => ({ ...prev, client: false }));
        }
      }
    };

    // Only initialize if user is loaded and not already loading
    if (!userLoading && user) {
      initializeChat();
    }

    return () => {
      isMounted = false;
      // Cleanup will be handled by the disconnect effect below
    };
  }, [user?.id, navigate, userLoading]);

  // Cleanup effect for Stream client
  useEffect(() => {
    return () => {
      if (streamClient && streamClient.userID) {
        console.log("Disconnecting Stream Chat client");
        streamClient.disconnectUser().catch(console.error);
      }
    };
  }, [streamClient]);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      if (!streamClient || !streamClient.userID || !user?.id) {
        console.log("Skipping conversation load - client or user not ready");
        return;
      }

      try {
        console.log("Loading conversations for user:", user.id);
        setLoading((prev) => ({ ...prev, conversations: true }));

        const channels = await streamClient.queryChannels(
          { members: { $in: [user.id] } },
          { last_message_at: -1 },
          { watch: true, state: true },
        );

        console.log("Loaded channels:", channels.length);

        const formattedConversations = channels.map((channel) =>
          formatConversation(channel, user.id),
        );

        setConversations(formattedConversations);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Failed to load conversations:", err);
        setError("Failed to load conversations");
      } finally {
        setLoading((prev) => ({ ...prev, conversations: false }));
      }
    };

    loadConversations();
  }, [streamClient, user?.id]);

  // Load specific channel
  useEffect(() => {
    const loadChannel = async () => {
      if (!streamClient || !streamClient.userID) {
        console.log("Stream client not ready for channel load");
        setActiveChannel(null);
        setMessages([]);
        setLoading((prev) => ({ ...prev, messages: false }));
        return;
      }

      try {
        setLoading((prev) => ({ ...prev, messages: true }));

        if (channelId) {
          console.log("Loading channel:", channelId);

          const channel = streamClient.channel("messaging", channelId);
          await channel.watch();

          console.log(
            "Channel loaded, messages:",
            channel.state.messages?.length || 0,
          );

          setMessages(channel.state.messages || []);
          setActiveChannel(channel);

          // Set up real-time message listeners
          const handleMessage = (event) => {
            console.log("New message received:", event.message);
            setMessages((prev) => [...prev, event.message]);
          };

          const handleMessageUpdated = (event) => {
            console.log("Message updated:", event.message);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === event.message.id ? event.message : msg,
              ),
            );
          };

          channel.on("message.new", handleMessage);
          channel.on("message.updated", handleMessageUpdated);

          // Return cleanup function
          return () => {
            console.log("Cleaning up channel listeners");
            channel.off("message.new", handleMessage);
            channel.off("message.updated", handleMessageUpdated);
          };
        } else {
          setActiveChannel(null);
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to load channel:", err);
        setError(`Failed to load chat: ${err.message}`);
      } finally {
        setLoading((prev) => ({ ...prev, messages: false }));
      }
    };

    loadChannel();
  }, [streamClient, channelId, user?.id]);

  // Auto scroll and textarea resize effects
  useEffect(() => scrollToBottom(), [messages]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageInput]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChannel) return;

    try {
      console.log("Sending message:", messageInput.trim());
      await activeChannel.sendMessage({ text: messageInput.trim() });
      setMessageInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message");
    }
  };

  // Create new channel function (you can uncomment and modify as needed)
  const createNewChannel = async (petId, otherUserId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat/create-channel",
        { petId, requesterId: user.id, ownerId: otherUserId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      navigate(`/chat/${response.data.channelId}`);
    } catch (err) {
      console.error("Failed to create channel:", err);
      setError("Failed to start new chat");
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.pet.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
          <button
            onClick={() => navigate("/signin")}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading states
  if ((loading.client && !streamClient) || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{userLoading ? "Loading user data..." : "Connecting to chat..."}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col">
        <p>Please log in to access chat.</p>
        <button
          onClick={() => navigate("/signin")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row h-[calc(100vh-80px)]">
          {/* Sidebar - Conversation List */}
          <div
            className={`lg:w-1/3 xl:w-1/4 border-r border-gray-200 bg-white/80 backdrop-blur-sm flex flex-col ${channelId ? "hidden lg:flex" : "flex"}`}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                {/* <button */}
                {/*   onClick={() => navigate(-1)} */}
                {/*   className="p-2 rounded-full hover:bg-gray-100 transition-colors" */}
                {/* > */}
                {/*   <ArrowLeft className="w-5 h-5 text-gray-600" /> */}
                {/* </button> */}
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Messages
                </h1>
                {/* <button */}
                {/*   className="p-2 rounded-full hover:bg-gray-100 transition-colors" */}
                {/*   onClick={() => { */}
                {/*     // You can implement new chat modal here */}
                {/*     console.log("New chat clicked"); */}
                {/*   }} */}
                {/* > */}
                {/*   <FiPlusCircle className="w-5 h-5 text-emerald-600" /> */}
                {/* </button> */}
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
              ) : filteredConversations.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center p-4">
                  <div>
                    <FiMessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No conversations yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Start a new chat to begin messaging
                    </p>
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredConversations.map((conv) => (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className={`border-b border-gray-100 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        channelId === conv.id ? "bg-emerald-50" : ""
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
                            <h3 className="font-semibold text-gray-900 truncate">
                              {conv.user.name}
                            </h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {conv.lastMessageTime
                                ? new Date(
                                    conv.lastMessageTime,
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : ""}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {conv.lastMessage}
                          </p>
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
          <div
            className={`flex-1 flex flex-col ${!channelId ? "hidden lg:flex" : "flex"}`}
          >
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
                        onClick={() => navigate("/chat")}
                        className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <FiX className="w-5 h-5 text-gray-600" />
                      </button>

                      <div className="flex items-center gap-3">
                        <img
                          src={
                            getOtherMember(activeChannel, user.id)?.user
                              ?.image || "https://via.placeholder.com/150"
                          }
                          alt="User"
                          className="w-10 h-10 rounded-full object-cover border-2 border-emerald-100"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {getOtherMember(activeChannel, user.id)?.user
                              ?.name || "Unknown User"}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {activeChannel?.data?.name?.replace(
                              "Adoption Chat for Pet ",
                              "",
                            ) || "Pet Chat"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* <div className="flex items-center gap-2"> */}
                    {/*   <button className="p-2 rounded-full hover:bg-gray-100 text-emerald-600 transition-colors"> */}
                    {/*     <FiPhone className="w-5 h-5" /> */}
                    {/*   </button> */}
                    {/*   <button className="p-2 rounded-full hover:bg-gray-100 text-emerald-600 transition-colors"> */}
                    {/*     <FiVideo className="w-5 h-5" /> */}
                    {/*   </button> */}
                    {/*   <button className="p-2 rounded-full hover:bg-gray-100 transition-colors"> */}
                    {/*     <FiMoreVertical className="w-5 h-5 text-gray-600" /> */}
                    {/*   </button> */}
                    {/* </div> */}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white via-gray-50/30 to-emerald-50/20">
                    <div className="max-w-3xl mx-auto space-y-4">
                      {messages.length === 0 && !loading.messages && (
                        <div className="text-center text-gray-500 py-8">
                          Start your conversation about pet adoption!
                        </div>
                      )}
                      {messages.map((msg) => {
                        const isCurrentUser = msg.user.id === user.id;
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                          >
                            <motion.div
                              className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
                                isCurrentUser
                                  ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-br-none"
                                  : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
                              }`}
                              whileHover={{
                                scale: 1.02,
                                boxShadow: isCurrentUser
                                  ? "0 8px 25px rgba(16, 185, 129, 0.3)"
                                  : "0 8px 25px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              {!isCurrentUser && (
                                <div className="text-xs font-medium text-gray-500 mb-1">
                                  {getOtherMember(activeChannel, user.id)?.user
                                    ?.name || "Unknown User"}
                                </div>
                              )}
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                              <div
                                className={`flex items-center justify-between mt-2 ${
                                  isCurrentUser
                                    ? "text-emerald-100"
                                    : "text-gray-500"
                                }`}
                              >
                                <p className="text-xs">
                                  {new Date(msg.created_at).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </p>
                                {isCurrentUser && (
                                  <div className="ml-2 flex items-center gap-1">
                                    {msg.status === "sending" && (
                                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                                    )}
                                    {msg.status === "delivered" && (
                                      <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                                    )}
                                    {msg.status === "read" && (
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
                    <form
                      onSubmit={sendMessage}
                      className="max-w-3xl mx-auto flex gap-3"
                    >
                      <div className="flex-1 relative">
                        <textarea
                          ref={textareaRef}
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
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
                              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg hover:from-emerald-600 hover:to-green-600"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
                  Select a conversation to start chatting about pet adoption, or
                  start a new conversation with a pet owner or adopter.
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
