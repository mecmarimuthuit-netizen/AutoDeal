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
} from "react-bootstrap";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../../store/wishlistSlice";

import API from "../../services/api";

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

      console.log("Cars API Response:", response.data);

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
        response.data?.totalPages || response.data?.data?.totalPages || 1,
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

  const applyFilter = () => {
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
      <h2 className="fw-bold mb-4">Available Cars</h2>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Control
                placeholder="Brand"
                name="brand"
                onChange={handleFilter}
              />
            </Col>

            <Col md={4}>
              <Form.Control
                placeholder="Fuel Type"
                name="fuel_type"
                onChange={handleFilter}
              />
            </Col>

            <Col md={4}>
              <Button className="w-100" onClick={applyFilter}>
                Search
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row className="g-4">
          { Array.isArray(cars) &&
          
          cars.map((car) => (
            <Col xs={12} sm={6} lg={4} key={car.id}>
              <Card className="shadow border-0 rounded-4 h-100">
                {car.primary_image && (
                  <Card.Img
                    src={car.primary_image}
                    height="220"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                )}

                <Card.Body>
                  <Card.Title>{car.title}</Card.Title>

                  <h5 className="text-primary">${car.price}</h5>

                  <div className="d-flex gap-2">
                    <Link
                      to={`/cars/${car.id}`}
                      className="btn btn-primary flex-grow-1"
                    >
                      View
                    </Link>

                    <Button
                      variant={
                        isWishlisted(car.id) ? "danger" : "outline-danger"
                      }
                      onClick={() => handleWishlist(car.id)}
                    >
                      ♡
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <div className="d-flex justify-content-center mt-5">
        <Pagination>
          {Array.from({
            length: totalPages,
          }).map((_, index) => (
            <Pagination.Item
              key={index}
              active={page === index + 1}
              onClick={() => setPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </Container>
  );
};

export default CarListing;
