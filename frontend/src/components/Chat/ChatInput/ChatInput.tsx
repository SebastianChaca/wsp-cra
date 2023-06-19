import React, { useState, useEffect, useRef } from 'react';
import { Box, Input, Flex } from '@chakra-ui/react';
import { useAppSelector } from '../../../redux/hooks';
import useInputSocket from '../../../socket/hooks/useInputSocket';
import FriendRequest from '../Messages/FriendRequest/FriendRequest';

const ChatInput = () => {
  const [message, setMessage] = useState<string>('');
  const { activeChat, messages } = useAppSelector((state) => state.chatSlice);
  const { setTypingEvent, submitEvent, seenEvent } = useInputSocket(message);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMessage('');
    inputRef.current?.focus();
  }, [activeChat.uid]);

  useEffect(() => {
    // marcar mensaje como visto
    seenEvent();
  }, [activeChat.uid, messages.length, seenEvent]);

  useEffect(() => {
    // evento para saber si estoy escribiendo
    setTypingEvent();
  }, [message, setTypingEvent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.length === 0) return;
    // mando mensaje por socket event
    submitEvent();
    setMessage('');
  };
  return (
    <div>
      {/* <FriendRequest /> */}
      <Box borderTop=" 1px solid #c4c4c4" bg="gray.300" h="80px" p="20px">
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Escribe un mensaje aquí"
            ref={inputRef}
            variant="unstyled"
            bg="#E2E8F0"
            p="8px"
            value={message}
            onChange={handleChange}
          />
        </form>
      </Box>
    </div>
  );
};

export default ChatInput;
