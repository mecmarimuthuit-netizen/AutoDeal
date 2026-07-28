import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  Image as BsImage,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

const STATIC_MODELS_BY_BRAND = {
  "1": [
    { id: "101", name: "Swift" },
    { id: "102", name: "Baleno" },
    { id: "103", name: "Brezza" },
    { id: "104", name: "Ertiga" },
  ],
  "2": [
    { id: "201", name: "City" },
    { id: "202", name: "Civic" },
    { id: "203", name: "Amaze" },
  ],
  "3": [
    { id: "301", name: "Corolla" },
    { id: "302", name: "Camry" },
    { id: "303", name: "Fortuner" },
  ],
  "4": [
    { id: "401", name: "Creta" },
    { id: "402", name: "i20" },
    { id: "403", name: "Verna" },
  ],
  "5": [
    { id: "501", name: "Thar" },
    { id: "502", name: "Scorpio" },
    { id: "503", name: "XUV700" },
  ],
};

const DEFAULT_FALLBACK_MODELS = [
  { id: "901", name: "Standard Model A" },
  { id: "902", name: "Standard Model B" },
  { id: "903", name: "Executive Model C" },
  { id: "904", name: "Sport Edition" },
];

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [brands, setBrands] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [transmissions, setTransmissions] = useState([]);
  const [carTypes, setCarTypes] = useState([]);
  const [models, setModels] = useState([]);

  const [existingPrimaryImg, setExistingPrimaryImg] = useState("");
  const [existingGalleryImgs, setExistingGalleryImgs] = useState([]);
  const [primaryImgPreview, setPrimaryImgPreview] = useState("");
  const [galleryImgPreviews, setGalleryImgPreviews] = useState([]);

  const [formData, setFormData] = useState({
    brand_id: "",
    model_id: "",
    fuel_type_id: "",
    transmission_id: "",
    car_type_id: "",
    variant: "",
    year: "",
    purchasedate: "",
    numplate: "",
    price: "",
    price_negotiable: false,
    exteriorColour: "",
    interiorColour: "",
    kmdriven: "",
    ownership: "",
    state: "",
    city: "",
    description: "",
    primary_image: null,
    images: [],
  });

  const getModelsForBrand = (brandId) => {
    if (!brandId) return DEFAULT_FALLBACK_MODELS;
    const key = String(brandId).trim();
    const foundModels = STATIC_MODELS_BY_BRAND[key];
    return foundModels && foundModels.length > 0
      ? foundModels
      : DEFAULT_FALLBACK_MODELS;
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [bList, fList, tList, cList] = await loadMasterData();
        await loadCar(bList, fList, tList, cList);
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to load initial data");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id]);

  useEffect(() => {
    if (formData.brand_id) {
      setModels(getModelsForBrand(formData.brand_id));
    } else {
      setModels(DEFAULT_FALLBACK_MODELS);
    }
  }, [formData.brand_id]);

  const loadMasterData = async () => {
    try {
      const [brandsRes, fuelRes, transRes, typeRes] = await Promise.all([
        API.get("/brands"),
        API.get("/fuel-types"),
        API.get("/transmissions"),
        API.get("/car-types"),
      ]);

      const bList = brandsRes.data.data || brandsRes.data || [];
      const fList = fuelRes.data.data || fuelRes.data || [];
      const tList = transRes.data.data || transRes.data || [];
      const cList = typeRes.data.data || typeRes.data || [];

      setBrands(bList);
      setFuelTypes(fList);
      setTransmissions(tList);
      setCarTypes(cList);

      return [bList, fList, tList, cList];
    } catch (err) {
      console.error("Error loading master data:", err);
      return [[], [], [], []];
    }
  };

  const loadCar = async (
    brandList = [],
    fuelList = [],
    transList = [],
    typeList = []
  ) => {
    try {
      const response = await API.get(`/cars/${id}`);
      const car = response.data.data?.car || response.data?.car || response.data;

      const matchedBrand = brandList.find(
        (b) =>
          String(b.id) === String(car.brand_id) ||
          (b.name && car.brand && b.name.toLowerCase() === car.brand.toLowerCase())
      );
      const brandId = matchedBrand?.id || car.brand_id || "";

      const availableModels = getModelsForBrand(brandId);
      setModels(availableModels);

      const matchedModel = availableModels.find(
        (m) =>
          String(m.id) === String(car.model_id) ||
          (m.name && car.model && m.name.toLowerCase() === car.model.toLowerCase())
      );
      const modelId = matchedModel?.id || car.model_id || "";

      const matchedFuel = fuelList.find(
        (f) =>
          String(f.id || f.fuel_type_id) === String(car.fuel_type_id) ||
          ((f.name || f.fuel_type_name) &&
            car.fuel_type &&
            (f.name || f.fuel_type_name).toLowerCase() === car.fuel_type.toLowerCase())
      );
      const fuelId = matchedFuel?.fuel_type_id || matchedFuel?.id || car.fuel_type_id || "";

      const matchedTrans = transList.find(
        (t) =>
          String(t.id || t.transmission_id) === String(car.transmission_id) ||
          ((t.name || t.transmission_name) &&
            car.transmission &&
            (t.name || t.transmission_name).toLowerCase() === car.transmission.toLowerCase())
      );
      const transId = matchedTrans?.transmission_id || matchedTrans?.id || car.transmission_id || "";

      const matchedType = typeList.find(
        (c) =>
          String(c.id || c.car_type_id) === String(car.car_type_id) ||
          ((c.name || c.car_type_name) &&
            car.car_type &&
            (c.name || c.car_type_name).toLowerCase() === car.car_type.toLowerCase())
      );
      const typeId = matchedType?.car_type_id || matchedType?.id || car.car_type_id || "";

      if (car.primary_image) {
        setExistingPrimaryImg(car.primary_image);
      }
      if (car.images && car.images.length > 0) {
        setExistingGalleryImgs(
          car.images.map((img) => (typeof img === "object" ? img.image_url || img.url : img))
        );
      }

      setFormData({
        brand_id: String(brandId),
        model_id: String(modelId),
        variant: car.variant || "",
        year: car.year || "",
        purchasedate: car.purchase_date
          ? car.purchase_date.split("T")[0]
          : car.purchasedate || "",
        numplate: car.number_plate || car.numplate || "",
        price: car.price || "",
        price_negotiable: car.price_negotiable ?? false,
        exteriorColour: car.exterior_colour || car.exteriorColour || "",
        interiorColour: car.interior_colour || car.interiorColour || "",
        kmdriven: car.km_driven || car.kmdriven || "",
        ownership: car.ownership || "",
        fuel_type_id: String(fuelId),
        transmission_id: String(transId),
        car_type_id: String(typeId),
        state: car.state || "",
        city: car.city || "",
        description: car.description || "",
        primary_image: null,
        images: [],
      });
    } catch (err) {
      console.error("Load Car Error:", err);
      setError("Unable to load car details");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "primary_image") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, primary_image: file }));
        setPrimaryImgPreview(URL.createObjectURL(file));
      }
      return;
    }

    if (name === "images") {
      const fileList = Array.from(files);
      setFormData((prev) => ({ ...prev, images: fileList }));
      setGalleryImgPreviews(fileList.map((file) => URL.createObjectURL(file)));
      return;
    }

    if (name === "brand_id") {
      setModels(getModelsForBrand(value));
      setFormData((prev) => ({
        ...prev,
        brand_id: value,
        model_id: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.brand_id) return "Brand is required";
    if (!formData.model_id) return "Model is required";
    if (!formData.variant) return "Variant is required";
    if (!formData.year) return "Year is required";
    if (!formData.price) return "Price is required";
    if (!formData.fuel_type_id) return "Fuel type is required";
    if (!formData.transmission_id) return "Transmission is required";
    if (!formData.car_type_id) return "Car type is required";
    if (!formData.description) return "Description is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      const data = new FormData();

      const selectedBrand = brands.find((b) => String(b.id) === String(formData.brand_id));
      const selectedModel = models.find(
        (m) => String(m.id || m.model_id) === String(formData.model_id)
      );
      const selectedFuel = fuelTypes.find(
        (f) => String(f.fuel_type_id || f.id) === String(formData.fuel_type_id)
      );
      const selectedTrans = transmissions.find(
        (t) => String(t.transmission_id || t.id) === String(formData.transmission_id)
      );
      const selectedType = carTypes.find(
        (c) => String(c.car_type_id || c.id) === String(formData.car_type_id)
      );

      const payload = {
        brand: selectedBrand?.name || "",
        model: selectedModel?.name || selectedModel?.model_name || "",
        variant: formData.variant,
        year: formData.year,
        price: formData.price,
        price_negotiable: formData.price_negotiable,
        purchasedate: formData.purchasedate,
        numplate: formData.numplate,
        exteriorColour: formData.exteriorColour,
        interiorColour: formData.interiorColour,
        kmdriven: formData.kmdriven,
        fueltype: selectedFuel?.fuel_type_name || selectedFuel?.name || "",
        transmission: selectedTrans?.transmission_name || selectedTrans?.name || "",
        ownership: formData.ownership,
        state: formData.state,
        city: formData.city,
        car_type: selectedType?.car_type_name || selectedType?.name || "",
        description: formData.description,
      };

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          data.append(key, value);
        }
      });

      if (formData.primary_image) {
        data.append("primary_image", formData.primary_image);
      }

      formData.images.forEach((img) => {
        data.append("images", img);
      });

      const response = await API.put(`/cars/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.status === "success" || response.data?.success || response.status === 200) {
        navigate("/my-cars");
      } else {
        setError(response.data?.message || "Failed to update car details.");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5 py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading car details...</p>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow border-0">
            <Card.Body className="p-4">
              <h3 className="mb-4">Edit Car</h3>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Variant</Form.Label>
                    <Form.Control
                      name="variant"
                      value={formData.variant}
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Km Driven</Form.Label>
                    <Form.Control
                      type="number"
                      name="kmdriven"
                      value={formData.kmdriven}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Brand</Form.Label>
                    <Form.Select
                      name="brand_id"
                      value={formData.brand_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Brand</option>
                      {brands.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Model</Form.Label>
                    <Form.Select
                      name="model_id"
                      value={formData.model_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Model</option>
                      {models.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Fuel Type</Form.Label>
                    <Form.Select
                      name="fuel_type_id"
                      value={formData.fuel_type_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Fuel</option>
                      {fuelTypes.map((item) => {
                        const idVal = item.fuel_type_id || item.id;
                        const labelVal = item.fuel_type_name || item.name;
                        return (
                          <option key={idVal} value={idVal}>
                            {labelVal}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Transmission</Form.Label>
                    <Form.Select
                      name="transmission_id"
                      value={formData.transmission_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Transmission</option>
                      {transmissions.map((item) => {
                        const idVal = item.transmission_id || item.id;
                        const labelVal = item.transmission_name || item.name;
                        return (
                          <option key={idVal} value={idVal}>
                            {labelVal}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Car Type</Form.Label>
                    <Form.Select
                      name="car_type_id"
                      value={formData.car_type_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Type</option>
                      {carTypes.map((item) => {
                        const idVal = item.car_type_id || item.id;
                        const labelVal = item.car_type_name || item.name;
                        return (
                          <option key={idVal} value={idVal}>
                            {labelVal}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Purchase Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="purchasedate"
                      value={formData.purchasedate}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Number Plate</Form.Label>
                    <Form.Control
                      name="numplate"
                      value={formData.numplate}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Exterior Colour</Form.Label>
                    <Form.Control
                      name="exteriorColour"
                      value={formData.exteriorColour}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Interior Colour</Form.Label>
                    <Form.Control
                      name="interiorColour"
                      value={formData.interiorColour}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Ownership</Form.Label>
                    <Form.Control
                      name="ownership"
                      value={formData.ownership}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Price Negotiable"
                      name="price_negotiable"
                      checked={formData.price_negotiable}
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Label>Primary Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="primary_image"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    <div className="mt-2">
                      {primaryImgPreview ? (
                        <div>
                          <small className="text-muted d-block mb-1">New Image Preview:</small>
                          <BsImage
                            src={primaryImgPreview}
                            thumbnail
                            style={{ maxHeight: "150px" }}
                          />
                        </div>
                      ) : existingPrimaryImg ? (
                        <div>
                          <small className="text-muted d-block mb-1">Current Image:</small>
                          <BsImage
                            src={existingPrimaryImg}
                            thumbnail
                            style={{ maxHeight: "150px" }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </Col>

                  <Col md={12} className="mb-3">
                    <Form.Label>Gallery Images</Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      name="images"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    <div className="mt-2">
                      {galleryImgPreviews.length > 0 ? (
                        <div>
                          <small className="text-muted d-block mb-1">New Images Preview:</small>
                          <div className="d-flex flex-wrap gap-2">
                            {galleryImgPreviews.map((src, idx) => (
                              <BsImage
                                key={idx}
                                src={src}
                                thumbnail
                                style={{ maxHeight: "100px", maxWidth: "100px" }}
                              />
                            ))}
                          </div>
                        </div>
                      ) : existingGalleryImgs.length > 0 ? (
                        <div>
                          <small className="text-muted d-block mb-1">Current Gallery:</small>
                          <div className="d-flex flex-wrap gap-2">
                            {existingGalleryImgs.map((src, idx) => (
                              <BsImage
                                key={idx}
                                src={src}
                                thumbnail
                                style={{ maxHeight: "100px", maxWidth: "100px" }}
                              />
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </Col>

                  <Col md={12} className="mb-4">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Button type="submit" disabled={saving} className="w-100">
                  {saving ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Car"
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

export default EditCar;