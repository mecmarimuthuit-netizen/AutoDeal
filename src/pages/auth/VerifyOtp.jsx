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
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Phone, KeyRound, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import {
  verifyOTP,
  resetPasswordAction,
  clearError,
} from "../../store/authSlice";

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const action = searchParams.get("action") || "verify";
  const phone = searchParams.get("phone") || "";

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    phone,
    otp: "",
    newPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(clearError());

    let result;

    if (action === "verify") {
      result = await dispatch(
        verifyOTP({
          phone: formData.phone,
          otp: formData.otp,
        })
      );
    } else {
      result = await dispatch(
        resetPasswordAction({
          phone: formData.phone,
          otp: formData.otp,
          newPassword: formData.newPassword,
        })
      );
    }

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
                <h3 className="fw-bold text-dark mb-1">
                  {action === "verify" ? "Verify OTP" : "Reset Password"}
                </h3>
                <p className="text-muted small">
                  {action === "verify"
                    ? "Enter the code sent to your mobile number"
                    : "Enter your verification code and new password"}
                </p>
              </div>

              {error && (
                <Alert variant="danger" className="rounded-3 py-2 px-3 small border-0 mb-4">
                  {error.message || "Something went wrong"}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-secondary small">
                    Phone Number
                  </Form.Label>
                  <div className="position-relative d-flex align-items-center">
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      readOnly
                      className="py-2.5 ps-5 rounded-3 border-light-subtle bg-light text-muted"
                    />
                    <Phone
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
                      name="otp"
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      maxLength={6}
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

                {action === "reset" && (
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-medium text-secondary small">
                      New Password
                    </Form.Label>
                    <div className="position-relative d-flex align-items-center">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        placeholder="Enter new password"
                        value={formData.newPassword}
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
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-2.5 rounded-3 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span>Processing...</span>
                    </>
                  ) : action === "verify" ? (
                    "Verify OTP"
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

export default VerifyOtp;