import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { Navbar, Avatar, Dropdown, Button } from "flowbite-react";

import { useAuth0 } from "@auth0/auth0-react";

const NavBarF = () => {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      }
    });

  return (

    <div className="nav-container">
      <Navbar
        fluid={true}
        rounded={true}
      >
        <NavLink to="/">
          <Navbar.Brand href="/" >

            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
            />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              Flowbite
            </span>
          </Navbar.Brand>
        </NavLink>

        <div className="flex md:order-2">
          {isAuthenticated && (
            <Dropdown
              arrowIcon={false}
              inline={true}
              label={<Avatar alt="User settings" img={user.picture} rounded={true} />}
            >
              <Dropdown.Header>
                <span className="block text-sm">
                  {user.name}
                </span>
                <span className="block truncate text-sm font-medium">
                  {user.email}
                </span>
              </Dropdown.Header>
              <Dropdown.Item>
                <NavLink to="profile">
                  Profile
                </NavLink>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => logoutWithRedirect()}>
                Sign out
              </Dropdown.Item>
            </Dropdown>
          )}
          {!isAuthenticated && (
            <Button onClick={() => loginWithRedirect()}>
              Login
            </Button>
          )}


          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link
            href="/navbars"
            active={true}
          >
            Home
          </Navbar.Link>
          <Navbar.Link href="/navbars">
            About
          </Navbar.Link>
          <Navbar.Link href="/navbars">
            Services
          </Navbar.Link>
          <Navbar.Link href="/navbars">
            Pricing
          </Navbar.Link>
          <Navbar.Link href="/navbars">
            Contact
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>

    </div>
  );
};

export default NavBarF;
