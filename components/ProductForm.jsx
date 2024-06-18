/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

const ProductForm = ({ product, id }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [goToProducts, setGoToProducts] = useState(false);
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (product) {
      setTitle(product.title || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setImages(product.images || []);
      setCategory(product.category || null);
    }
  }, [product]);

  useEffect(() => {
    axios
      .get(`/api/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, description, price, images ,category };

    if (id) {
      try {
        const response = await axios.put("/api/products", { ...data, _id: id });
        console.log(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        const response = await axios.post("/api/products", data);

        console.log(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setGoToProducts(true);
  };

  // ---Upload Images-- to S3 Bucket
  const uploadImages = async (e) => {
    // create a variable files and save the e.target.files
    // now create a Object of FormData
    // for loop the files and append each file in the form data
    // then send an axios request

    const files = e.target.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }

      const res = await axios.post("/api/uploads", data);
      console.log(...res.data.links);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  };

  function updateImagesOrder(images) {
    console.log(images);
    setImages(images);
  }

  if (goToProducts) {
    router.push("/products");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Product Name</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="product name"
      />
      <label>Category</label>
      <select
        className="flex mb-2 w-full border border-gray-200 py-2 px-1"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value={""}>Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {/* */}
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length > 0 &&
            images.map((image) => (
              <div
                key={image}
                className="h-24 w-24 bg-white p-1 shadow-sm rounded-sm border border-gray-200"
              >
                <img src={image} alt="" className="rounded-sm h-full w-full" />
              </div>
            ))}
        </ReactSortable>

        {isUploading && (
          <div className=" h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 text-sm rounded-sm border-2 flex  items-center flex-col justify-center cursor-pointer text-primary gap-1 border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Add image</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>
      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <label>Image</label>

      <label>Price (in USD)</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="price"
      />
      {product ? (
        <button type="submit" className="btn-primary">
          Edit
        </button>
      ) : (
        <button type="submit" className="btn-primary">
          Save
        </button>
      )}
    </form>
  );
};

export default ProductForm;
