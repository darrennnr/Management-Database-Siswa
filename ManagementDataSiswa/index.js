const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

const client = require("./connection");
const app = express();
const port = 3100;
const path = require("path");
const routes = require("./route");

app.use(express.static(path.join(__dirname, "views")));
app.use("/public", express.static("public"));

app.use("/", routes);

app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server berjalan di port http://localhost:${port}`);
});

client.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Connected");
  }
});

const storage = multer.diskStorage({
  destination: "public/images/",
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

app.get("/siswa", (req, res) => {
  client.query(`SELECT * from siswa`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
});

app.get("/siswa/:id", (req, res) => {
  const id = parseInt(req.params.id);
  client.query(`SELECT * FROM siswa WHERE id = $1`, [id], (err, result) => {
    if (!err) {
      if (result.rows.length > 0) {
        res.send(result.rows[0]);
      }
    } else {
      res.status(500).json({ error: err.message });
    }
  });
});

app.post("/siswa", upload.single("foto"), (req, res) => {
  const { nama_lengkap, id_siswa, jenis_kelamin, kelas } = req.body;
  const imagePath = req.file ? `/public/images/${req.file.filename}` : null;

  client.query(
    `INSERT INTO siswa (nama_lengkap, id_siswa, jenis_kelamin, kelas, foto) VALUES ($1, $2, $3, $4, $5)`,
    [nama_lengkap, id_siswa, jenis_kelamin, kelas, imagePath],
    (err, result) => {
      if (!err) {
        res.send("Insert Success");
      } else {
        console.error("Database Error:", err.message);
        res.status(500).send("Database Error: " + err.message);
      }
    }
  );
});

app.put("/siswa/:id", upload.single("foto"), (req, res) => {
  const id = parseInt(req.params.id);
  const { nama_lengkap, id_siswa, jenis_kelamin, kelas } = req.body;
  const imagePath = req.file ? `/public/images/${req.file.filename}` : null;

  client.query(`SELECT foto FROM siswa WHERE id = $1`, [id], (err, result) => {
    if (err) {
      console.error("Database Error:", err.message);
      return res.status(500).send("Database Error: " + err.message);
    }

    const oldFoto = result.rows[0].foto;
    const finalFoto = imagePath || oldFoto;

    client.query(
      `UPDATE siswa SET 
             nama_lengkap = $1,
             id_siswa = $2,
             jenis_kelamin = $3,
             kelas = $4,
             foto = $5
             WHERE id = $6`,
      [nama_lengkap, id_siswa, jenis_kelamin, kelas, finalFoto, id],
      (err, result) => {
        if (!err) {
          res.send("Update Success");
        } else {
          console.error("Database Error:", err.message);
          res.status(500).send("Database Error: " + err.message);
        }
      }
    );
  });
});

app.delete("/siswa/:id", (req, res) => {
  const id = parseInt(req.params.id);
  client.query(`DELETE FROM siswa WHERE id = $1`, [id], (err, result) => {
    if (!err) {
      res.send("Delete Success");
    } else {
      console.error("Database Error:", err.message);
      res.status(500).send("Database Error: " + err.message);
    }
  });
});