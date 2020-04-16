const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Категорийн нэрийг оруулна уу"],
    unique: true,
    //Хоосон зай enter-ыг автоматаар цэвэрлэнэ.
    trim: true,
    maxlength: [50, "Категорийн нэрний урт дээд тал нь 50 тэмдэгт байх ёстой."],
  },
  description: {
    type: String,
    required: [true, "Категорийн тайлбарыг заавал оруулах ёстой."],
    maxlength: [
      250,
      "Категорийн нэрний урт дээд тал нь 250 тэмдэгт байх ёстой.",
    ],
  },
  photo: {
    type: String,
    //   Хоосон хүсэлт ирэх юм бол DEFAULT -оор өгнө.
    default: "no-photo.jpg",
  },
  averageRating: {
    type: Number,
    min: [1, "Рэйтинг хамгийн багадаа 1 байх ёстой."],
    max: [10, "Хамгийн ихдээ 10 байх ёстой"],
  },
  averagePrice: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Category", CategorySchema);
