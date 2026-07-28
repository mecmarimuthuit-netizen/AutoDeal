import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  Fuel,
  Gauge,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import { fetchMyCars, removeCar } from "../../store/carSlice";
import PaginationComponent from "../../components/common/PaginationComponent"; 

const formatPrice = (price) => {
  if (!price && price !== 0) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatKm = (km) => {
  if (!km && km !== 0) return "N/A";
  return new Intl.NumberFormat("en-IN").format(km);
};

const ITEMS_PER_PAGE = 6;

const MyCars = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const { cars, loading, error } = useSelector((state) => state.cars);

  const carList = Array.isArray(cars)
    ? cars
    : cars?.data?.cars || cars?.cars || [];

  useEffect(() => {
    dispatch(fetchMyCars());
  }, [dispatch]);

  useEffect(() => {
    const totalPages = Math.ceil(carList.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [carList.length, currentPage]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this car?"
    );

    if (!confirmDelete) return;

    const result = await dispatch(removeCar(id));

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(fetchMyCars());
    }
  };

  const totalPages = Math.ceil(carList.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentCars = carList.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted fw-medium">Loading your vehicles...</p>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Cars</h2>
          <p className="text-muted m-0">
            Manage your listed vehicles ({carList.length})
          </p>
        </div>

        <Button
          variant="primary"
          className="d-flex align-items-center gap-2 fw-semibold px-3 py-2 shadow-sm rounded-3"
          onClick={() => navigate("/add-car")}
        >
          <Plus size={18} />
          Add Car
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4 rounded-3 shadow-sm">
          {error.message || error}
        </Alert>
      )}

      <Row className="g-4">
        {currentCars.map((car) => {
          const {
            id,
            brand,
            model,
            variant,
            year,
            price,
            price_negotiable,
            km_driven,
            fuel_type,
            transmission,
            car_type,
            city,
            state,
            ownership,
            status,
            primary_image,
            secondary_images = [],
            views = 0,
          } = car;

          const carDetailsPath = `/cars/${id}`;

          return (
            <Col lg={4} md={6} key={id}>
              <Card className="shadow-sm border-0 rounded-4 h-100 overflow-hidden position-relative card-hover">
                <div
                  className="position-relative overflow-hidden"
                  style={{ height: "210px", backgroundColor: "#111827", cursor: "pointer" }}
                  onClick={() => navigate(carDetailsPath)}
                >
                  <Card.Img
                    variant="top"
                    src={
                      primary_image ||
                      "https://via.placeholder.com/400x250?text=No+Image"
                    }
                    alt={`${brand} ${model}`}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                    className="hover-zoom"
                  />

                  <Badge
                    bg={status === "pending" ? "warning" : "success"}
                    text={status === "pending" ? "dark" : "light"}
                    className="position-absolute top-0 start-0 m-3 px-2 py-1 text-uppercase fw-bold rounded-2 shadow-sm"
                  >
                    {status || "Active"}
                  </Badge>

                  {car_type && (
                    <Badge
                      bg="dark"
                      className="position-absolute top-0 end-0 m-3 px-2 py-1 rounded-2 shadow-sm text-capitalize"
                    >
                      {car_type}
                    </Badge>
                  )}

                  {secondary_images.length > 0 && (
                    <div
                      className="position-absolute bottom-0 end-0 m-2 px-2 py-1 bg-dark bg-opacity-75 text-white rounded d-flex align-items-center gap-1"
                      style={{ fontSize: "0.75rem", backdropFilter: "blur(4px)" }}
                    >
                      <ImageIcon size={12} />+{secondary_images.length}
                    </div>
                  )}
                </div>

                <Card.Body className="d-flex flex-column p-3">
                  <div className="mb-2">
                    <Link
                      to={carDetailsPath}
                      className="text-decoration-none text-dark"
                    >
                      <h5 className="fw-bold mb-0 text-truncate hover-primary">
                        {year} {brand} {model}
                      </h5>
                    </Link>
                    {variant && <small className="text-muted d-block text-truncate">{variant}</small>}
                  </div>

                  <div className="d-flex align-items-baseline gap-2 mb-3">
                    <h4 className="fw-bold text-primary m-0">
                      {formatPrice(price)}
                    </h4>
                    {price_negotiable && (
                      <span
                        className="badge bg-light text-secondary border"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Negotiable
                      </span>
                    )}
                  </div>

                  <div className="bg-light p-2 rounded-3 mb-3">
                    <Row
                      className="g-2 text-center"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <Col xs={4} className="border-end">
                        <div className="text-muted d-flex align-items-center justify-content-center gap-1">
                          <Gauge size={12} /> KM
                        </div>
                        <div className="fw-semibold text-truncate">
                          {formatKm(km_driven)}
                        </div>
                      </Col>
                      <Col xs={4} className="border-end">
                        <div className="text-muted d-flex align-items-center justify-content-center gap-1">
                          <Fuel size={12} /> Fuel
                        </div>
                        <div className="fw-semibold text-truncate">
                          {fuel_type || "N/A"}
                        </div>
                      </Col>
                      <Col xs={4}>
                        <div className="text-muted">Gear</div>
                        <div className="fw-semibold text-truncate">
                          {transmission || "N/A"}
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div
                    className="d-flex justify-content-between text-muted mb-3"
                    style={{ fontSize: "0.825rem" }}
                  >
                    <span className="d-flex align-items-center gap-1 text-truncate">
                      <MapPin size={14} /> {[city, state].filter(Boolean).join(", ") || "N/A"}
                    </span>
                    <span className="text-capitalize">{ownership || "N/A"}</span>
                  </div>

                  <div className="mt-auto pt-2 border-top d-flex align-items-center justify-content-between text-muted">
                    <span
                      className="d-flex align-items-center gap-1"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <Eye size={14} /> {views} {views === 1 ? "view" : "views"}
                    </span>
                  </div>
                </Card.Body>

                <Card.Footer className="bg-white border-0 pt-0 pb-3 px-3">
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-secondary"
                      className="flex-fill d-flex align-items-center justify-content-center gap-1 fw-semibold rounded-2"
                      size="sm"
                      onClick={() => navigate(carDetailsPath)}
                      title="View Car Details"
                    >
                      <Eye size={15} /> Details
                    </Button>

                    <Link
                      to={`/edit-car/${id}`}
                      className="btn btn-outline-primary flex-fill d-flex align-items-center justify-content-center gap-1 fw-semibold rounded-2 btn-sm"
                      title="Edit Car Listing"
                    >
                      <Edit size={15} /> Edit
                    </Link>

                    <Button
                      variant="outline-danger"
                      className="flex-fill d-flex align-items-center justify-content-center gap-1 fw-semibold rounded-2"
                      size="sm"
                      onClick={() => handleDelete(id)}
                      title="Delete Listing"
                    >
                      <Trash2 size={15} /> Delete
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Row>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {!loading && carList.length === 0 && (
        <Alert variant="info" className="text-center mt-5 py-4 rounded-4 shadow-sm">
          <h5 className="fw-bold">No Cars Found</h5>
          <p className="text-muted mb-3">
            You haven't added any vehicles to your catalog yet.
          </p>
          <Button variant="primary" onClick={() => navigate("/add-car")}>
            Add Your First Car
          </Button>
        </Alert>
      )}
    </Container>
  );
};

export default MyCars;