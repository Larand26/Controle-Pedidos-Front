import { BrowserRouter, Routes, Route } from "react-router-dom";
import Finish from "./pages/Finish";
import Separator from "./pages/Separator";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Finish />} />
        <Route path="/separator" element={<Separator />} />
      </Routes>
    </BrowserRouter>
  );
}
