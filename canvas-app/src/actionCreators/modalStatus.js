const openLogModal = () => {
  return {
    type: "OPEN_LOG_MODAL"
  }
};

const closeLogModal = () => {
  return {
    type: "CLOSE_LOG_MODAL"
  }
};

const openSignModal = () => {
  return {
    type: "OPEN_SIGN_MODAL"
  }
};

const closeSignModal = () => {
  return {
    type: "CLOSE_SIGN_MODAL"
  } 
};

export { openLogModal, closeLogModal, openSignModal, closeSignModal };