import React from "react";
import { Spinner } from "react-bootstrap";

const PageLoader = ({ label = "Loading page..." }) => {
  return (
    <div className="text-center py-5 my-5 d-flex flex-column align-items-center justify-content-center">
      <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
        <Spinner
          animation="grow"
          variant="primary"
          style={{ width: "1.25rem", height: "1.25rem", animationDelay: "0s" }}
        />
        <Spinner
          animation="grow"
          variant="primary"
          style={{ width: "1.25rem", height: "1.25rem", animationDelay: "0.2s" }}
        />
        <Spinner
          animation="grow"
          variant="primary"
          style={{ width: "1.25rem", height: "1.25rem", animationDelay: "0.4s" }}
        />
      </div>
      <p className="text-muted fw-medium fs-6 m-0">{label}</p>
    </div>
  );
};

export default PageLoader;