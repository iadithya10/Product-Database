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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  //  total count
  const countSql = "SELECT COUNT(*) AS total FROM products";

  db.query(countSql, (countErr, countResult) => {
    if (countErr) {
      console.error(countErr);
      return res.status(500).json({ message: "Database error" });
    }

    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    // Get paginated data
    const dataSql = "SELECT * FROM products LIMIT ? OFFSET ?";

    db.query(dataSql, [limit, offset], (dataErr, results) => {
      if (dataErr) {
        console.error(dataErr);
        return res.status(500).json({ message: "Database error" });
      }

      res.status(200).json({
        page,
        limit,
        totalRecords,
        totalPages,
        data: results
      });
    });
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
