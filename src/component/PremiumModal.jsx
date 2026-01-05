import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Crown, Zap, ShieldCheck } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";

const PremiumModal = ({ isOpen, onClose, featureSource }) => {
  const trackAction = async ({ action, plan = null }) => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        featureTriggered: featureSource,
        action,
        // hasOpenedModal: action === "open",
        selectedPlan: plan,
        // isConverted: false,
        // isDeclined: false,
      };

      if (action === "select_plan") {
        alert(
          "Terima kasih atas minat Anda! Fitur ini sedang dalam pengembangan.",
        );
        onClose();
        // payload.selectedPlan = plan;
        // payload.isConverted = true;
      }

      // if (action === "decline") {
      //   payload.isDeclined = true;
      // }

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/fake-door/track`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // if (payload.isConverted) {
      //   alert(
      //     "Terima kasih atas minat Anda! Fitur ini sedang dalam pengembangan.",
      //   );
      //   onClose();
      // }
    } catch (err) {
      console.error("Tracking failed", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      trackAction({ action: "open" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
        >
          <button
            onClick={() => {
              onClose();
            }}
            className="absolute top-4 right-4 rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          {/* Close Button */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-yellow-100 rounded-2xl mb-4">
                <Crown className="text-yellow-600" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                Buka Potensi Pat-A-Pet
              </h2>
              <p className="text-gray-500 mt-2">
                Pilih paket yang sesuai untuk kenyamanan anabulmu
              </p>
              <p className="text-sm text-orange-600 mt-4 font-medium bg-orange-50 inline-block px-3 py-1 rounded-lg">
                Fitur ini sedang dalam pengembangan. Minat Anda membantu kami
                memprioritaskan!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Plan */}
              <div className="border-2 border-gray-100 rounded-2xl p-6 hover:border-[#A0C878] transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl">Basic</h3>
                    <p className="text-2xl font-black mt-2">
                      Rp 20.000
                      <span className="text-sm font-normal text-gray-400">
                        /bln
                      </span>
                    </p>
                  </div>
                  <Zap
                    className="text-gray-300 group-hover:text-[#A0C878]"
                    size={24}
                  />
                </div>
                <ul className="space-y-3 mb-8 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-[#A0C878]" /> Unlimited
                    Chat
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-[#A0C878]" /> Verified
                    Badge
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-[#A0C878]" /> Priority
                    Listring
                  </li>
                  {/* <li className="flex items-center gap-2 text-gray-300"> */}
                  {/*   <X size={16} /> Priority Listing */}
                  {/* </li> */}
                </ul>
                <button
                  onClick={() =>
                    trackAction({ action: "select_plan", plan: "basic" })
                  }
                  className="w-full py-3 rounded-xl bg-gray-100 text-gray-800 font-bold hover:bg-[#A0C878] hover:text-white transition-all cursor-pointer"
                >
                  Pilih Basic
                </button>
              </div>

              {/* Pro Plan */}
              <div className="border-2 border-[#A0C878] bg-[#A0C878]/5 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#A0C878] text-white text-[10px] px-3 py-1 rounded-bl-lg font-bold">
                  REKOMENDASI
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">Pro</h3>
                    <p className="text-2xl font-black mt-2 text-[#A0C878]">
                      Rp 50.000
                      <span className="text-sm font-normal text-gray-400">
                        /bln
                      </span>
                    </p>
                  </div>
                  <ShieldCheck className="text-[#A0C878]" size={24} />
                </div>
                <ul className="space-y-3 mb-8 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-[#A0C878]" /> Semua Fitur
                    Basic
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-[#A0C878]" /> Diiklankan
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-[#A0C878]" /> Video Upload
                    Post
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={16} className="text-[#A0C878]" /> Recommender
                    System
                  </li>
                </ul>
                <button
                  onClick={() =>
                    trackAction({ action: "select_plan", plan: "pro" })
                  }
                  className="w-full py-3 rounded-xl bg-[#A0C878] text-white font-bold hover:shadow-lg transition-all cursor-pointer"
                >
                  Pilih Pro
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                trackAction({ action: "decline" });
                onClose();
              }}
              className="w-full text-center mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              Nanti Saja
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PremiumModal;
