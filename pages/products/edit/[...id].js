import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const EditPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState();
  useEffect(() => {
    axios
      .get(`/api/products?id=${id}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);
  return (
    <Layout>
      <h1>Edit Product</h1>
      <ProductForm product={product} id={id} />
    </Layout>
  );
};

export default EditPage;
