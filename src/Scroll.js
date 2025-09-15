import React from "react";
import "./App.css"; // Import CSS

function ScrollableContainer({ children }) {
  return (
    <div className="scrollable">
      {children}
    </div>
  );
}

export default ScrollableContainer;
