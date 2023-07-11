const getSenderName = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

const getSenderUser = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

const isSameSender = (
  messages,
  currentMessage,
  currentMessageIndex,
  loggedUserId
) => {
  return (
    currentMessageIndex < messages.length - 1 &&
    (messages[currentMessageIndex + 1].sender._id !==
      currentMessage.sender._id ||
      messages[currentMessageIndex + 1].sender._id === undefined) &&
    messages[currentMessageIndex].sender._id !== loggedUserId
  );
};

const isLastMessage = (messages, currentMessageIndex, loggedUserId) => {
  return (
    currentMessageIndex === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== loggedUserId &&
    messages[messages.length - 1].sender._id
  );
};

const isSameUser = (messages, currentMessage, currentMessageIndex) => {
  return (
    currentMessageIndex > 0 &&
    messages[currentMessageIndex - 1].sender._id === currentMessage.sender._id
  );
};

module.exports = {
  getSenderName,
  getSenderUser,
  isLastMessage,
  isSameSender,
  isSameUser,
};
