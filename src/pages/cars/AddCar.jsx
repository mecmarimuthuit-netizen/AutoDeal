  import React, { useState, useEffect } from "react";
  import {
    Alert,
    Button,
    Card,
    Col,
    Container,
    Form,
    Row,
    Spinner,
    Image,
    Badge,
  } from "react-bootstrap";
  import { useNavigate } from "react-router-dom";
  import API from "../../services/api";

  const AddCar = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      brand_id: "",
      brand: "",
      model_id: "",
      model: "",
      fuel_type_id: "",
      fuel_type: "",
      transmission_id: "",
      transmission: "",
      car_type_id: "",
      car_type: "",
      variant: "",
      year: "",
      purchase_date: "",
      number_plate: "",
      price: "",
      price_negotiable: false,
      exterior_colour: "",
      interior_colour: "",
      km_driven: "",
      ownership: "",
      state: "",
      city: "",
      description: "",
    });

    const brands = [
      { id: 1, name: "Toyota" },
      { id: 2, name: "BMW" },
      { id: 3, name: "Audi" },
      { id: 4, name: "Hyundai" },
    ];

    const models = [
      { id: 1, brand_id: 1, name: "Fortuner" },
      { id: 2, brand_id: 1, name: "Innova" },
      { id: 3, brand_id: 2, name: "X5" },
      { id: 4, brand_id: 3, name: "Q7" },
    ];

    const fuelTypes = [
      { id: 1, name: "Petrol" },
      { id: 2, name: "Diesel" },
      { id: 3, name: "Electric" },
      { id: 4, name: "Hybrid" },
    ];

    const transmissions = [
      { id: 1, name: "Manual" },
      { id: 2, name: "Automatic" },
    ];

    const carTypes = [
      { id: 1, name: "SUV" },
      { id: 2, name: "Sedan" },
      { id: 3, name: "Hatchback" },
      { id: 4, name: "Luxury" },
    ];

    const ownershipOptions = ["1st Owner", "2nd Owner", "3rd Owner", "4th+ Owner"];

    const [primaryImage, setPrimaryImage] = useState(null);
    const [primaryPreview, setPrimaryPreview] = useState(null);
    const [images, setImages] = useState([]);
    const [imagesPreviews, setImagesPreviews] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [validated, setValidated] = useState(false);

    useEffect(() => {
      return () => {
        if (primaryPreview) URL.revokeObjectURL(primaryPreview);
        imagesPreviews.forEach((url) => URL.revokeObjectURL(url));
      };
    }, [primaryPreview, imagesPreviews]);

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handlePrimaryImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (primaryPreview) URL.revokeObjectURL(primaryPreview);
        setPrimaryImage(file);
        setPrimaryPreview(URL.createObjectURL(file));
      }
    };

    const handleImagesChange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        setImages((prev) => [...prev, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setImagesPreviews((prev) => [...prev, ...newPreviews]);
      }
      e.target.value = "";
    };

    const removeImage = (index) => {
      URL.revokeObjectURL(imagesPreviews[index]);
      setImages((prev) => prev.filter((_, i) => i !== index));
      setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
      if (!formData.brand) return "Please select a Brand";
      if (!formData.model) return "Please select a Model";
      if (!formData.year || isNaN(formData.year)) return "Please enter a valid Manufacturing Year";
      if (!formData.price || isNaN(formData.price)) return "Please enter a valid Price";
      if (!formData.km_driven || isNaN(formData.km_driven)) return "Please enter Kilometer Driven";
      if (!formData.fuel_type) return "Please select Fuel Type";
      if (!formData.transmission) return "Please select Transmission Type";
      if (!formData.city) return "Please enter City";
      if (!formData.state) return "Please enter State";
      if (!primaryImage) return "Primary Image is required";
      return null;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");

      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        setValidated(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setLoading(true);

      try {
        const form = new FormData();

        const payload = {
          brand: formData.brand,
          model: formData.model,
          variant: formData.variant,
          year: formData.year,
          purchasedate: formData.purchase_date,
          numplate: formData.number_plate,
          price: formData.price,
          price_negotiable: formData.price_negotiable ? "1" : "0",
          exteriorColour: formData.exterior_colour,
          interiorColour: formData.interior_colour,
          kmdriven: formData.km_driven,
          fueltype: formData.fuel_type,
          transmission: formData.transmission,
          ownership: formData.ownership,
          state: formData.state,
          city: formData.city,
          car_type: formData.car_type,
          description: formData.description,
        };

        Object.entries(payload).forEach(([key, value]) => {
          form.append(key, value ?? "");
        });

        form.append("primary_image", primaryImage);

        images.forEach((image) => {
          form.append("images", image);
        });

        const response = await API.post("/cars", form);

        if (response.data.status === "success") {
          navigate("/my-cars");
        } else {
          setError(response.data.message || "Car creation failed");
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to create car listing"
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={9} xl={8}>
            <Card className="shadow-sm border-0 rounded-4">
              <Card.Body className="p-4 p-md-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="fw-bold m-0">Add New Listing</h2>
                  <Badge bg="primary">Seller Dashboard</Badge>
                </div>

                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError("")}>
                    {error}
                  </Alert>
                )}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <h5 className="text-secondary mb-3 fs-6 fw-bold text-uppercase">1. Basic Details</h5>
                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">
                          Brand <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          required
                          name="brand"
                          value={formData.brand}
                          onChange={(e) => {
                            const selected = brands.find((item) => item.name === e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              brand: e.target.value,
                              brand_id: selected?.id || "",
                              model: "",
                              model_id: "",
                            }));
                          }}
                        >
                          <option value="">Select Brand</option>
                          {brands.map((item) => (
                            <option key={item.id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">
                          Model <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          required
                          disabled={!formData.brand_id}
                          value={formData.model}
                          onChange={(e) => {
                            const selected = models.find((item) => item.name === e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              model: e.target.value,
                              model_id: selected?.id || "",
                            }));
                          }}
                        >
                          <option value="">Select Model</option>
                          {models
                            .filter((item) => String(item.brand_id) === String(formData.brand_id))
                            .map((item) => (
                              <option key={item.id} value={item.name}>
                                {item.name}
                              </option>
                            ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Variant</Form.Label>
                        <Form.Control
                          type="text"
                          name="variant"
                          placeholder="e.g. VXi, Titanium, LXI"
                          value={formData.variant}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">
                          Manufacturing Year <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          type="number"
                          name="year"
                          placeholder="e.g. 2021"
                          value={formData.year}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Body Type</Form.Label>
                        <Form.Select
                          name="car_type"
                          value={formData.car_type}
                          onChange={(e) => {
                            const selected = carTypes.find((item) => item.name === e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              car_type: e.target.value,
                              car_type_id: selected?.id || "",
                            }));
                          }}
                        >
                          <option value="">Select Body Type</option>
                          {carTypes.map((item) => (
                            <option key={item.id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Purchase Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="purchase_date"
                          value={formData.purchase_date}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h5 className="text-secondary mb-3 fs-6 fw-bold text-uppercase">2. Specifications & Condition</h5>
                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">
                          Price (₹) <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          type="number"
                          name="price"
                          placeholder="Enter expecting price"
                          value={formData.price}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="d-flex align-items-end">
                      <Form.Group className="mb-2">
                        <Form.Check
                          type="checkbox"
                          id="price_negotiable"
                          name="price_negotiable"
                          label="Price Negotiable"
                          checked={formData.price_negotiable}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">
                          KM Driven <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          type="number"
                          name="km_driven"
                          placeholder="e.g. 45000"
                          value={formData.km_driven}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">
                          Fuel Type <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          required
                          name="fuel_type"
                          value={formData.fuel_type}
                          onChange={(e) => {
                            const selected = fuelTypes.find((item) => item.name === e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              fuel_type: e.target.value,
                              fuel_type_id: selected?.id || "",
                            }));
                          }}
                        >
                          <option value="">Select Fuel Type</option>
                          {fuelTypes.map((item) => (
                            <option key={item.id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">
                          Transmission <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          required
                          name="transmission"
                          value={formData.transmission}
                          onChange={(e) => {
                            const selected = transmissions.find((item) => item.name === e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              transmission: e.target.value,
                              transmission_id: selected?.id || "",
                            }));
                          }}
                        >
                          <option value="">Select Transmission</option>
                          {transmissions.map((item) => (
                            <option key={item.id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Ownership</Form.Label>
                        <Form.Select
                          name="ownership"
                          value={formData.ownership}
                          onChange={handleChange}
                        >
                          <option value="">Select Ownership</option>
                          {ownershipOptions.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    {/* Exterior Colour */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Exterior Colour</Form.Label>
                        <Form.Control
                          type="text"
                          name="exterior_colour"
                          placeholder="e.g. Pearl White"
                          value={formData.exterior_colour}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    {/* Interior Colour */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Interior Colour</Form.Label>
                        <Form.Control
                          type="text"
                          name="interior_colour"
                          placeholder="e.g. Black / Beige"
                          value={formData.interior_colour}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h5 className="text-secondary mb-3 fs-6 fw-bold text-uppercase">3. Location & Identification</h5>
                  <Row className="g-3 mb-4">
                    {/* Number Plate */}
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Number Plate</Form.Label>
                        <Form.Control
                          type="text"
                          name="number_plate"
                          placeholder="e.g. KA-01-AB-1234"
                          value={formData.number_plate}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    {/* City */}
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="fw-medium">
                          City <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name="city"
                          placeholder="Enter City"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    {/* State */}
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label className="fw-medium">
                          State <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          type="text"
                          name="state"
                          placeholder="Enter State"
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    {/* Description */}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          placeholder="Provide details about condition, maintenance history, or extras..."
                          value={formData.description}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h5 className="text-secondary mb-3 fs-6 fw-bold text-uppercase">4. Vehicle Media</h5>
                  <Row className="g-3 mb-4">
                    {/* Primary Image */}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-medium">
                          Primary Image <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          required
                          type="file"
                          accept="image/*"
                          onChange={handlePrimaryImageChange}
                        />
                      </Form.Group>

                      {primaryPreview && (
                        <div className="mt-3">
                          <small className="text-muted d-block mb-1">Primary Cover Preview:</small>
                          <Image
                            src={primaryPreview}
                            alt="Primary Preview"
                            className="rounded border"
                            style={{ width: "160px", height: "110px", objectFit: "cover" }}
                          />
                        </div>
                      )}
                    </Col>

                    {/* Secondary Images */}
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-medium">Additional Gallery Photos</Form.Label>
                        <Form.Control
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImagesChange}
                        />
                      </Form.Group>

                      {imagesPreviews.length > 0 && (
                        <div className="mt-3">
                          <small className="text-muted d-block mb-2">
                            Gallery Previews ({imagesPreviews.length}):
                          </small>
                          <div className="d-flex flex-wrap gap-2">
                            {imagesPreviews.map((src, idx) => (
                              <div key={idx} className="position-relative">
                                <Image
                                  src={src}
                                  alt={`Preview ${idx + 1}`}
                                  className="rounded border"
                                  style={{ width: "100px", height: "75px", objectFit: "cover" }}
                                />
                                <Button
                                  variant="danger"
                                  size="sm"
                                  type="button"
                                  className="position-absolute top-0 end-0 p-0 rounded-circle d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    fontSize: "10px",
                                    transform: "translate(30%, -30%)",
                                  }}
                                  onClick={() => removeImage(idx)}
                                >
                                  ✕
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Button
                    className="w-100 mt-3 py-2 fw-semibold"
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        Creating Listing...
                      </>
                    ) : (
                      "Create Listing"
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  };

  export default AddCar;