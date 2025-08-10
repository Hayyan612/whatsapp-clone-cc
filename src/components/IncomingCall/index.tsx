import React from "react";
import { CometChatIncomingCall } from "@cometchat/chat-uikit-react";
type IncomingCallProps = {
  activeCall: CometChat.Call;
};
const IncomingCall: React.FC<IncomingCallProps> = ({ activeCall }) => {
  return <CometChatIncomingCall call={activeCall} />;
};

export default IncomingCall;
