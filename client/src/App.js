import { BrowserRouter, Routes, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";
import "./App.css"; //we have kept it later such that we can overwrite the styles of semantic ui
import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuBar from "./components/MenuBar";
import SinglePost from "./pages/SinglePost";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Container>
          <MenuBar />
          <Routes>
            <Route exact path="/" element={<Home />} />

            <Route
              exact
              path="/register"
              element={
                <AuthRoute>
                  <Register />
                </AuthRoute>
              }
            />

            <Route
              exact
              path="/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />

            <Route exact path="/posts/:id" element={<SinglePost />} />
          </Routes>
        </Container>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
