// const moment = require('moment');
const db = require('../models');
const Post = db.posts;

exports.findAll = (req, res) => {
  Post.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error while retrieving data',
      });
    });
};

exports.create = (req, res) => {
  const post = new Post({
    nama_pelanggan: req.body.nama_pelanggan,
    nomor_meja: req.body.nomor_meja,
    tanggal: req.body.tanggal,
    waktu: req.body.waktu,
    jumlah_orang: req.body.jumlah_orang,
  });

  post
    .save(post)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || 'Some error while create data',
      });
    });
};

exports.findOne = (req, res) => {
  // ambil parameter query dari url
  const { name, date } = req.query;

  // jika tidak ada parameter name dan date
  if (!name && !date) {
    res.status(400).send({
      message: 'Provide either name or date to search',
    });
  }

  // filter pencarian
  let filter = {};
  if (name) {
    // pencarian case-insensitive
    filter.nama_pelanggan = { $regex: name, $options: 'i' };
  }

  if (date) {
    filter.tanggal = date;
  }

  Post.find(filter)
    .then((result) => {
      if (result.length === 0) {
        return res.status(404).send({ message: 'No data found.' });
      }
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error while show one data',
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Post.findByIdAndUpdate(id, req.body)
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: 'Data not found',
        });
      }
      res.send({
        message: 'Data was updated',
      });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || 'Some error while update data',
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Post.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        res.status(404).send({
          message: 'Data not found',
        });
      }
      res.send({
        message: 'Data was deleted',
      });
    })
    .catch((err) => {
      res.status(409).send({
        message: err.message || 'Some error while delete data',
      });
    });
};

exports.validate = async (req, res) => {
  const { nama_pelanggan, nomor_meja, tanggal, waktu, jumlah_orang } = req.body;

  // Validasi input
  if (!nama_pelanggan || !nomor_meja || !tanggal || !waktu || !jumlah_orang) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Validasi format tanggal (harus dalam format YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(tanggal)) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  // Validasi format waktu (harus dalam format HH:mm)
  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(waktu)) {
    return res.status(400).json({ message: 'Invalid time format. Use HH:mm.' });
  }

  // cek apakah meja sudah di pesan pada tanggal dan waktu tersebut
  const existingReservation = await Post.findOne({
    nomor_meja,
    tanggal,
    waktu,
  });

  if (existingReservation) {
    return res.status(400).json({ message: 'Table has reserved for someone.' });
  }

  // jika meja tersedia, simpan reservasi baru
  const newReservation = new Post({
    nama_pelanggan,
    nomor_meja,
    tanggal,
    waktu,
    jumlah_orang,
  });

  try {
    await newReservation.save();
    res.status(201).json({ message: 'Rerservation success', reservation: newReservation });
  } catch (error) {
    res.status(500).json({ message: 'Something wrong while make reservation', error: error.message });
  }
};
