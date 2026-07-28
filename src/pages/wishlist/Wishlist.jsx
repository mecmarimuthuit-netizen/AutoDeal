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
import { Trash2, Eye, Heart, ArrowRight } from "lucide-react";
import { getWishlist, removeFromWishlist } from "../../store/wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlist = [], loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemove = (carId) => {
    dispatch(removeFromWishlist(carId));
  };

  if (loading) {
    return (
      <div className="text-center py-5 my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted fw-semibold">Loading your saved vehicles...</p>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Wishlist</h2>
          <p className="text-muted mb-0">
            {wishlist.length} {wishlist.length === 1 ? "vehicle" : "vehicles"} saved
          </p>
        </div>
      </div>

      <Row className="g-4">
        {wishlist.length > 0 ? (
          wishlist.map((item) => (
            <Col xs={12} sm={6} lg={4} key={item.id}>
              <Card className="shadow-sm border-0 rounded-4 h-100 overflow-hidden card-hover">
                <div
                  className="position-relative overflow-hidden"
                  style={{ height: "220px", backgroundColor: "#f8f9fa" }}
                >
                  <Card.Img
                    variant="top"
                    src={
                      item.primary_image ||
                      "https://via.placeholder.com/400x250?text=No+Image"
                    }
                    alt={item.title}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {item.brand?.name && (
                    <Badge
                      bg="dark"
                      className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-3 shadow-sm text-capitalize"
                    >
                      {item.brand.name}
                    </Badge>
                  )}
                </div>

                <Card.Body className="d-flex flex-column p-4">
                  <h5 className="fw-bold mb-2 text-truncate" title={item.title}>
                    {item.title}
                  </h5>

                  <h4 className="fw-bold text-primary mb-3">
                    ${item.price?.toLocaleString() || item.price}
                  </h4>

                  <div className="mt-auto pt-3 border-top d-flex gap-2">
                    <Link
                      to={`/cars/${item.id}`}
                      className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2 fw-semibold rounded-3 py-2"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>

                    <Button
                      variant="outline-danger"
                      className="d-flex align-items-center justify-content-center rounded-3 px-3"
                      onClick={() => handleRemove(item.id)}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <Card className="border-0 shadow-sm rounded-4 text-center py-5 my-3">
              <Card.Body className="py-4">
                <div className="mb-3 text-primary opacity-50">
                  <Heart size={64} strokeWidth={1.5} />
                </div>
                <h4 className="fw-bold mb-2">Your Wishlist is Empty</h4>
                <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "400px" }}>
                  Save your favorite vehicles while browsing so you can easily compare and review them later.
                </p>
                <Link
                  to="/cars"
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                >
                  Browse Vehicles
                  <ArrowRight size={18} />
                </Link>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Wishlist;