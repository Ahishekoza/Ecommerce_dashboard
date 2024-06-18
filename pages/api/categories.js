import { connectDB } from "@/lib/connectDB";
import { Category } from "@/models/CategoryModel";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await isAdminRequest(req, res);
  connectDB().then(async () => {
    if (method === "GET") {
      await Category.find()
        .populate("parent")
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((error) => {
          res.status(404).send(error.message);
        });
    }

    if (method === "POST") {
      const { name, parent } = req.body;
      let data = {};
      if (parent !== "" && parent !== "0") {
        data = { name: name, parent: parent };
      } else {
        data = { name: name };
      }
      await Category.create(data)
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((error) => {
          res.status(404).send(error.message);
        });
    }

    if (method === "PUT") {
      const { name, parent, id } = req.body;
      let data = {};
      if (parent !== "" && parent !== "0") {
        data = { name: name, parent: parent };
      } else {
        data = { name: name };
      }
      await Category.findByIdAndUpdate({ _id: id }, data, { new: true })
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((error) => {
          res.status(404).send(error.message);
        });
    }

    if (method === "DELETE") {
      const { id } = req.query;
      console.log(id);
      await Category.findByIdAndDelete({ _id: id }, { new: true })
        .then((response) => {
          res.status(200).send(response);
        })
        .catch((error) => {
          res.status(404).send(error.message);
        });
    }
  });
}
