import { BrowserRouter, Routes, Route } from "react-router-dom";
import Finish from "./page/Finish";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Finish />} />

        <Route></Route>
      </Routes>
    </BrowserRouter>
  );
}
