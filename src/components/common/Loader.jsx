import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = ({ label = "Loading, please wait..." }) => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center w-100"
      style={{ minHeight: "60vh" }}
    >
      <div className="position-relative d-flex align-items-center justify-content-center mb-3">
        <Spinner
          animation="border"
          variant="primary"
          style={{ width: "3.5rem", height: "3.5rem", borderWidth: "0.25em" }}
        />
      </div>
      <p className="text-muted fw-medium fs-6 m-0 animate-pulse">{label}</p>
    </div>
  );
};

export default Loader;