import React from "react";
import "./App.css"; // Import CSS
import "./Scrollable.css"; // Import scrollable specific CSS

function ScrollableContainer({ children }) {
  return (
    <div className="scrollable">
      {children}
    </div>
  );
}

export default ScrollableContainer;
