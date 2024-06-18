import { connectDB } from "@/lib/connectDB";
import { Product } from "@/models/productModel";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;

  await isAdminRequest(req, res);
  connectDB()
    .then(async () => {
      if (method === "POST") {
        const { title, description, price, images, category } = req.body;
        await Product.create({ title, description, price, images, category })
          .then((response) => {
            console.log("POST", response);
            res.status(200).json(response);
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (method === "GET") {
        if (req.query?.id) {
          await Product.findById({ _id: req.query.id })
            .then((response) => {
              res.status(200).json(response);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          await Product.find()
            .then((response) => {
              res.status(200).json(response);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }

      if (method === "DELETE") {
        if (req.query?.id) {
          await Product.findByIdAndDelete({ _id: req.query.id }, { new: true })
            .then((response) => {
              res.status(200).json(response);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }

      if (method === "PUT") {
        const { title, description, price, _id, images, category } = req.body;

        try {
          const updatedProduct = await Product.findByIdAndUpdate(
            { _id: _id },
            { title, description, price, images, category },
            { new: true }
          );

          if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
          }

          res.status(200).json(updatedProduct);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal server error" });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
