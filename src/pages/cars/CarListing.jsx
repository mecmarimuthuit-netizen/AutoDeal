import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
  Pagination,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../../store/wishlistSlice";
import API from "../../services/api";
import {
  Heart,
  Search,
  Fuel,
  Gauge,
  Calendar,
  Settings2,
  MapPin,
  Car as CarIcon,
} from "lucide-react";

const CarListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlist } = useSelector((state) => state.wishlist);
  const { accessToken } = useSelector((state) => state.auth);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    brand: "",
    fuel_type: "",
    transmission: "",
    car_type: "",
  });

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await API.get("/cars", {
        params: {
          page,
          ...filters,
        },
      });

      let carData = [];
      if (Array.isArray(response.data)) {
        carData = response.data;
      } else if (Array.isArray(response.data.data)) {
        carData = response.data.data;
      } else if (Array.isArray(response.data.data?.cars)) {
        carData = response.data.data.cars;
      } else if (Array.isArray(response.data.cars)) {
        carData = response.data.cars;
      }

      setCars(carData);
      setTotalPages(
        response.data?.totalPages || response.data?.data?.totalPages || 1
      );
    } catch (error) {
      console.log(error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    if (accessToken) {
      dispatch(getWishlist());
    }
  }, [page]);

  const handleFilter = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilter = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCars();
  };

  const isWishlisted = (id) => {
    return wishlist.some((item) => item.car_id === id || item.id === id);
  };

  const handleWishlist = (id) => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (isWishlisted(id)) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(id));
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Available Cars</h2>
          <p className="text-muted mb-0">Find your dream car from trusted dealers</p>
        </div>
      </div>

      <Card className="shadow-sm border-0 mb-4 rounded-4 bg-light">
        <Card.Body className="p-4">
          <Form onSubmit={applyFilter}>
            <Row className="g-3">
              <Col md={3} sm={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-muted">Brand</Form.Label>
                  <Form.Control
                    placeholder="e.g. Audi, Toyota"
                    name="brand"
                    value={filters.brand}
                    onChange={handleFilter}
                    className="rounded-3 border-0 shadow-sm"
                  />
                </Form.Group>
              </Col>

              <Col md={3} sm={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-muted">Fuel Type</Form.Label>
                  <Form.Select
                    name="fuel_type"
                    value={filters.fuel_type}
                    onChange={handleFilter}
                    className="rounded-3 border-0 shadow-sm"
                  >
                    <option value="">All Fuel Types</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3} sm={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-muted">Transmission</Form.Label>
                  <Form.Select
                    name="transmission"
                    value={filters.transmission}
                    onChange={handleFilter}
                    className="rounded-3 border-0 shadow-sm"
                  >
                    <option value="">All Transmissions</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3} sm={6} className="d-flex align-items-end">
                <Button type="submit" variant="dark" className="w-100 rounded-3 d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm">
                  <Search size={18} /> Search Cars
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="dark" />
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <CarIcon size={48} className="mb-2 opacity-50" />
          <h5>No cars found matching your criteria.</h5>
        </div>
      ) : (
        <Row className="g-4">
          {Array.isArray(cars) &&
            cars.map((car) => (
              <Col xs={12} sm={6} lg={4} key={car.id}>
                <Card className="shadow-sm border-0 rounded-4 h-100 overflow-hidden position-relative transition-hover">
                  
                  <div className="position-absolute top-0 start-0 p-3 z-1 d-flex gap-2">
                    {car.is_featured && (
                      <Badge bg="warning" text="dark" className="px-2 py-1 shadow-sm">
                        Featured
                      </Badge>
                    )}
                    <Badge bg="dark" className="px-2 py-1 shadow-sm">
                      {car.ownership}
                    </Badge>
                  </div>

                  <div className="position-relative bg-light" style={{ height: "220px" }}>
                    {car.primary_image ? (
                      <Card.Img
                        src={car.primary_image}
                        alt={`${car.brand} ${car.model}`}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                        <CarIcon size={40} />
                      </div>
                    )}
                  </div>

                  <Card.Body className="d-flex flex-column p-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="text-muted small text-uppercase fw-bold tracking-wider">
                          {car.brand}
                        </span>
                        <Card.Title className="fw-bold fs-5 mb-0 text-dark">
                          {car.model} {car.variant && `- ${car.variant}`}
                        </Card.Title>
                      </div>
                      <h4 className="fw-bold text-primary mb-0">
                        ₹{car.price?.toLocaleString()}
                      </h4>
                    </div>

                    <div className="d-flex align-items-center text-muted small mb-3">
                      <MapPin size={14} className="me-1" />
                      <span>{car.city}, {car.state}</span>
                    </div>

                    <Row className="g-2 text-muted small mb-4 py-2 border-top border-bottom bg-light rounded-3 px-2">
                      <Col xs={4} className="d-flex align-items-center gap-1">
                        <Calendar size={14} className="text-primary" />
                        <span>{car.year}</span>
                      </Col>
                      <Col xs={4} className="d-flex align-items-center gap-1">
                        <Gauge size={14} className="text-primary" />
                        <span>{car.km_driven?.toLocaleString()} km</span>
                      </Col>
                      <Col xs={4} className="d-flex align-items-center gap-1">
                        <Fuel size={14} className="text-primary" />
                        <span>{car.fuel_type}</span>
                      </Col>
                    </Row>

                    <div className="d-flex gap-2 mt-auto">
                      <Link
                        to={`/cars/${car.id}`}
                        className="btn btn-outline-dark flex-grow-1 rounded-3 fw-semibold py-2"
                      >
                        View Details
                      </Link>

                      <Button
                        variant={isWishlisted(car.id) ? "danger" : "outline-danger"}
                        className="rounded-3 px-3 d-flex align-items-center justify-content-center"
                        onClick={() => handleWishlist(car.id)}
                        title="Wishlist"
                      >
                        <Heart
                          size={18}
                          fill={isWishlisted(car.id) ? "currentColor" : "none"}
                        />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      )}

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-5">
          <Pagination className="shadow-sm">
            {Array.from({ length: totalPages }).map((_, index) => (
              <Pagination.Item
                key={index}
                active={page === index + 1}
                onClick={() => setPage(index + 1)}
                className="rounded-circle mx-1"
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default CarListing;