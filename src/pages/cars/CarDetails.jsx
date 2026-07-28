import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Spinner,
  Alert,
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
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import API from "../../services/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80";

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
  const [activeTab, setActiveTab] = useState("about");

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

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = FALLBACK_IMAGE;
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center pt-5">
        <div className="text-center">
          <Spinner animation="border" variant="success" style={{ width: "3rem", height: "3rem" }} />
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
          <Button variant="success" onClick={() => navigate("/my-cars")}>
            Browse Cars
          </Button>
        </Alert>
      </Container>
    );
  }

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

  const rawImages = [
    car.primary_image || car.primaryImage || car.image,
    ...(Array.isArray(car.secondary_images) ? car.secondary_images : []),
    ...(Array.isArray(car.secondaryImages) ? car.secondaryImages : []),
    ...(Array.isArray(car.images) ? car.images : []),
  ];
  
  const images = [...new Set(rawImages)].filter(Boolean);
  const carTitle = car.title || `${year} ${brand} ${model}`.trim() || "Vehicle Details";

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", paddingBottom: "80px", paddingTop: "30px" }}>
      <Container style={{ maxWidth: "1140px" }}>
        
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Button
            variant="link"
            className="text-decoration-none text-dark p-0 d-inline-flex align-items-center gap-1 fw-medium"
            onClick={() => navigate("/my-cars")}
          >
            <ArrowLeft size={18} /> Back to Listings
          </Button>

          {status && (
            <Badge
              bg={status.toLowerCase() === "pending" ? "warning" : "success"}
              className="text-uppercase px-3 py-2 rounded-pill fw-bold"
            >
              {status}
            </Badge>
          )}
        </div>

        <Card className="border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
          <Row className="g-4 align-items-start">
            
            <Col lg={5} md={6}>
              <div className="position-relative bg-light rounded-4 overflow-hidden mb-3" style={{ height: "380px" }}>
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[activeImageIndex]}
                      alt={`${carTitle} photo ${activeImageIndex + 1}`}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                      onError={handleImageError}
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle border-0 bg-white shadow d-flex align-items-center justify-content-center"
                          style={{ width: "36px", height: "36px", zIndex: 5, opacity: 0.85 }}
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle border-0 bg-white shadow d-flex align-items-center justify-content-center"
                          style={{ width: "36px", height: "36px", zIndex: 5, opacity: 0.85 }}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                    <ImageOff size={48} className="text-secondary mb-2" />
                    <span>No Photos Available</span>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="d-flex gap-2 overflow-auto pb-2">
                  {images.map((img, idx) => {
                    const isActive = activeImageIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        className="btn p-0 border-0 flex-shrink-0 rounded-3 overflow-hidden"
                        style={{
                          width: "64px",
                          height: "54px",
                          outline: isActive ? "2px solid #198754" : "1px solid #dee2e6",
                          outlineOffset: "1px",
                          opacity: isActive ? 1 : 0.6,
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
              )}
            </Col>

            <Col lg={7} md={6}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <span className="badge bg-purple-subtle text-success border border-success-subtle rounded px-2 py-1 mb-2 fw-semibold" style={{ fontSize: "0.75rem", backgroundColor: "#e8f5e9" }}>
                    Verified Store
                  </span>
                  <h2 className="fw-bold text-dark mb-2" style={{ fontSize: "1.6rem" }}>
                    {carTitle}
                  </h2>
                  <div className="d-flex align-items-center gap-2 text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                    <span className="d-flex align-items-center text-warning fw-bold gap-1">
                      <Star size={16} fill="#ffc107" /> 4.8
                    </span>
                    <span>•</span>
                    <span>(12 reviews)</span>
                    <span>•</span>
                    <span>0 Discussions</span>
                  </div>
                </div>

                <Button variant="light" className="rounded-circle border p-2 text-secondary shadow-sm">
                  <Share2 size={18} />
                </Button>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-baseline gap-2 flex-wrap">
                  <h3 className="fw-bold text-dark mb-0" style={{ fontSize: "1.8rem" }}>
                    {formatPrice(price)}
                  </h3>
                  {isNegotiable && (
                    <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill" style={{ fontSize: "0.75rem" }}>
                      Negotiable
                    </span>
                  )}
                </div>
              </div>

              {variant && (
                <div className="mb-4">
                  <span className="text-muted small d-block mb-2 fw-semibold">Variant / Model Details</span>
                  <div className="d-flex gap-2">
                    <span className="border border-success bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill fw-semibold" style={{ fontSize: "0.85rem" }}>
                      {variant}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-3 border border-success-subtle bg-success bg-opacity-10 mb-4 d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold text-success" style={{ fontSize: "0.9rem" }}>
                    Special Inspection & Warranty Available Everyday
                  </div>
                  <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                    Verified quality checks & paperwork assistance included.
                  </small>
                </div>
                <ChevronRight size={18} className="text-success" />
              </div>

              <div className="d-flex gap-4 text-muted pt-2 border-top" style={{ fontSize: "0.85rem" }}>
                <span className="d-flex align-items-center gap-1">
                  <CheckCircle2 size={15} className="text-success" /> Ready Stock
                </span>
                <span className="d-flex align-items-center gap-1">
                  <ShieldCheck size={15} className="text-success" /> Original Papers
                </span>
                <span className="d-flex align-items-center gap-1">
                  <Tag size={15} className="text-success" /> 7-Day Return policy
                </span>
              </div>
            </Col>

          </Row>
        </Card>

        <Card className="border-0 shadow-sm rounded-4 bg-white p-4">
          
          <div className="d-flex gap-4 border-bottom pb-3 mb-4">
            <button
              className={`btn fw-bold px-3 py-1 rounded-pill ${activeTab === "about" ? "bg-success text-white" : "text-muted bg-light border-0"}`}
              onClick={() => setActiveTab("about")}
            >
              About / Specs
            </button>
            <button
              className={`btn fw-bold px-3 py-1 rounded-pill ${activeTab === "reviews" ? "bg-success text-white" : "text-muted bg-light border-0"}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
            <button
              className={`btn fw-bold px-3 py-1 rounded-pill ${activeTab === "discussion" ? "bg-success text-white" : "text-muted bg-light border-0"}`}
              onClick={() => setActiveTab("discussion")}
            >
              Discussion
            </button>
          </div>

          {activeTab === "about" ? (
            <Row className="g-4">
              <Col lg={6}>
                <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "1.1rem" }}>Product Information</h5>
                <table className="table table-borderless align-middle mb-0" style={{ fontSize: "0.9rem" }}>
                  <tbody>
                    <tr>
                      <td className="text-muted w-50 py-2">Brand / Make</td>
                      <td className="fw-semibold text-dark py-2">{brand || "N/A"}</td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Model Year</td>
                      <td className="fw-semibold text-dark py-2">{year || "N/A"}</td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Fuel Type</td>
                      <td className="fw-semibold text-dark py-2 text-capitalize">{fuelType}</td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Transmission</td>
                      <td className="fw-semibold text-dark py-2 text-capitalize">{transmission}</td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Kilometers Driven</td>
                      <td className="fw-semibold text-dark py-2">{formatKm(kmDriven)}</td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Body Type</td>
                      <td className="fw-semibold text-dark py-2 text-capitalize">{bodyType}</td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Ownership</td>
                      <td className="fw-semibold text-dark py-2 text-capitalize">{ownership}</td>
                    </tr>
                    <tr>
                      <td className="text-muted py-2">Location</td>
                      <td className="fw-semibold text-success py-2">{locationText}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>

              <Col lg={6}>
                <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "1.1rem" }}>Product Description</h5>
                <p className="text-secondary lh-lg mb-4" style={{ fontSize: "0.9rem", whiteSpace: "pre-line" }}>
                  {description}
                </p>

                <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: "42px", height: "42px" }}
                    >
                      {sellerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="fw-bold text-dark d-flex align-items-center gap-1">
                        {sellerName} <CheckCircle2 size={14} className="text-success" />
                      </div>
                      <small className="text-muted">Active Seller • {locationText}</small>
                    </div>
                  </div>
                  <Button
                    variant="success"
                    size="sm"
                    className="px-3 fw-bold rounded-pill d-flex align-items-center gap-1"
                    onClick={() => alert(`Contacting seller for ${carTitle}`)}
                  >
                    <PhoneCall size={14} /> Contact
                  </Button>
                </div>
              </Col>
            </Row>
          ) : (
            <div className="text-center py-5 text-muted">
              <p>No {activeTab} content available for this vehicle yet.</p>
            </div>
          )}

        </Card>

      </Container>
    </div>
  );
};

export default CarDetails;