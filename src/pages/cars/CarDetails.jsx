import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Alert,
  Carousel,
  Button,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Fuel,
  Gauge,
  MapPin,
  Calendar,
  Car,
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
  Tag,
  Clock,
  ImageOff,
} from "lucide-react";
import API from "../../services/api";

// Reliable fallback image if a photo fails to load or breaks
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80";

// Currency helper formatted to Indian Rupees (₹)
const formatPrice = (price) => {
  if (price === null || price === undefined || price === "" || isNaN(price)) {
    return "Price on Request";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

// Distance helper
const formatKm = (km) => {
  if (km === null || km === undefined || km === "" || isNaN(km)) return "N/A";
  return `${new Intl.NumberFormat("en-IN").format(km)} km`;
};

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchCar = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(`/cars/${id}`);
      const data =
        response.data?.data?.car ||
        response.data?.data ||
        response.data?.car ||
        response.data;

      setCar(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch car details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCar();
  }, [id]);

  // Image fallback handler to prevent broken image UI
  const handleImageError = (e) => {
    e.target.onerror = null; // prevents looping
    e.target.src = FALLBACK_IMAGE;
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center pt-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3 text-muted fw-semibold">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="pt-5 mt-4">
        <Alert variant="danger" className="rounded-4 shadow-sm border-0 p-4">
          <Alert.Heading className="fw-bold">Unable to load vehicle</Alert.Heading>
          <p className="mb-3">{error}</p>
          <Button variant="outline-danger" size="sm" onClick={() => navigate("/my-cars")}>
            Back to Listings
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!car) {
    return (
      <Container className="pt-5 mt-4">
        <Alert variant="warning" className="rounded-4 shadow-sm border-0 p-4 text-center">
          <h4 className="fw-bold">Car Not Found</h4>
          <p className="text-muted">The listing you are looking for doesn't exist or has been removed.</p>
          <Button variant="primary" onClick={() => navigate("/my-cars")}>
            Browse Cars
          </Button>
        </Alert>
      </Container>
    );
  }

  // Extract fields safely
  const brand = car.brand || car.make || "";
  const model = car.model || "";
  const year = car.year || "";
  const variant = car.variant || car.trim || "";
  const price = car.price ?? car.amount ?? car.cost;
  const kmDriven = car.km_driven ?? car.kmDriven ?? car.mileage ?? car.kms;
  const fuelType = car.fuel_type || car.fuelType || car.fuel || "N/A";
  const transmission = car.transmission || car.gearbox || "N/A";
  const bodyType = car.car_type || car.body_type || car.bodyType || "N/A";
  const ownership = car.ownership || car.owner_type || car.ownerType || "N/A";
  const city = car.city || car.location || "";
  const state = car.state || "";
  const locationText = [city, state].filter(Boolean).join(", ") || "Location on Request";
  const sellerName = car.seller_name || car.owner_name || car.user?.name || "Verified Seller";
  const description = car.description || car.details || "No specific details provided by the seller.";
  const status = car.status || "active";
  const isNegotiable = car.price_negotiable || car.priceNegotiable || false;

  // Collect and sanitize image URLs
  const rawImages = [
    car.primary_image || car.primaryImage || car.image,
    ...(Array.isArray(car.secondary_images) ? car.secondary_images : []),
    ...(Array.isArray(car.secondaryImages) ? car.secondaryImages : []),
    ...(Array.isArray(car.images) ? car.images : []),
  ];
  
  const images = [...new Set(rawImages)].filter(Boolean);
  const carTitle = car.title || `${year} ${brand} ${model}`.trim() || "Vehicle Details";

  return (
    <div className="bg-light min-vh-100 pt-5 pb-5">
      <Container className="mt-3">
        
        {/* Navigation Header */}
        <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <Button
            variant="white"
            className="border bg-white shadow-sm text-dark fw-semibold rounded-pill px-3 py-2 d-inline-flex align-items-center gap-2"
            onClick={() => navigate("/my-cars")}
          >
            <ArrowLeft size={18} />
            Back to Listings
          </Button>

          {status && (
            <Badge
              bg={status.toLowerCase() === "pending" ? "warning" : "success"}
              className="text-uppercase px-3 py-2 rounded-pill fw-bold border"
            >
              {status}
            </Badge>
          )}
        </div>

        <Row className="g-4 align-items-start">
          {/* Left Column: Gallery, Specs & Details */}
          <Col lg={7} xl={8}>
            
            {/* Main Image Gallery */}
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white">
              <div className="position-relative bg-dark">
                {images.length > 0 ? (
                  <Carousel
                    activeIndex={activeImageIndex}
                    onSelect={(selectedIndex) => setActiveImageIndex(selectedIndex)}
                    interval={null}
                    indicators={false}
                  >
                    {images.map((image, index) => (
                      <Carousel.Item key={index}>
                        <div
                          style={{
                            height: "420px",
                            backgroundColor: "#0f172a",
                          }}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <img
                            src={image}
                            alt={`${carTitle} photo ${index + 1}`}
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                            onError={handleImageError}
                          />
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <div
                    className="d-flex flex-column align-items-center justify-content-center text-muted"
                    style={{ height: "380px", backgroundColor: "#f8fafc" }}
                  >
                    <ImageOff size={48} className="text-secondary mb-2" />
                    <span className="fw-medium text-secondary">No Photos Available</span>
                  </div>
                )}

                {/* Counter Badge */}
                {images.length > 0 && (
                  <div
                    className="position-absolute bottom-0 end-0 m-3 px-3 py-1 bg-dark bg-opacity-75 text-white rounded-pill fw-medium"
                    style={{ fontSize: "0.85rem", backdropFilter: "blur(6px)", zIndex: 5 }}
                  >
                    {activeImageIndex + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Improved Thumbnail Tray */}
              {images.length > 1 && (
                <Card.Body className="bg-white border-top p-3">
                  <div className="d-flex gap-2 overflow-auto pb-1 custom-scrollbar">
                    {images.map((img, idx) => {
                      const isActive = activeImageIndex === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          className="btn p-0 border-0 flex-shrink-0 position-relative rounded-3 overflow-hidden"
                          style={{
                            width: "76px",
                            height: "56px",
                            cursor: "pointer",
                            outline: isActive ? "3px solid #0d6efd" : "1px solid #e2e8f0",
                            outlineOffset: "-1px",
                            transition: "all 0.2s ease-in-out",
                            opacity: isActive ? 1 : 0.65,
                          }}
                          onClick={() => setActiveImageIndex(idx)}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                            onError={handleImageError}
                          />
                        </button>
                      );
                    })}
                  </div>
                </Card.Body>
              )}
            </Card>

            {/* Key Specifications */}
            <Card className="border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                <Tag size={20} className="text-primary" /> Key Specifications
              </h5>

              <Row className="g-3">
                <Col xs={6} md={4}>
                  <div className="p-3 rounded-3 bg-light h-100">
                    <div className="d-flex align-items-center gap-2 text-muted small fw-semibold text-uppercase mb-1">
                      <Fuel size={16} className="text-primary" />
                      Fuel Type
                    </div>
                    <span className="fw-bold text-dark fs-6 text-capitalize">
                      {fuelType}
                    </span>
                  </div>
                </Col>

                <Col xs={6} md={4}>
                  <div className="p-3 rounded-3 bg-light h-100">
                    <div className="d-flex align-items-center gap-2 text-muted small fw-semibold text-uppercase mb-1">
                      <Gauge size={16} className="text-primary" />
                      Transmission
                    </div>
                    <span className="fw-bold text-dark fs-6 text-capitalize">
                      {transmission}
                    </span>
                  </div>
                </Col>

                <Col xs={6} md={4}>
                  <div className="p-3 rounded-3 bg-light h-100">
                    <div className="d-flex align-items-center gap-2 text-muted small fw-semibold text-uppercase mb-1">
                      <Clock size={16} className="text-primary" />
                      Kilometers
                    </div>
                    <span className="fw-bold text-dark fs-6">
                      {formatKm(kmDriven)}
                    </span>
                  </div>
                </Col>

                <Col xs={6} md={4}>
                  <div className="p-3 rounded-3 bg-light h-100">
                    <div className="d-flex align-items-center gap-2 text-muted small fw-semibold text-uppercase mb-1">
                      <Car size={16} className="text-primary" />
                      Body Type
                    </div>
                    <span className="fw-bold text-dark fs-6 text-capitalize">
                      {bodyType}
                    </span>
                  </div>
                </Col>

                <Col xs={6} md={4}>
                  <div className="p-3 rounded-3 bg-light h-100">
                    <div className="d-flex align-items-center gap-2 text-muted small fw-semibold text-uppercase mb-1">
                      <ShieldCheck size={16} className="text-primary" />
                      Ownership
                    </div>
                    <span className="fw-bold text-dark fs-6 text-capitalize">
                      {ownership}
                    </span>
                  </div>
                </Col>

                <Col xs={6} md={4}>
                  <div className="p-3 rounded-3 bg-light h-100">
                    <div className="d-flex align-items-center gap-2 text-muted small fw-semibold text-uppercase mb-1">
                      <MapPin size={16} className="text-primary" />
                      Location
                    </div>
                    <span className="fw-bold text-dark fs-6 text-truncate d-block">
                      {locationText}
                    </span>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Seller Description */}
            <Card className="border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold text-dark mb-3">Seller's Description</h5>
              <p className="text-secondary lh-lg mb-0" style={{ whiteSpace: "pre-line" }}>
                {description}
              </p>
            </Card>
          </Col>

          {/* Right Column: Fixed/Sticky Contact Action Card */}
          <Col lg={5} xl={4} className="position-sticky" style={{ top: "24px", alignSelf: "flex-start" }}>
            <Card className="border-0 shadow-sm rounded-4 p-4 bg-white">
              <Card.Body className="p-0">
                
                {/* Badges */}
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {brand && (
                    <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill fw-semibold">
                      {brand}
                    </Badge>
                  )}
                  {model && (
                    <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill fw-semibold">
                      {model}
                    </Badge>
                  )}
                  {year && (
                    <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill fw-semibold">
                      <Calendar size={13} className="me-1 text-primary" />
                      {year}
                    </Badge>
                  )}
                </div>

                {/* Title & Variant */}
                <h3 className="fw-bold text-dark mb-1">{carTitle}</h3>
                {variant && (
                  <p className="text-muted fw-medium mb-3">{variant}</p>
                )}

                <hr className="my-3 opacity-10" />

                {/* Price Block */}
                <div className="mb-4">
                  <small className="text-muted text-uppercase fw-bold d-block mb-1" style={{ letterSpacing: "0.5px" }}>
                    Listing Price
                  </small>
                  <div className="d-flex align-items-baseline gap-2 flex-wrap">
                    <h2 className="fw-bold text-primary mb-0">
                      {formatPrice(price)}
                    </h2>
                    {isNegotiable && (
                      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                        Negotiable
                      </span>
                    )}
                  </div>
                </div>

                {/* Seller Info */}
                <div className="bg-light p-3 rounded-3 mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-5 shadow-sm"
                      style={{ width: "48px", height: "48px", minWidth: "48px" }}
                    >
                      {sellerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <div className="fw-bold text-dark text-truncate d-flex align-items-center gap-1">
                        {sellerName}
                        <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                      </div>
                      <small className="text-muted d-flex align-items-center gap-1 mt-1">
                        <MapPin size={13} /> {locationText}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    className="py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                    onClick={() => alert(`Contacting seller for ${carTitle}`)}
                  >
                    <PhoneCall size={18} /> Contact Seller
                  </Button>

                  <Button
                    variant="outline-dark"
                    size="lg"
                    className="py-3 fw-semibold rounded-3 d-flex align-items-center justify-content-center"
                    onClick={() => navigate("/my-cars")}
                  >
                    View Similar Cars
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CarDetails;