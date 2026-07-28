import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { AlertTriangle } from "lucide-react";

const ConfirmModal = ({
  show,
  title,
  message,
  onClose,
  onConfirm,
  loading,
  variant = "danger",
}) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      className="border-0"
    >
      <Modal.Body className="p-4 text-center">
        <div
          className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-3 bg-${variant}-subtle text-${variant}`}
          style={{ width: "56px", height: "56px" }}
        >
          <AlertTriangle size={28} />
        </div>

        <h5 className="fw-bold mb-2">{title}</h5>
        <p className="text-muted mb-4">{message}</p>

        <div className="d-flex gap-2 justify-content-center">
          <Button
            variant="light"
            onClick={onClose}
            disabled={loading}
            className="px-4 rounded-pill fw-medium border"
          >
            Cancel
          </Button>

          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={loading}
            className="px-4 rounded-pill fw-medium d-inline-flex align-items-center gap-2"
          >
            {loading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
            {loading ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmModal;