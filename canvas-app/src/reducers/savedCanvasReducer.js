const savedCanvasReducer = (state, action) => {
  if(action.type === "LOAD_USER_CANVAS"){
    return {
      savedCanvas: action.canvas
    }
  }
  return {
    state,
    savedCanvas: []
  };
}

export default savedCanvasReducer;