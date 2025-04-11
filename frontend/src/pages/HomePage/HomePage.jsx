



import { useChatStore } from "../../store/useChatStore";
import Sidebar from "../../components/Sidebar/Sidebar";
import NoChatSelected from "../../components/NoChatSelected/NoChatSelected";
import ChatContainer from "../../components/ChatContainer/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200 overflow-hidden">
      <div className="flex justify-center h-full pt-16 px-4">
        <div className="bg-base-100 mt-2 shadow w-full max-w-6xl h-full">
          <div className="flex h-full mt-3 overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;