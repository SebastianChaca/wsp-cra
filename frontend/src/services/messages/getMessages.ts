import { createAsyncThunk } from '@reduxjs/toolkit';
import { makePrivateRequest } from '../makePrivateRequest';
import { serverMessageResponse } from '../../types/message/message';
import { sanitizeMessages } from '../../utils/sanitizeMessages';

export const getMessages = createAsyncThunk(
  'chat/messages',
  async (uid: string) => {
    const response = await makePrivateRequest<serverMessageResponse[]>(
      `/message/${uid}`
    );

    // TODO: mover a redux
    const sanitMessages = sanitizeMessages(response);

    return sanitMessages;
  }
);
