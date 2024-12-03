module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      nama_pelanggan: String,
      nomor_meja: Number,
      tanggal: String,
      waktu: String,
      jumlah_orang: Number,
    },
    { timestamps: true }
  );

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Post = mongoose.model('posts', schema);
  return Post;
};
