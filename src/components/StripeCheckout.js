import React, { useState, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useCartContext } from "../context/cart_context";
import { useUserContext } from "../context/user_context";
import { formatPrice } from "../utils/helpers";

const StripeCheckout = () => {
  const { myUser } = useUserContext();
  const { total_amount, shipping_fee, cart } = useCartContext();
  const [data, setData] = useState({});
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);

  console.log(myUser);

  const getPayment = async () => {
    setLoading(true);
    let amount = total_amount + shipping_fee;
    let sessionId = myUser.sub;
    try {
      const res = await axios.post(
        "https://hololivfans-project-api.herokuapp.com/api/pago/create",
        {
          cart,
          amount,
          sessionId,
        }
      );

      setData({
        ...data,
        token: res.data.response.token,
        url: res.data.response.url,
      });

      localStorage.setItem("tok", JSON.stringify(res.data.response.token));

      formRef.current.submit();

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getPayment();
  };

  return (
    <Wrapper>
      <article>
        <div className="info">
          <h3>Hola, {myUser && myUser.name}</h3>
          <h3>El total es de: {formatPrice(shipping_fee + total_amount)}</h3>
        </div>
        <h4>* Se recomienda usar la tarjeta otorgada para simular el pago *</h4>
        <p>
          De todas maneras, al no estar en producción no se descontará
          <b> NADA</b> de su tarjeta.
        </p>
        <p>Puedes pagar con esta tarjeta de debito: 4051 8842 3993 7763</p>
        <p>Nº de cuenta: 11.111.111-1</p>
        <p>Contraseña: 123</p>
        <form
          name="brouterForm"
          id="brouterForm"
          method="POST"
          onSubmit={handleSubmit}
          action={data.url}
          ref={formRef}
        >
          <input type="hidden" name="token_ws" value={data.token} />
          <input
            className="buttonType"
            type="submit"
            value={`${loading ? "loading" : "Pagar"} `}
          />
        </form>
      </article>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  text-align: center;
  .info {
    margin-bottom: 4rem;
  }

  form {
    width: 30vw;
    align-self: center;
    box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
      0px 2px 5px 0px rgba(50, 50, 93, 0.1),
      0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
    border-radius: 7px;
    padding: 40px;
    margin: 0 auto;
  }

  /* Buttons and links */
  .buttonType {
    background: #5469d4;
    font-family: Arial, sans-serif;
    color: #ffffff;
    border-radius: 0 0 4px 4px;
    border: 0;
    padding: 12px 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: block;
    transition: all 0.2s ease;
    box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
    width: 100%;
  }
  .buttonType:hover {
    filter: contrast(115%);
  }
  .buttonType:disabled {
    opacity: 0.5;
    cursor: default;
  }

  @media only screen and (max-width: 600px) {
    form {
      width: 80vw;
    }
  }
`;

export default StripeCheckout;
