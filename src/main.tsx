import { createRoot } from "react-dom/client";
// import App from "./App.tsx"; // Commenting out App for testing
import "./globals.css";

const TestComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <h1 className="text-5xl font-bold">Hello World!</h1>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<TestComponent />);