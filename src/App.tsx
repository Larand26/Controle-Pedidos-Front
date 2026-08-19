import { BrowserRouter, Routes, Route } from "react-router-dom";
import Finish from "./page/Finish";
import Separator from "./page/Separator";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Finish />} />
        <Route path="/separator" element={<Separator />} />

        <Route></Route>
      </Routes>
    </BrowserRouter>
  );
}
