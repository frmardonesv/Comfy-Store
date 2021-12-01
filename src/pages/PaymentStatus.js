import axios from "axios";
import React, { useEffect, useState } from "react";
import { PageHero } from "../components";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useCartContext } from "../context/cart_context";

const PaymentStatus = () => {
  const { clearCart } = useCartContext();
  const [status, setStatus] = useState({});
  const tokn = JSON.parse(localStorage.getItem("tok"));
  const [loading, setLoading] = useState(true);

  let uri = "https://hololivfans-project-api.herokuapp.com/api/pago/status/";
  let uriLocal = "http://localhost:4000/api/pago/status/";

  const getStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${uri}${tokn}`);
      setStatus(res.data);
      localStorage.removeItem("tok");

      clearCart();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getStatus();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (status.vci !== "TSY") {
    return (
      <Wrapper>
        <PageHero title="Payment Status" />
        <div className="wrapper-info page">
          <h2>Ocurrio un error...</h2>
          <p>Por favor, intentalo nuevamente después.</p>
          <Link className="btn" to="/">
            Home
          </Link>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PageHero title="Payment Status" />
      <div className="wrapper-info page">
        <h2>Pago aceptado!</h2>
        <p>Monto: {status.amount}</p>
        <p>Orden de compra: {status.amount}</p>
        <Link className="btn" to="/">
          Home
        </Link>
      </div>
    </Wrapper>
  );
};

export default PaymentStatus;

const Wrapper = styled.div`
  .wrapper-info {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
`;
