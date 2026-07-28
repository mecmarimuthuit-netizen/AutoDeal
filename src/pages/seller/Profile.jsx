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
  Image,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProfile,
  updateUserProfile,
  clearProfileError,
  clearProfileSuccess,
} from "../../store/profileSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, loading, error, success } = useSelector(
    (state) => state.profile
  );

  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    seller_type: "individual",
    company_name: "",
    license_no: "",
    gst_no: "",
    contact_person: "",
    profile_picture: null,
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || profile.full_name || "",
        phone: profile.phone || "",
        email: profile.email || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        pincode: profile.pincode || "",
        seller_type: profile.seller_type || "individual",
        company_name: profile.company_name || "",
        license_no: profile.license_no || "",
        gst_no: profile.gst_no || "",
        contact_person: profile.contact_person || "",
        profile_picture: null,
      });

      if (profile.profile_picture) {
        setImagePreview(profile.profile_picture);
      }
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_picture" && files && files[0]) {
      const selectedFile = files[0];
      setFormData((prev) => ({ ...prev, profile_picture: selectedFile }));
      setImagePreview(URL.createObjectURL(selectedFile));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearProfileError());

    const data = new FormData();
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("email", formData.email);
    data.append("seller_type", formData.seller_type);

    if (formData.address) data.append("address", formData.address);
    if (formData.city) data.append("city", formData.city);
    if (formData.state) data.append("state", formData.state);
    if (formData.pincode) data.append("pincode", formData.pincode);

    if (formData.seller_type === "company") {
      if (formData.company_name) data.append("company_name", formData.company_name);
      if (formData.license_no) data.append("license_no", formData.license_no);
      if (formData.gst_no) data.append("gst_no", formData.gst_no);
      if (formData.contact_person) data.append("contact_person", formData.contact_person);
    }

    if (formData.profile_picture) {
      data.append("profile_picture", formData.profile_picture);
    }

    const result = await dispatch(updateUserProfile(data));

    if (updateUserProfile.fulfilled.match(result)) {
      setTimeout(() => {
        dispatch(clearProfileSuccess());
        navigate("/dashboard");
      }, 1500);
    }
  };

  if (loading && !profile) {
    return (
      <div className="text-center mt-5 py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading Profile...</p>
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={9}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="p-4 p-md-5">
              <h3 className="fw-bold mb-4 text-primary">Seller Profile Setup</h3>

              {error && (
                <Alert variant="danger">
                  {typeof error === "string"
                    ? error
                    : error.message || "Failed to update profile"}
                </Alert>
              )}

              {success && (
                <Alert variant="success">
                  Profile updated successfully! Redirecting to Dashboard...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={12} className="mb-4 text-center">
                    <Image
                      src={
                        imagePreview ||
                        "https://via.placeholder.com/150?text=User"
                      }
                      alt="Profile Avatar"
                      width={130}
                      height={130}
                      className="rounded-circle border shadow-sm mb-3"
                      style={{ objectFit: "cover" }}
                    />
                    <div>
                      <Form.Label className="btn btn-outline-primary btn-sm rounded-pill px-3">
                        Upload Profile Picture
                        <Form.Control
                          type="file"
                          name="profile_picture"
                          accept="image/*"
                          onChange={handleChange}
                          className="d-none"
                        />
                      </Form.Label>
                    </div>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter Full Name"
                      required
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Mobile Phone *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter Mobile Number"
                      required
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter Email Address"
                      required
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Seller Type *</Form.Label>
                    <Form.Select
                      name="seller_type"
                      value={formData.seller_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="individual">Individual</option>
                      <option value="company">Company</option>
                    </Form.Select>
                  </Col>

                  {formData.seller_type === "company" && (
                    <Col md={12} className="p-3 mb-3 bg-light rounded-3 border">
                      <h6 className="fw-bold mb-3 text-secondary">
                        Company Details
                      </h6>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label>Company Name</Form.Label>
                          <Form.Control
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            placeholder="e.g. Auto Corp Ltd"
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Contact Person</Form.Label>
                          <Form.Control
                            name="contact_person"
                            value={formData.contact_person}
                            onChange={handleChange}
                            placeholder="Full Name"
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>GST Number</Form.Label>
                          <Form.Control
                            name="gst_no"
                            value={formData.gst_no}
                            onChange={handleChange}
                            placeholder="e.g. 33AAAAA0000A1Z5"
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>License Number</Form.Label>
                          <Form.Control
                            name="license_no"
                            value={formData.license_no}
                            onChange={handleChange}
                            placeholder="Trade / Business License No"
                          />
                        </Col>
                      </Row>
                    </Col>
                  )}

                  <Col md={12} className="mb-3">
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                    />
                  </Col>

                  <Col md={4} className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Coimbatore"
                    />
                  </Col>

                  <Col md={4} className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Tamil Nadu"
                    />
                  </Col>

                  <Col md={4} className="mb-3">
                    <Form.Label>Pincode</Form.Label>
                    <Form.Control
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="641001"
                    />
                  </Col>
                </Row>

                <Button
                  type="submit"
                  className="w-100 mt-4 rounded-pill py-2 fw-bold"
                  disabled={loading}
                  variant="primary"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Saving Profile...
                    </>
                  ) : (
                    "Save & Continue to Dashboard"
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

export default Profile;