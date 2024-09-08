const Chat = require('../../models/Chat');
const mongoose = require('mongoose');

const validateChatAndUser = async (chatId, chatUserId) => {

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return { error: 'Chat ID is not valid' };
    }

    if (!mongoose.Types.ObjectId.isValid(chatUserId)) {
        return { error: 'User ID is not valid' };
    }
  
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return { error: 'Chat not found' };
        }

        if (chat.buyer.toString() !== chatUserId && chat.seller.toString() !== chatUserId) {
            return { error: 'User is not part of the chat' };
        }

        return { chat }; 
    } catch (err) {
        console.error(err);
        return { error: 'Error retrieving chat' };
    }
}

module.exports = validateChatAndUser;