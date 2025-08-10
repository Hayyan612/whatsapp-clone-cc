import {
  CometChatUIKit,
  UIKitSettingsBuilder,
} from "@cometchat/chat-uikit-react";

const appID = import.meta.env.VITE_APP_ID;
const region = import.meta.env.VITE_REGION;
const authKey = import.meta.env.VITE_AUTH_KEY;

const COMETCHAT_CONSTANTS = {
  APP_ID: appID,
  REGION: region,
  AUTH_KEY: authKey,
};

const UIKitSettings = new UIKitSettingsBuilder()
  .setAppId(COMETCHAT_CONSTANTS.APP_ID)
  .setRegion(COMETCHAT_CONSTANTS.REGION)
  .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
  .subscribePresenceForAllUsers()
  .build();

export const initializeCometChat = async () => {
  return await CometChatUIKit.init(UIKitSettings);
};
