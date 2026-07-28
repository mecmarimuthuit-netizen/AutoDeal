import React from "react";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  User as UserIcon,
  LayoutDashboard,
  Car,
  Heart,
  User,
  LogOut,
} from "lucide-react";
import { logout } from "../../store/authSlice";

const AppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, user, accessToken } = useSelector(
    (state) => state.auth
  );

  const isLoggedIn = isAuthenticated || Boolean(accessToken);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const userName = user?.name || user?.full_name || "Account";
  const userAvatar =
    user?.avatar || user?.profile_picture || user?.profileImage || null;
  const userInitial =
    userName !== "Account" ? userName.charAt(0).toUpperCase() : null;

  const ProfileDropdownTitle = (
    <div className="d-inline-flex align-items-center gap-2 pe-1">
      {userAvatar ? (
        <img
          src={userAvatar}
          alt={userName}
          className="rounded-circle border border-2 border-white shadow-sm flex-shrink-0"
          style={{ width: "34px", height: "34px", objectFit: "cover" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = "none";
          }}
        />
      ) : (
        <div
          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0"
          style={{ width: "34px", height: "34px", fontSize: "0.85rem" }}
        >
          {userInitial || <UserIcon size={16} />}
        </div>
      )}
      <span className="fw-semibold text-dark fs-6 lh-1">{userName}</span>
    </div>
  );

  return (
    <>
      <style>{`
        .custom-profile-dropdown .dropdown-toggle {
          display: inline-flex !important;
          align-items: center !important;
          padding: 0.25rem 0.75rem !important;
          border-radius: 50rem !important;
          transition: all 0.2s ease-in-out;
        }
        .custom-profile-dropdown .dropdown-toggle::after {
          vertical-align: middle !important;
          margin-left: 0.45rem !important;
          border-top-width: 0.3em !important;
          border-right-width: 0.3em !important;
          border-left-width: 0.3em !important;
          opacity: 0.7;
        }
        .custom-profile-dropdown .dropdown-toggle:hover::after {
          opacity: 1;
        }
        .custom-profile-dropdown .dropdown-menu {
          border: 0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
          border-radius: 1rem;
          padding: 0.5rem;
          margin-top: 0.5rem;
        }
        .custom-profile-dropdown .dropdown-item {
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-weight: 500;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>

      <Navbar bg="white" expand="lg" className="shadow-sm py-2 sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-3 me-4">
            AutoDeal
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto gap-1">
              {/* 1. Home Link */}
              <Nav.Link
                as={Link}
                to="/"
                className={`px-3 py-2 rounded-pill fw-medium transition-all ${
                  isActive("/")
                    ? "bg-primary text-white shadow-sm fw-bold"
                    : "text-dark hover-bg-light"
                }`}
              >
                Home
              </Nav.Link>

              {isLoggedIn && (
                <>
                  <Nav.Link
                    as={Link}
                    to="/dashboard"
                    className={`px-3 py-2 rounded-pill fw-medium transition-all ${
                      isActive("/dashboard")
                        ? "bg-primary text-white shadow-sm fw-bold"
                        : "text-dark hover-bg-light"
                    }`}
                  >
                    Dashboard
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to="/my-cars"
                    className={`px-3 py-2 rounded-pill fw-medium transition-all ${
                      isActive("/my-cars")
                        ? "bg-primary text-white shadow-sm fw-bold"
                        : "text-dark hover-bg-light"
                    }`}
                  >
                    My Cars
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to="/wishlist"
                    className={`px-3 py-2 rounded-pill fw-medium transition-all ${
                      isActive("/wishlist")
                        ? "bg-primary text-white shadow-sm fw-bold"
                        : "text-dark hover-bg-light"
                    }`}
                  >
                    Wishlist
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to="/profile"
                    className={`px-3 py-2 rounded-pill fw-medium transition-all ${
                      isActive("/profile")
                        ? "bg-primary text-white shadow-sm fw-bold"
                        : "text-dark hover-bg-light"
                    }`}
                  >
                    Profile
                  </Nav.Link>
                </>
              )}
            </Nav>

            <Nav className="align-items-center gap-2 mt-3 mt-lg-0">
              {isLoggedIn ? (
                <NavDropdown
                  title={ProfileDropdownTitle}
                  id="user-dropdown"
                  align="end"
                  className={`custom-profile-dropdown ${
                    ["/dashboard", "/profile", "/my-cars", "/wishlist"].includes(location.pathname)
                      ? "bg-light border border-primary-subtle"
                      : "border border-transparent hover-bg-light"
                  }`}
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/dashboard"
                    active={isActive("/dashboard")}
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    as={Link}
                    to="/profile"
                    active={isActive("/profile")}
                  >
                    <User size={16} />
                    My Profile
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    as={Link}
                    to="/my-cars"
                    active={isActive("/my-cars")}
                  >
                    <Car size={16} />
                    My Cars
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    as={Link}
                    to="/wishlist"
                    active={isActive("/wishlist")}
                  >
                    <Heart size={16} />
                    Wishlist
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item
                    onClick={handleLogout}
                    className="text-danger fw-semibold"
                  >
                    <LogOut size={16} />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-primary"
                    className="rounded-pill px-4"
                  >
                    Login
                  </Button>

                  <Button
                    as={Link}
                    to="/register"
                    variant="primary"
                    className="rounded-pill px-4"
                  >
                    Register
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AppNavbar;