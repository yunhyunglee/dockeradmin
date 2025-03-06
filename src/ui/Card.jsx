import PropTypes from "prop-types";
import "./Card.scss";

export function Card({ children, className = "" }) {
  return <div className={`custom-card ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`custom-card-content ${className}`}>{children}</div>;
}

// ✅ PropTypes 추가 (안전성 체크)
Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
