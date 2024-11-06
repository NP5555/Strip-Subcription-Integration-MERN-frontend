import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SubscriptionPlans from './components/SubscriptionPlans';
import CustomerList from './components/CustomerList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/" element={<SubscriptionPlans />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
