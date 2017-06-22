const modalReducer = (state=false, action) => {
  if(action.type === "OPEN_LOG_MODAL"){
    return {open:  true };
  } else if(action.type === "CLOSE_LOG_MODAL"){
    return {open: false};
  }
  return state;
}

export default modalReducer;