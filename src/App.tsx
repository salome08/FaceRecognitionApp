import React from "react";
import { Container } from "./components/Layout/Container";
import { Row } from "./components/Layout/Row";
import NavBar from "./components/NavBar";
import FaceRecognition from "./components/FaceRecognition";

const App = () => {
  return (
    <Container>
      <Row>
        <NavBar />
      </Row>
      <FaceRecognition />
    </Container>
  );
};

export default App;
