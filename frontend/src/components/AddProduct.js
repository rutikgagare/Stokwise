import React, { useState } from "react";
import classes from "./AddProduct.module.css";
import {useDispatch, useSelector } from "react-redux";
import { productActions } from "../store/productSlice";

const AddProduct = (props) => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);

  const [name, setName] = useState();
  const [unit, setUnit] = useState();
  const [costPrice, setCostPrice] = useState();
  const [sellingPrice, setSellingPrice] = useState();

  const createProductHandler = async(e)=> {

    e.preventDefault();
    try {
      const response = await fetch("http://localhost:9999/product/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name,
          unit,
          costPrice,
          sellingPrice,
          orgId: org?._id,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        dispatch(productActions.addProduct(json));
      }

    } catch (err) {
      console.log(err);
    }
    props.onClose();

  };

  return (
    <div className={classes.main}>
      <div className={classes.addProduct}>
        <div className={classes.header}>
          <h3>New Product</h3>
          <button onClick={() => props.onClose()}>Cancel</button>
        </div>

        <div className={classes.addProductForm} onSubmit={createProductHandler}>
          <form>
            <div className={classes.inputDiv}>
              <label htmlFor="name">Product Name</label>
              <input
                id="name"
                type="text"
                value={name}
                placeholder="Enter product name"
                onChange={(e) => setName(e.target.value)}
                required="true"
              />
            </div>

            <div className={classes.inputDiv}>
              <label htmlFor="unit">Unit</label>
              <select
                name=""
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required="true"
              >
                <option value="">Slect Unit</option>
                <option value="pcs">pcs</option>
                <option value="Kg">Kg</option>
                <option value="g">g</option>
                <option value="box">box</option>
                <option value="dz">dz</option>
                <option value="l">dz</option>
              </select>
            </div>

            <div className={classes.inputDiv}>
              <label htmlFor="costPrice">Cost Price</label>
              <input
                id="costPrice"
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="Enter cost price in INR"
                required="true"
              />
            </div>

            <div className={classes.inputDiv}>
              <label htmlFor="sellPrice">Selling Price</label>
              <input
                id="sellPrice"
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="Enter cost price in INR"
                required="true"
              />
            </div>

            <button type="submit">Add Product</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
