import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SubscriptionPlans from './components/SubscriptionPlans';
import CustomerList from './components/CustomerList';
import OneTimeProduct from './components/OneTimeProduct';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/" element={<SubscriptionPlans />} />
        <Route path="/one-time-product" element={<OneTimeProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
