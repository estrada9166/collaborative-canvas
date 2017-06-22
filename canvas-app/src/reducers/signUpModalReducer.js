const signUpModalReducer = (state=false, action) => {
  if(action.type === "OPEN_SIGN_MODAL"){
    return {open: true};
  } else if(action.type === "CLOSE_SIGN_MODAL"){
    return {open: false};
  }
  return state;
}

export default signUpModalReducer;