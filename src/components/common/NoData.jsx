import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FolderOpen } from "lucide-react";

const NoData = ({
  title = "No Data Found",
  description = "Nothing to display.",
  buttonText,
  buttonLink,
}) => {
  return (
    <Card className="border-0 shadow-sm rounded-4 text-center my-4">
      <Card.Body className="py-5 px-4 d-flex flex-column align-items-center">
        <div
          className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-3 shadow-sm"
          style={{ width: "70px", height: "70px" }}
        >
          <FolderOpen size={32} className="text-muted" />
        </div>

        <h4 className="fw-bold text-dark mb-2">{title}</h4>
        
        <p className="text-muted mb-4 fs-6" style={{ maxWidth: "420px" }}>
          {description}
        </p>

        {buttonText && buttonLink && (
          <Button
            as={Link}
            to={buttonLink}
            variant="primary"
            className="rounded-pill px-4 py-2 fw-semibold shadow-sm"
          >
            {buttonText}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default NoData;