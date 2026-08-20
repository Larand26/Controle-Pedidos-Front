import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/Layout";
import FinishOrder from "./pages/FinishOrder";
import AssignSeparator from "./pages/AssignSeparator";

export default function App() {
  return (
    <BrowserRouter>
      {/* Sonner Toast Configuration */}
      <Toaster
        theme="dark"
        toastOptions={{
          style: { fontFamily: "Montserrat, sans-serif" },
          className: "bg-offBlack border-petrolBlue text-offWhite",
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/finish" replace />} />
          <Route path="/finish" element={<FinishOrder />} />
          <Route path="/assign" element={<AssignSeparator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
