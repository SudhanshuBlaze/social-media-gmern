import React, { useState } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function MenuBar() {
  const { user, logout } = useAuth();

  // we want the "teal" color which signifies "activeItem" to change according to the path we are in it can be '/' or "/login" or "/register". "pathname" contains this data, ex: "/register"
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substring(1); //we don't want to include "/" symbol if it's "/login" or "/register"

  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);

  const menuBar = user ? (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name={user.username}
        active
        as={Link} //semantic ui components has this feature: these components will behave like <Link/>
        to="/"
      />

      <Menu.Menu position="right">
        <Menu.Item name="logout" onClick={logout} as={Link} to="/login" />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link} //semantic ui components has this feature: these components will behave like <Link/>
        to="/"
      />

      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );
  return menuBar;
}
