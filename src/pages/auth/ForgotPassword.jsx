import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Phone, ArrowLeft, KeyRound } from "lucide-react";
import { forgotPasswordAction, clearError } from "../../store/authSlice";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(
      forgotPasswordAction({
        phone,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      navigate(`/verify-otp?phone=${encodeURIComponent(phone)}&action=reset`);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center bg-light py-5">
      <Row className="w-100 justify-content-center m-0">
        <Col xs={12} sm={10} md={8} lg={5} xl={4}>
          <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
            <Card.Body className="p-4 p-sm-5">
              <div className="text-center mb-4">
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "64px", height: "64px" }}
                >
                  <KeyRound size={32} />
                </div>
                <h3 className="fw-bold text-dark mb-1">Forgot Password?</h3>
                <p className="text-muted small">
                  Enter your registered phone number to receive a verification code.
                </p>
              </div>

              {error && (
                <Alert variant="danger" className="rounded-3 py-2 px-3 small border-0">
                  {error.message || "Something went wrong. Please try again."}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium text-secondary small">
                    Phone Number
                  </Form.Label>
                  <div className="position-relative d-flex align-items-center">
                    <Form.Control
                      type="tel"
                      placeholder="e.g. +1234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="py-2.5 ps-5 rounded-3 border-light-subtle"
                    />
                    <Phone
                      size={18}
                      className="position-absolute text-muted ms-3"
                    />
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-2.5 rounded-3 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4 pt-2">
                <Link
                  to="/login"
                  className="text-decoration-none fw-semibold text-secondary small d-inline-flex align-items-center gap-1 hover-primary"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;