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
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, KeyRound, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import { resetPasswordAction, clearError } from "../../store/authSlice";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (validationError) setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    dispatch(clearError());

    const result = await dispatch(
      resetPasswordAction({
        email: formData.email,
        otp: formData.otp,
        password: formData.password,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/login");
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
                  <ShieldCheck size={32} />
                </div>
                <h3 className="fw-bold text-dark mb-1">Reset Password</h3>
                <p className="text-muted small">
                  Set a secure new password for your account
                </p>
              </div>

              {(error || validationError) && (
                <Alert variant="danger" className="rounded-3 py-2 px-3 small border-0 mb-4">
                  {validationError || error?.message || "Password reset failed"}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-secondary small">
                    Email Address
                  </Form.Label>
                  <div className="position-relative d-flex align-items-center">
                    <Form.Control
                      type="email"
                      placeholder="Enter registered email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="py-2.5 ps-5 rounded-3 border-light-subtle"
                    />
                    <Mail
                      size={18}
                      className="position-absolute text-muted ms-3"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-secondary small">
                    OTP Code
                  </Form.Label>
                  <div className="position-relative d-flex align-items-center">
                    <Form.Control
                      type="text"
                      placeholder="Enter verification code"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      required
                      className="py-2.5 ps-5 rounded-3 border-light-subtle"
                    />
                    <KeyRound
                      size={18}
                      className="position-absolute text-muted ms-3"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-secondary small">
                    New Password
                  </Form.Label>
                  <div className="position-relative d-flex align-items-center">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="py-2.5 ps-5 pe-5 rounded-3 border-light-subtle"
                    />
                    <Lock
                      size={18}
                      className="position-absolute text-muted ms-3"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="btn btn-link position-absolute end-0 me-2 text-muted p-0 border-0"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium text-secondary small">
                    Confirm Password
                  </Form.Label>
                  <div className="position-relative d-flex align-items-center">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter new password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="py-2.5 ps-5 pe-5 rounded-3 border-light-subtle"
                    />
                    <Lock
                      size={18}
                      className="position-absolute text-muted ms-3"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="btn btn-link position-absolute end-0 me-2 text-muted p-0 border-0"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
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
                      <span>Resetting...</span>
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4 pt-2 border-top">
                <Link
                  to="/login"
                  className="text-decoration-none fw-semibold text-secondary small d-inline-flex align-items-center gap-1"
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

export default ResetPassword;