const ChatUser = require("../models/usuario");
const Message = require("../models/mensaje");
const dayjs = require("dayjs");

const connectUser = async (uid) => {
  const filter = { _id: uid };
  const update = { online: true };

  return await ChatUser.findOneAndUpdate(filter, update, { new: true });
};

const disconnectUser = async (uid) => {
  const filter = { _id: uid };
  const update = { online: false, lastActive: dayjs() };

  return await ChatUser.findOneAndUpdate(filter, update, { new: true });
};
const getUsers = async () => {
  const users = await ChatUser.find().sort("-online");

  return users;
  //TODO:cambiar el sort para traerlos por ultimos mensajes
};

const saveMessage = async (payload) => {
  try {
    const message = new Message(payload);

    return await message.save();
  } catch (error) {
    return false;
  }
};
const updateSeenMessages = async (messages) => {
  const getMessagesIds = messages.map((msg) => msg.id);

  await Message.updateMany(
    {
      _id: {
        $in: getMessagesIds,
      },
    },
    {
      $set: {
        seen: true,
      },
    }
  );
  const findMessages = await Message.find({ _id: { $in: getMessagesIds } });

  return findMessages;
};

const updateNotificacions = () => {};
module.exports = {
  disconnectUser,
  connectUser,
  getUsers,
  saveMessage,
  updateSeenMessages,
};
