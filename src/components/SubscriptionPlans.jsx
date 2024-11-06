import React, { useEffect, useState } from "react";

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState({});
  const [activePlan, setActivePlan] = useState("");
  const [originalPrices, setOriginalPrices] = useState({});
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [couponLoading, setCouponLoading] = useState({});

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/get-all-prices");
      const data = await response.json();

      if (data.success && data.prices) {
        setPlans(data.prices);
        setActivePlan(data.activePlan);

        const fetchedPrices = {};
        const fetchedOriginalPrices = {};

        for (const plan of Object.keys(data.prices)) {
          try {
            const planPriceResponse = await fetch(
              `http://localhost:3000/api/get-price/${data.prices[plan]}`
            );
            const planPriceData = await planPriceResponse.json();

            if (planPriceData.success && planPriceData.price?.unit_amount) {
              const price = (planPriceData.price.unit_amount / 100).toFixed(2);
              fetchedPrices[plan] = {
                original: price,
                discounted: null,
              };
              fetchedOriginalPrices[plan] = parseFloat(price) || 0;
            } else {
              fetchedPrices[plan] = {
                original: "0.00",
                discounted: null,
              };
              fetchedOriginalPrices[plan] = 0;
              console.error(
                `Failed to fetch price for plan ${plan}:`,
                planPriceData.message
              );
            }
          } catch (error) {
            fetchedPrices[plan] = {
              original: "0.00",
              discounted: null,
            };
            fetchedOriginalPrices[plan] = 0;
            console.error(`Error fetching price for plan ${plan}:`, error);
          }
        }

        setPrices(fetchedPrices);
        setOriginalPrices(fetchedOriginalPrices);
      } else {
        console.error("Failed to fetch price data:", data.message);
        // Set default values if fetch fails
        const defaultPrices = {};
        const defaultOriginalPrices = {};
        ["starter", "pro", "premium", "extreme"].forEach((plan) => {
          defaultPrices[plan] = {
            original: "0.00",
            discounted: null,
          };
          defaultOriginalPrices[plan] = 0;
        });
        setPrices(defaultPrices);
        setOriginalPrices(defaultOriginalPrices);
      }
    } catch (error) {
      console.error("Error fetching prices:", error);
      // Set default values if fetch fails
      const defaultPrices = {};
      const defaultOriginalPrices = {};
      ["starter", "pro", "premium", "extreme"].forEach((plan) => {
        defaultPrices[plan] = {
          original: "0.00",
          discounted: null,
        };
        defaultOriginalPrices[plan] = 0;
      });
      setPrices(defaultPrices);
      setOriginalPrices(defaultOriginalPrices);
    } finally {
      setLoading(false);
    }
  };

  const validateCoupon = async (planType) => {
    const couponCode = document
      .getElementById(`coupon-${planType}`)
      ?.value?.trim();
    if (!couponCode) {
      alert("Please enter a coupon code.");
      return;
    }
    setCouponLoading((prev) => ({ ...prev, [planType]: true }));
    try {
      const response = await fetch(
        "http://localhost:3000/api/validate-coupon",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coupon: couponCode,
            planType: planType,
            priceId: plans[planType],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.coupon) {
        const originalPrice = originalPrices[planType] || 0;
        let discountedPrice = originalPrice;

        if (data.coupon.percent_off) {
          discountedPrice =
            originalPrice * (1 - (data.coupon.percent_off || 0) / 100);
        } else if (data.coupon.amount_off) {
          discountedPrice = Math.max(
            0,
            originalPrice - (data.coupon.amount_off || 0) / 100
          );
        }

        setPrices((prevPrices) => ({
          ...prevPrices,
          [planType]: {
            original: originalPrice.toFixed(2),
            discounted: discountedPrice.toFixed(2),
          },
        }));

        alert(
          `Coupon applied! ${
            data.coupon.percent_off
              ? `${data.coupon.percent_off}% off`
              : `$${((data.coupon.amount_off || 0) / 100).toFixed(2)} off`
          }`
        );
      } else {
        // Reset to original price
        const originalPrice = originalPrices[planType] || 0;
        setPrices((prevPrices) => ({
          ...prevPrices,
          [planType]: {
            original: originalPrice.toFixed(2),
            discounted: null,
          },
        }));
        alert(data.message || "Invalid coupon code.");
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      alert("Error validating coupon. Please try again later.");
      // Reset price on error
      const originalPrice = originalPrices[planType] || 0;
      setPrices((prevPrices) => ({
        ...prevPrices,
        [planType]: {
          original: originalPrice.toFixed(2),
          discounted: null,
        },
      }));
    } finally {
      setCouponLoading((prev) => ({ ...prev, [planType]: false }));
    }
  };

  const handleSubscribe = async (planType) => {
    const priceId = plans[planType];
    const couponCode =
      document.getElementById(`coupon-${planType}`)?.value || "";

    const isSubscription = true;
    await redirectToCheckout(priceId, isSubscription, couponCode);
  };

  const redirectToCheckout = async (priceId, isSubscription, coupon) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId, isSubscription, coupon }),
        }
      );

      const data = await response.json();

      if (data.success) {
        window.location.href = data.url;
      } else {
        console.error("Failed to create checkout session:", data.message);
        alert(data.message || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
        <h1 className="display-5  fw-bold">Pricing</h1>
        <p className="text-muted text-wrap">
          In today's digital world, offering subscription plans with seamless
          payment processing is key for any business. A subscription page that
          integrates Stripe's powerful payment features, <br></br>ncludes
          real-time pricing updates, and applies coupon codes, you've come to
          the right place!
        </p>
      </div>

      <div className="container d-flex justify-content-center">
        <div className="row row-cols-1 row-cols-md-4 mb-3 text-center justify-content-center">
          {loading ? (
            <p className="text-light">Loading plans...</p>
          ) : (
            ["starter", "pro", "premium", "extreme"].map((planType, index) => {
              const headerBgClasses = [
                "bg-info",
                "bg-warning",
                "bg-success",
                "bg-danger",
              ];
              const currentPrice = prices[planType] || {
                original: "0.00",
                discounted: null,
              };

              return (
                <div className="col-md-3 mb-4" key={planType}>
                  <div className="card shadow-lg h-100 rounded-4 bg-light">
                    <div
                      className={`card-header py-3 text-white ${headerBgClasses[index]} d-flex justify-content-between align-items-center rounded-top`}
                    >
                      <h4 className="my-0 fw-normal">
                        {planType.charAt(0).toUpperCase() + planType.slice(1)}
                      </h4>
                      {activePlan === planType && (
                        <span className="badge bg-dark">&bull;</span>
                      )}
                    </div>
                    <div className="card-body text-dark p-3">
                      <h1 className="card-title pricing-card-title">
                        {currentPrice.discounted ? (
                          <>
                            <span className="text-decoration-line-through text-muted">
                              ${currentPrice.original}
                            </span>{" "}
                            <span className="text-success">
                              ${currentPrice.discounted}
                            </span>
                          </>
                        ) : (
                          `$${currentPrice.original}`
                        )}
                      </h1>
                      <small className="text-muted d-block mb-3">
                        {planType === "starter"
                          ? "weekly"
                          : planType === "pro"
                          ? "monthly"
                          : "yearly"}
                      </small>
                      <ul className="list-unstyled mt-2 mb-3 fw-bold">
                        <li>
                          {planType === "starter"
                            ? "10 users included"
                            : planType === "pro"
                            ? "20 users included"
                            : planType === "premium"
                            ? "30 users included"
                            : "Unlimited users"}
                        </li>
                        <li>
                          {planType === "starter"
                            ? "2 GB of storage"
                            : planType === "pro"
                            ? "10 GB of storage"
                            : planType === "premium"
                            ? "15 GB of storage"
                            : "20 GB of storage"}
                        </li>
                        <li>
                          {planType === "starter"
                            ? "Email support"
                            : "Phone and email support"}
                        </li>
                        <li>Help center access</li>
                      </ul>
                      <p className="lead">
                        {planType === "starter"
                          ? "Perfect for individuals or small teams & partners just getting started."
                          : planType === "pro"
                          ? "Designed for growing teams, offering enhanced features and flexibility."
                          : planType === "premium"
                          ? "Unlock the full potential with personalized onboarding support."
                          : "Access exclusive features like advanced analytics inriched integrations."}
                      </p>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Enter coupon code"
                          id={`coupon-${planType}`}
                          disabled={couponLoading[planType]}
                        />
                        <button
                          onClick={() => validateCoupon(planType)}
                          className="w-100 btn btn-sm btn-secondary mb-2"
                          disabled={couponLoading[planType]}
                        >
                          {couponLoading[planType]
                            ? "Validating..."
                            : "Apply Coupon"}
                        </button>
                      </div>
                      <button
                        onClick={() => handleSubscribe(planType)}
                        id={`subscribe-${planType}`}
                        className="w-100 btn btn-lg btn-outline-dark"
                        disabled={couponLoading[planType]}
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
