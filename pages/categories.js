/* eslint-disable react-hooks/exhaustive-deps */
import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Categories = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/categories`)
      .then((response) => {
        setCategories(response.data);
        setShouldFetch(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [shouldFetch]);

  const handleSubmitCategory = async (e) => {
    e.preventDefault();

    let data = { name: name, parent: parentCategory };

    if (editCategory) {
      await axios
        .put("/api/categories", { ...data, id: editCategory._id })
        .then(() => {
          setEditCategory(null);
          setShouldFetch(true);
          setName("");
          setParentCategory("");
        })
        .catch((err) => {
          console.log("ERROR while updating category :", err);
        });
    } else {
      await axios
        .post("/api/categories", data)
        .then(() => {
          setShouldFetch(true);
          setName("");
          setParentCategory("");
        })
        .catch((err) => {
          console.log("ERROR while creaing category :", err);
        });
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setName(category?.name);
    if (category?.parent) setParentCategory(category?.parent?._id);
    else setParentCategory("");
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      await axios.delete(`/api/categories?id=${id}`).then((response) => {
        console.log(response.data);
        setShouldFetch(true);
      });
    }
  };

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editCategory
          ? `Edit Category ${editCategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={handleSubmitCategory} className="flex gap-1 mt-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
          className="mb-0"
        />
        <select
          className="mb-0"
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
        >
          <option value={0}>No Parent Category</option>
          {categories.length > 0 &&
            categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
        <button className=" btn-primary">Save</button>
      </form>

      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category Name</td>
            <td>Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    className="btn-default mr-1"
                    onClick={() => handleEditCategory(category)}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="btn-red"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Categories;
