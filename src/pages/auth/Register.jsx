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
import { User, Phone, Lock, Eye, EyeOff, UserPlus, ShieldCheck } from "lucide-react";
import { register, clearError } from "../../store/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    password: "",
    role: "buyer",
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

    const result = await dispatch(register(formData));

    if (result.meta.requestStatus === "fulfilled") {
      navigate(
        `/verify-otp?phone=${encodeURIComponent(formData.phone)}&action=verify`
      );
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center bg-light py-5">
      <Row className="w-100 justify-content-center m-0">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
            <Card.Body className="p-4 p-sm-5">
              <div className="text-center mb-4">
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "64px", height: "64px" }}
                >
                  <UserPlus size={32} />
                </div>
                <h2 className="fw-bold text-dark mb-1">Join AutoDeal</h2>
                <p className="text-muted small">Create an account to get started</p>
              </div>

              {error && (
                <Alert variant="danger" className="rounded-3 py-2 px-3 small border-0 mb-4">
                  {error.message || "Registration failed. Please check your information."}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-secondary small">
                    Full Name
                  </Form.Label>
                  <div className="position-relative d-flex align-items-center">
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      className="py-2.5 ps-5 rounded-3 border-light-subtle"
                    />
                    <User
                      size={18}
                      className="position-absolute text-muted ms-3"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-secondary small">
                    Phone Number
                  </Form.Label>
                  <div className="position-relative d-flex align-items-center">
                    <Form.Control
                      type="tel"
                      placeholder="Enter phone number"
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
                  <Form.Label className="fw-medium text-secondary small">
                    Account Type
                  </Form.Label>
                  <div className="position-relative d-flex align-items-center">
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="py-2.5 ps-5 rounded-3 border-light-subtle"
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Individual Seller</option>
                      <option value="company_seller">Company Seller</option>
                    </Form.Select>
                    <ShieldCheck
                      size={18}
                      className="position-absolute text-muted ms-3"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium text-secondary small">
                    Password
                  </Form.Label>
                  <div className="position-relative d-flex align-items-center">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
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
                  className="w-100 py-2.5 rounded-3 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-4 pt-2 border-top">
                <span className="text-muted small">Already have an account?</span>{" "}
                <Link
                  to="/login"
                  className="fw-semibold text-decoration-none text-primary small ms-1"
                >
                  Sign In
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;