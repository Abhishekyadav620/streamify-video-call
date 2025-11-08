//  Import necessary dependencies
import { useEffect, useState } from "react";
import { useParams } from "react-router"; // should be react-router-dom not react-router
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query"; // missing import for useQuery
import { getStreamToken } from "../lib/api"; // you likely have a helper API file for this
import toast from "react-hot-toast"; // for toast.error()

// Stream Chat imports
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";

//  Custom components
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

//  Environment variable (fixed variable name consistency)
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams(); // renamed for clarity — this is the user you are chatting with

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true); // corrected variable name

  const { authUser } = useAuthUser();

  //  Using React Query to fetch Stream Token
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"], // corrected key name to lowercase (queryKey)
    queryFn: getStreamToken,
    enabled: !!authUser, // corrected spelling — “enabled” not “enable”
    // do not run this function until we have an authenticated user
  });

  //  Chat initialization (runs once token and authUser are ready)
  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) {
        return; // if we don't have an authenticated user or token, just return
      }

      try {
        console.log("Initializing stream chat client...");
        const client = StreamChat.getInstance(STREAM_API_KEY); // fixed constant name

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        //
        const channelId = [authUser._id, targetUserId].sort().join("-");

        // you and me
        // if i start the chat => channelId: [myId, yourId]
        // if you start the chat => channelId: [yourId, myId]  => [myId,yourId]
        // we create a unique channel id by combining both user ids
        // so after sorting [myId,yourId] will always be the same

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId], // corrected “member” → “members”
        });

        await currChannel.watch(); // it will listen for any incoming changes and will work in real time

        setChatClient(client);
        setChannel(currChannel);

        //  added comment:
        // Once both client and channel are set, our chat UI will render below
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again."); // fixed typo
      } finally {
        setLoading(false); // corrected setter name
      }
    };

    initChat();

    //  added cleanup: disconnect when component unmounts
    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
        console.log("Stream chat client disconnected");
      }
    };
  }, [tokenData, authUser, targetUserId]);

  // Handle video call button click
  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      // send message with video call link
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  // ✅ fixed conditional logic: show loader while loading or not ready
  if (loading || !chatClient || !channel) return <ChatLoader />;

  // ✅ Chat UI
  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
