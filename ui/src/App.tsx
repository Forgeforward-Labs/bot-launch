import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import TokenFactory from "./pages/TokenFactory";
import Lock from "./pages/Lock";
import Airdrop from "./pages/Airdrop";
import LockDetails from "./pages/LockDetails";
import Launchpad from "./pages/Launchpad";
import Sales from "./pages/Sales";
import PresaleDetail from "./pages/PresaleDetail";
import Portfolio from "./pages/Portfolio";
import Admin from "./pages/Admin";
import CreateSale from "./pages/CreateSale";
import ApplyLaunch from "./pages/ApplyLaunch";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/token-factory" element={<TokenFactory />} />
        <Route path="/lock" element={<Lock />} />
        <Route path="/airdrop" element={<Airdrop />} />
        <Route path="/lock/:address" element={<LockDetails />} />
        <Route path="/launchpad" element={<Launchpad />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/sales/create" element={<CreateSale />} />
        <Route path="/apply" element={<ApplyLaunch />} />
        <Route path="/sales/:id" element={<PresaleDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
