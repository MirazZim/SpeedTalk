
import "../TypingIndicator/TypingIndicatorr.css";


const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <div className="half light">
        <div className="typing">
          <span className="circle scaling"></span>
          <span className="circle scaling"></span>
          <span className="circle scaling"></span>
        </div>
        <div className="typing">
          <span className="circle bouncing"></span>
          <span className="circle bouncing"></span>
          <span className="circle bouncing"></span>
        </div>
        <br />
        <div className="typing">
          <span className="circle scaling"></span>
          <span className="circle bouncing"></span>
          <span className="circle scaling"></span>
        </div>
      </div>
      <div className="half dark">
        <div className="typing">
          <span className="circle scaling"></span>
          <span className="circle scaling"></span>
          <span className="circle scaling"></span>
        </div>
        <div className="typing">
          <span className="circle bouncing"></span>
          <span className="circle bouncing"></span>
          <span className="circle bouncing"></span>
        </div>
        <br />
        <div className="typing">
          <span className="circle scaling"></span>
          <span className="circle bouncing"></span>
          <span className="circle scaling"></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
