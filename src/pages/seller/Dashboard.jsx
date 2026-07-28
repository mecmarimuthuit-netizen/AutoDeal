import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Car,
  CheckCircle2,
  Tag,
  Plus,
  User,
  Heart,
  Phone,
  ShieldCheck,
  Clock,
} from "lucide-react";

import { fetchMyCars } from "../../store/carSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cars, loading } = useSelector((state) => state.cars);

  useEffect(() => {
    dispatch(fetchMyCars());
  }, [dispatch]);

  const totalCars = Array.isArray(cars) ? cars.length : 0;
  const availableCars = Array.isArray(cars)
    ? cars.filter((car) => car.status === "available").length
    : 0;
  const soldCars = Array.isArray(cars)
    ? cars.filter((car) => car.status === "sold").length
    : 0;

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0 rounded-4 bg-primary text-white p-2">
            <Card.Body className="d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <h2 className="fw-bold mb-1">
                  Welcome back, {user?.full_name || "User"}! 👋
                </h2>
                <p className="mb-0 text-white-50">
                  Manage your account, view current vehicle listings, and add new cars.
                </p>
              </div>
              <Badge bg="light" text="primary" className="px-3 py-2 fs-6 rounded-pill text-capitalize">
                Role: {user?.role || "Member"}
              </Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col xs={12} md={4}>
          <Card className="shadow-sm border-0 rounded-4 h-100 border-start border-4 border-primary">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold d-block mb-1">Total Cars</span>
                <h2 className="fw-bold text-primary mb-0">
                  {loading ? <Spinner animation="border" size="sm" /> : totalCars}
                </h2>
              </div>
              <div
                className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "50px", height: "50px" }}
              >
                <Car size={22} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="shadow-sm border-0 rounded-4 h-100 border-start border-4 border-success">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold d-block mb-1">Available Cars</span>
                <h2 className="fw-bold text-success mb-0">
                  {loading ? <Spinner animation="border" size="sm" /> : availableCars}
                </h2>
              </div>
              <div
                className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "50px", height: "50px" }}
              >
                <CheckCircle2 size={22} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} md={4}>
          <Card className="shadow-sm border-0 rounded-4 h-100 border-start border-4 border-danger">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted fw-semibold d-block mb-1">Sold Cars</span>
                <h2 className="fw-bold text-danger mb-0">
                  {loading ? <Spinner animation="border" size="sm" /> : soldCars}
                </h2>
              </div>
              <div
                className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "50px", height: "50px" }}
              >
                <Tag size={22} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h5 className="fw-bold text-dark mb-3">Quick Actions</h5>
      <Row className="g-4 mb-5">
        <Col xs={12} sm={6} md={3}>
          <Card className="shadow-sm border-0 rounded-4 h-100 text-center">
            <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-between">
              <div
                className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <Car size={26} />
              </div>
              <h6 className="fw-bold">My Cars</h6>
              <p className="text-muted small mb-3">View and update your posted listings.</p>
              <Button as={Link} to="/my-cars" variant="outline-primary" className="w-100 rounded-3 fw-semibold">
                View Cars
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="shadow-sm border-0 rounded-4 h-100 text-center">
            <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-between">
              <div
                className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <Plus size={26} />
              </div>
              <h6 className="fw-bold">Add Car</h6>
              <p className="text-muted small mb-3">Post a new vehicle for sale easily.</p>
              <Button as={Link} to="/add-car" variant="outline-success" className="w-100 rounded-3 fw-semibold">
                Add Car
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="shadow-sm border-0 rounded-4 h-100 text-center">
            <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-between">
              <div
                className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <User size={24} />
              </div>
              <h6 className="fw-bold">Profile</h6>
              <p className="text-muted small mb-3">Update account settings & info.</p>
              <Button as={Link} to="/profile" variant="outline-info" className="w-100 rounded-3 fw-semibold">
                My Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} md={3}>
          <Card className="shadow-sm border-0 rounded-4 h-100 text-center">
            <Card.Body className="p-4 d-flex flex-column align-items-center justify-content-between">
              <div
                className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <Heart size={24} />
              </div>
              <h6 className="fw-bold">Wishlist</h6>
              <p className="text-muted small mb-3">Browse saved favorite cars.</p>
              <Button as={Link} to="/wishlist" variant="outline-danger" className="w-100 rounded-3 fw-semibold">
                Wishlist
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Header className="bg-transparent border-0 pt-4 px-4 pb-0">
              <h5 className="fw-bold mb-0">Account Details</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="g-3">
                <Col md={6}>
                  <div className="d-flex align-items-center mb-3">
                    <User className="text-muted me-3" size={18} />
                    <div>
                      <small className="text-muted d-block">Full Name</small>
                      <strong className="text-dark">{user?.full_name || "-"}</strong>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <Phone className="text-muted me-3" size={18} />
                    <div>
                      <small className="text-muted d-block">Phone Number</small>
                      <strong className="text-dark">{user?.phone || "-"}</strong>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <ShieldCheck className="text-muted me-3" size={18} />
                    <div>
                      <small className="text-muted d-block">Account Role</small>
                      <span className="text-capitalize fw-semibold text-dark">{user?.role || "-"}</span>
                    </div>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="d-flex align-items-center mb-3">
                    <CheckCircle2 className="text-muted me-3" size={18} />
                    <div>
                      <small className="text-muted d-block">Account Status</small>
                      <Badge bg={user?.status === "active" ? "success" : "warning"} className="text-capitalize px-2 py-1">
                        {user?.status || "Active"}
                      </Badge>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <ShieldCheck className="text-muted me-3" size={18} />
                    <div>
                      <small className="text-muted d-block">Verified Identity</small>
                      <Badge bg={user?.is_verified ? "success" : "secondary"} className="px-2 py-1">
                        {user?.is_verified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <Clock className="text-muted me-3" size={18} />
                    <div>
                      <small className="text-muted d-block">Last Login</small>
                      <strong className="text-dark">
                        {user?.last_login ? new Date(user.last_login).toLocaleString() : "-"}
                      </strong>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;