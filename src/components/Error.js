import React from "react";
import { Link } from "react-router-dom";
const Error = () => {
  return (
    <div className="section section-center error">
      <h2>Hubo un error...</h2>
      <Link to="/" className="btn">
        Home
      </Link>
    </div>
  );
};

export default Error;
