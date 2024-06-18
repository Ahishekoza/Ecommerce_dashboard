import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const DeletePage = () => {
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

  const deleteProduct = async () => {
    try {
      await axios.delete(`/api/products?id=${id}`).then((response) => {
        console.log("Object deleted successfully");
        router.push("/products");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const goBack = () => {
    router.push("/products");
  };

  return (
    <Layout>
      <h1 className="text-center">
        Do you really want to delete &nbsp;&quot;{product?.title}&quot;?
      </h1>
      <div className="flex gap-2 justify-center">
        <button onClick={deleteProduct} className="btn-red">
          Yes
        </button>
        <button className="btn-default" onClick={goBack}>
          NO
        </button>
      </div>
    </Layout>
  );
};

export default DeletePage;
