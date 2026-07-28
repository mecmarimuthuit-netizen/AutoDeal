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
import { Phone, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { login, clearError } from "../../store/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
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

    const result = await dispatch(login(formData));

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/", { replace: true });
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
                  <LogIn size={32} />
                </div>
                <h2 className="fw-bold text-dark mb-1">AutoDeal</h2>
                <p className="text-muted small">Sign in to manage your account</p>
              </div>

              {error && (
                <Alert variant="danger" className="rounded-3 py-2 px-3 small border-0 mb-4">
                  {typeof error === "string"
                    ? error
                    : error.message || "Login failed. Please check your credentials."}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-secondary small">
                    Phone Number
                  </Form.Label>
                  <div className="position-relative d-flex align-items-center">
                    <Form.Control
                      type="tel"
                      placeholder="Enter registered phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="py-2.5 ps-5 rounded-3 border-light-subtle"
                    />
                    <Phone
                      size={18}
                      className="position-absolute text-muted ms-3"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label className="fw-medium text-secondary small mb-0">
                      Password
                    </Form.Label>
                    <Link
                      to="/forgot-password"
                      className="text-decoration-none small text-primary fw-medium"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="position-relative d-flex align-items-center">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
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

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-2.5 mt-2 rounded-3 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4 pt-2 border-top">
                <span className="text-muted small">Don't have an account?</span>{" "}
                <Link
                  to="/register"
                  className="fw-semibold text-decoration-none text-primary small ms-1"
                >
                  Create Account
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;