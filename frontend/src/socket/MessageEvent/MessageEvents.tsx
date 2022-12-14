import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  setIsTyping,
  setMessages,
  updateNotifications,
  updateSeenMessages,
} from "../../redux/chat/chatSlice";
import { useSocketContext } from "../SocketContext/SocketContext";
import { serverMessageResponse, message } from "../../types/message/message";

import {
  sanitizeMessages,
  sanitizeMessage,
} from "../../utils/sanitizeMessages";

interface Props {
  children?: JSX.Element | JSX.Element[];
}
const MessageEvents = ({ children }: Props) => {
  const { socket } = useSocketContext();
  const { activeChat } = useAppSelector((state) => state.chatSlice);

  const dispatch = useAppDispatch();

  //mensaje personal
  useEffect(() => {
    socket?.on("personal-message", (message: serverMessageResponse) => {
      const sanitMsg = sanitizeMessage(message);

      dispatch(setMessages(sanitMsg));

      dispatch(updateNotifications(sanitMsg));
    });
  }, [socket, dispatch]);

  //marco si el usuario esta escribiendo un mensaje
  useEffect(() => {
    socket?.on("typing", (message: message) => {
      dispatch(setIsTyping(message));
    });
  }, [socket, dispatch, activeChat.uid]);

  //marco como visto el mensaje
  useEffect(() => {
    socket?.on("seen-messages", (messages: serverMessageResponse[]) => {
      const sanitize = sanitizeMessages(messages);
      dispatch(updateSeenMessages(sanitize.reverse()));
    });
  }, [socket, activeChat.uid, dispatch]);

  return <>{children}</>;
};

export default MessageEvents;
