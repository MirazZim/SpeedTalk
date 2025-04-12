import { MessageSquare } from "lucide-react";
import { useUiStore } from "../../store/useUiStore";

const NoChatSelected = () => {
  const { toggleSidebar } = useUiStore();

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-6 bg-base-100/50 relative">
      {/* Mobile CTA */}
      <div className="lg:hidden flex flex-col items-center space-y-6 text-center max-w-sm">
        <div className="relative animate-bounce">
          <button
            onClick={toggleSidebar}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-lg animate-bounce"
          >
            <MessageSquare className="w-10 h-10 text-primary" />
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-base-content">Welcome to SpeedTalks</h2>
          <p className="text-base-content/60">Tap below to start chatting</p>
        </div>

        <button
          onClick={toggleSidebar}
          className="bg-primary text-white px-6 py-2 rounded-xl shadow-md hover:scale-105 transition-transform"
        >
          Tap here to start chat
        </button>
      </div>

      {/* Desktop Placeholder (optional) */}
      <div className="hidden lg:flex flex-col items-center space-y-4 text-center text-base-content/50 ">
        <MessageSquare className="w-12 h-12  text-primary animate-bounce" />
        <h2 className="text-2xl font-semibold">Welcome to SpeedTalks</h2>
        <p>Select a conversation from the sidebar to start chatting</p>
      </div>
    </div>
  );
};

export default NoChatSelected;
