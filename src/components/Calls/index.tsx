import { CometChatCallLogs } from "@cometchat/chat-uikit-react";

const CallLogDemo = () => {
  return <CometChatCallLogs />;
};

export default CallLogDemo;

// import React, {
//   useCallback,
//   useEffect,
//   useState,
//   useImperativeHandle,
//   forwardRef,
// } from "react";

// import { createPortal } from "react-dom";
// import { CometChatIncomingCall } from "@cometchat/chat-uikit-react";
// import CometChat, { CometChat as CometUtility } from "@cometchat/chat-sdk-javascript";
// import { CometChatCalls } from "@cometchat/calls-sdk-javascript";
// import { appStore } from "../../../../Services/store";
// import styles from "./composer.module.css";

// export type TEntitiesType = {
//   receiverId: string;
//   callType: string;
//   receiverType: string;
// };

// export type TCallSettings = {
//   activeItem: CometChat.Conversation | CometChat.User | CometChat.Group | undefined;
//   onInitiateCall: (value: boolean) => void;
//   isCallInitiated: boolean;
//   user: CometChat.User;
//   group: CometChat.Group;
// };

// export const CallSettingsBuilder = forwardRef((props: TCallSettings, ref) => {
//   const { activeItem } = props;
//   const rootElement = document.getElementById("root");

//   const [sessionId, setSessionId] = useState<string>();
//   const [entitiesId, setEntitiesId] = useState<TEntitiesType>({} as TEntitiesType);

//   const listenerID = `call-${new Date().getUTCSeconds()}`;
//   const auth_token: string = appStore?.getValue("cc_auth_token") || "";

//   useImperativeHandle(ref, () => ({
//     initiateCall: (type: string) => handleInitiateCall(type),
//   }));

//   const handleInitiateCall = async (type: string) => {
//     try {
//       await cleanupCall();
//       if (!activeItem) throw new Error("No receiver selected");

//       let receiverId = "";
//       let receiverType = "";

//       if ("uid" in activeItem) {
//         receiverType = CometUtility.RECEIVER_TYPE.USER;
//         receiverId = (activeItem as CometChat.User).getUid();
//       } else if ("guid" in activeItem) {
//         receiverType = CometUtility.RECEIVER_TYPE.GROUP;
//         receiverId = activeItem.getGuid();
//       }

//       const call = new CometUtility.Call(receiverId, type, receiverType);
//       const outGoingCall = await CometUtility.initiateCall(call);

//       setEntitiesId({ receiverId, receiverType, callType: type });
//       startCallSession(outGoingCall.getSessionId());
//       props.onInitiateCall(true);
//     } catch (err: any) {
//       console.error("Call initiation error:", err);
//       alert(err.message || "Call failed");
//     }
//   };

//   const startCallSession = useCallback(
//     (currentSessionId: string) => {
//       setSessionId(currentSessionId);
//       if (!currentSessionId) return;

//       const htmlElement = document.getElementById("callId");
//       if (!htmlElement) return;

//       const audioOnly = entitiesId.callType === CometUtility.CALL_TYPE.AUDIO;

//       const callSettings = new CometChatCalls.CallSettingsBuilder()
//         .enableDefaultLayout(true)
//         .setIsAudioOnlyCall(audioOnly)
//         .startRecordingOnCallStart(true)
//         .setCallListener({
//           onCallEnded: cleanupCall,
//           onCallEndButtonPressed: cleanupCall,
//           onUserLeft: cleanupCall,
//           onError: (error) => console.error("Call error:", error),
//           onUserListUpdated: (users) => console.log("Users:", users),
//           onUserJoined: (user) => console.log("User joined:", user),
//         })
//         .build();

//       CometChatCalls.generateToken(currentSessionId, auth_token).then(
//         (res) => {
//           CometChatCalls.startSession(res.token, callSettings, htmlElement);
//         },
//         (err) => console.error("Token error:", err)
//       );
//     },
//     [sessionId, entitiesId.callType]
//   );

//   const cleanupCall = async () => {
//     try {
//       if (sessionId) await CometUtility.endCall(sessionId);
//     } catch (e) {
//       console.error("Cleanup error:", e);
//     }

//     setSessionId(undefined);
//     setEntitiesId({} as TEntitiesType);
//     props.onInitiateCall(false);
//     CometUtility.clearActiveCall();
//     CometChatCalls.endSession();
//     stopRingingAndReleaseDevices();
//     CometUtility.removeCallListener(listenerID);
//   };

//   const stopRingingAndReleaseDevices = () => {
//     ["video", "audio"].forEach((tag) => {
//       document.querySelectorAll(tag).forEach((el: any) => {
//         if (el.srcObject instanceof MediaStream) {
//           el.srcObject.getTracks().forEach((track: MediaStreamTrack) => track.stop());
//           el.srcObject = null;
//         }
//       });
//     });
//   };

//   useEffect(() => {
//     CometUtility.addCallListener(
//       listenerID,
//       new CometUtility.CallListener({
//         onIncomingCallReceived: (call: any) => {
//           stopRingingAndReleaseDevices();
//           console.log("Incoming Call Session", call);
//         },
//         onOutgoingCallAccepted: (call: any) => console.log("[Outgoing Call Session]", call),
//         onOutgoingCallRejected: cleanupCall,
//         onIncomingCallCancelled: () => {},
//         onCallEndedMessageReceived: cleanupCall,
//       })
//     );

//     return () => CometUtility.removeCallListener(listenerID);  // --
//   }, [listenerID]);

//   return (
//     <>
//       <CometChatIncomingCall />
//       {rootElement &&
//         createPortal(
//           <div
//             id="callId"
//             className={sessionId ? styles.videoContainer : ""}
//           />,
//           rootElement
//         )}
//     </>
//   );
// });
