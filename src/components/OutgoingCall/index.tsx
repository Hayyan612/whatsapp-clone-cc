import React from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatOutgoingCall } from "@cometchat/chat-uikit-react";
import { CometChatUIKitConstants } from "@cometchat/chat-uikit-react";
import "./index.css";

const OutgoingCallScreen = () => {
  const [call, setCall] = React.useState<CometChat.Call>();

  React.useEffect(() => {
    const uid = "uid";

    const callObject = new CometChat.Call(
      uid,
      CometChatUIKitConstants.MessageTypes.audio,
      CometChatUIKitConstants.MessageReceiverType.user
    );
    CometChat.initiateCall(callObject)
      .then((c) => {
        setCall(c);
      })
      .catch(console.log);
  }, []);

  return call ? <CometChatOutgoingCall call={call} /> : null;
};

export default OutgoingCallScreen;
