import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Upload from "./pages/Upload";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"element={<Login />}/>

        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/documents" element={<Documents />}/>
        <Route path="/upload" element={<Upload />}/>
        <Route path="/alerts" element={<Alerts />}/>
        <Route path="/settings" element={<Settings />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;