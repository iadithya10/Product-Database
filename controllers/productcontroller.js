const db = require("../db");

exports.createProduct = (req, res) => {
  const { name, created_by, updated_by } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Product name is required" });
  }

  const sql =
    "INSERT INTO products (name, created_by, updated_by) VALUES (?, ?, ?)";

  db.query(sql, [name, created_by, updated_by], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertId
    });
  });
};


exports.getProducts = (req, res) => {
  const sql = "SELECT * FROM products";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  });
};

exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, updated_by } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Product name is required" });
  }

  const sql =
    "UPDATE products SET name = ?, updated_by = ? WHERE id = ?";

  db.query(sql, [name, updated_by, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully"
    });
  });
};


exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM products WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });
  });
};
