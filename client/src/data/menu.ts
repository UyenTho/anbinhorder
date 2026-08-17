import { MenuCategory } from "../types";

// Toàn bộ dữ liệu được nhập lại chính xác theo 4 ảnh thực đơn:
// 1) Khai Vị + Rau
// 2) Gà - Vịt - Trứng - Cơm Lam
// 3) Hải Sản + Đồng Quê
// 4) Lươn - Ếch - Đuôi Bò - Canh Rau - Lẩu - Món Nướng
// price: null nghĩa là "Theo thời giá / Liên hệ"

export const menu: MenuCategory[] = [
  {
    id: "khai-vi-rau",
    title: "Khai Vị + Rau",
    subtitle: "Món khai vị, gỏi trộn, cơm & mỳ xào",
    image: "/menu-images/khai-vi-rau.jpg",
    groups: [
      {
        id: "khai-vi",
        title: "Khai vị",
        items: [
          { id: "khoai-tay-chien", name: "Khoai tây chiên", price: 60000 },
          { id: "ngu-qua-luoc-kho-quet", name: "Ngũ quả luộc + khô quẹt", price: 75000 },
          { id: "tau-hu-ba-sa-chien", name: "Tàu hũ ba sa chiên", price: 60000 },
          { id: "ram-tom", name: "Ram tôm", price: 110000 },
          { id: "ram-bap", name: "Ram bắp", price: 70000 },
          { id: "tep-rang-la-chanh", name: "Tép rang lá chanh", price: 110000 },
          { id: "cha-ca-thac-lac-chien-kv", name: "Chả cá thác lác chiên", price: 110000 },
          {
            id: "muc-nang-quet-chien-kv",
            name: "Mực nang quết chiên + Phô mai bò cười + Hành tím",
            price: 140000,
            tag: "Đầu bếp giới thiệu",
          },
        ],
      },
      {
        id: "mang-tre-tuoi",
        title: "Măng tre tươi",
        items: [
          { id: "mang-tron-dau", name: "Măng tre tươi trộn đậu", price: 80000 },
          { id: "mang-tron-tep", name: "Măng tre tươi trộn tép", price: 110000 },
        ],
      },
      {
        id: "goi-hoa-chuoi",
        title: "Gỏi hoa chuối",
        items: [
          { id: "goi-hoa-chuoi-tron-dau", name: "Gỏi hoa chuối trộn đậu", price: 90000 },
          { id: "goi-hoa-chuoi-tron-tom-bo", name: "Gỏi hoa chuối trộn tôm / thịt bò", price: 130000 },
        ],
      },
      {
        id: "salad-rong-nho",
        title: "Salad & Rau",
        items: [
          { id: "salad-rong-nho", name: "Salad trộn rong nho", price: null },
          { id: "rau-xao-luoc", name: "Rau các loại: xào / luộc", price: null },
          { id: "my-xao", name: "Mỳ xào nấm / xào bò / hải sản", price: 85000 },
        ],
      },
      {
        id: "com-chien",
        title: "Cơm chiên",
        items: [
          { id: "com-chien-trung", name: "Cơm chiên trứng", price: 60000 },
          { id: "com-chien-an-binh-hai-san", name: "Cơm chiên An Bình / Hải sản", price: 85000 },
        ],
      },
    ],
  },
  {
    id: "ga-vit-trung",
    title: "Gà - Vịt - Trứng",
    subtitle: "Gà thả vườn, vịt xiêm, trứng gà ta & cơm lam",
    image: "/menu-images/ga-vit-trung.jpg",
    groups: [
      {
        id: "ga-kien-thung",
        title: "Gà kiến thùng thả vườn",
        items: [
          { id: "ga-kt-combo-com-lam", name: "Combo gà nướng + cơm lam", price: 360000 },
          { id: "ga-kt-nua-con", name: "1/2 con (có cơm lam)", price: 190000 },
          { id: "ga-kt-len-mam", name: "Lên mâm", price: 350000 },
          {
            id: "ga-kt-luoc-hap-kho",
            name: "Luộc / Hấp mắm nhĩ / Kho sả",
            price: 320000,
            options: ["Luộc", "Hấp mắm nhĩ", "Kho sả"],
          },
        ],
      },
      {
        id: "ga-ta-tha-vuon",
        title: "Gà ta thả vườn",
        items: [
          {
            id: "ga-ta-luoc-hap",
            name: "Luộc / Hấp mắm",
            price: 450000,
            unit: "/con",
            options: ["Luộc", "Hấp mắm"],
          },
          {
            id: "ga-ta-nau-ot-xiem",
            name: "Nấu ớt xiêm / Lên mâm",
            price: 480000,
            unit: "/con",
            options: ["Nấu ớt xiêm", "Lên mâm"],
          },
        ],
      },
      {
        id: "com-lam",
        title: "Cơm lam",
        items: [{ id: "com-lam", name: "Cơm lam", price: 20000, unit: "/ống" }],
      },
      {
        id: "ga-ho-mong",
        title: "Gà Hò - Móng",
        items: [
          { id: "ga-ho-mong-luoc-nuong", name: "Luộc, nướng", price: 320000, unit: "/con" },
          { id: "ga-ho-mong-nau-bap-chuoi", name: "Nấu bắp chuối", price: 350000, unit: "/con" },
        ],
      },
      {
        id: "vit-xiem",
        title: "Vịt xiêm 3 món",
        items: [{ id: "vit-xiem-3-mon", name: "Vịt xiêm 3 món", price: 190000, unit: "/kg" }],
      },
      {
        id: "vit-troi",
        title: "Vịt trời",
        items: [
          { id: "vit-troi-luoc-nuong", name: "Luộc / Nướng", price: 320000, unit: "/con" },
          { id: "vit-troi-3-mon", name: "3 món", price: 390000, unit: "/con" },
        ],
      },
      {
        id: "trung-ga-ta",
        title: "Trứng gà ta",
        items: [
          {
            id: "trung-ga-ta",
            name: "Luộc, la-cơ / Chưng lá mơ",
            price: null,
            options: ["Luộc", "La-cơ", "Chưng lá mơ"],
          },
        ],
      },
      {
        id: "trung-vit-bach-thao",
        title: "Trứng vịt bách thảo",
        items: [
          {
            id: "trung-vit-bach-thao",
            name: "Nấu rau tập tàng / rau dền",
            price: 90000,
            unit: "/tô",
          },
        ],
      },
    ],
  },
  {
    id: "hai-san-dong-que",
    title: "Hải Sản + Đồng Quê",
    subtitle: "Tươi ngon mỗi ngày",
    image: "/menu-images/hai-san-dong-que.jpg",
    groups: [
      {
        id: "ca-dia-bo-thoc",
        title: "Cá dìa / Cá bò / Cá thóc",
        items: [
          {
            id: "ca-dia-bo-thoc",
            name: "Nướng muối ớt / Nấu ngót",
            price: null,
            options: ["Nướng muối ớt", "Nấu ngót"],
          },
        ],
      },
      {
        id: "ca-bop-bien",
        title: "Cá bớp biển",
        items: [
          {
            id: "ca-bop-bien",
            name: "Kho tộ / Nấu măng / Nấu lẩu",
            price: null,
            tag: "Theo thời giá",
            options: ["Kho tộ", "Nấu măng", "Nấu lẩu"],
          },
        ],
      },
      {
        id: "muc-duoi",
        title: "Mực đuôi",
        items: [
          {
            id: "muc-duoi",
            name: "Hấp gừng / Nướng sa tế / Nấu rau muống",
            price: null,
            tag: "Theo thời giá",
            options: ["Hấp gừng", "Nướng sa tế", "Nấu rau muống"],
          },
        ],
      },
      {
        id: "muc-com-loai-1",
        title: "Mực cơm loại I",
        items: [
          {
            id: "muc-com-loai-1",
            name: "Hấp gừng / Nướng muối ớt / Chiên mắm / Nấu rau muống",
            price: null,
            tag: "Theo thời giá",
            options: ["Hấp gừng", "Nướng muối ớt", "Chiên mắm", "Nấu rau muống"],
          },
        ],
      },
      {
        id: "cha-ca-thac-lac-hs",
        title: "Chả cá thác lác",
        items: [
          { id: "cha-ca-thac-lac-chien-hs", name: "Chả cá thác lác chiên", price: 110000 },
          { id: "cha-ca-thac-lac-nau-kho-qua", name: "Chả cá thác lác nấu khổ qua", price: 130000 },
        ],
      },
      {
        id: "muc-nang-quet-chien-hs",
        title: "Mực nang quết chiên",
        items: [
          { id: "muc-nang-quet-chien", name: "Mực nang quết chiên", price: 140000 },
          { id: "muc-nang-quet-nau-kho-qua", name: "Mực nang quết nấu khổ qua", price: 160000 },
        ],
      },
      {
        id: "ca-chach-hs",
        title: "Cá chạch",
        items: [
          { id: "ca-chach-om-nghe-chien-gion", name: "Om nghệ / Chiên giòn", price: 110000 },
          { id: "ca-chach-om-chuoi-dau", name: "Om chuối đậu", price: 130000 },
        ],
      },
      {
        id: "ca-diec",
        title: "Cá diếc",
        items: [
          {
            id: "ca-diec-nau-rau-ram",
            name: "Cá diếc nấu rau răm",
            price: null,
            tag: "Theo mùa",
          },
        ],
      },
      {
        id: "ca-loc",
        title: "Cá lóc",
        items: [
          {
            id: "ca-loc-nuong-chien",
            name: "Nướng muối ớt / Chiên mắm ớt tỏi",
            price: 140000,
            options: ["Nướng muối ớt", "Chiên mắm ớt tỏi"],
          },
          { id: "ca-loc-sot-me", name: "Cá lóc sốt me", price: 140000 },
        ],
      },
    ],
  },
  {
    id: "luon-ech-dong-que",
    title: "Lươn - Ếch - Lẩu - Nướng",
    subtitle: "Canh rau, món nướng ống tre & các loại lẩu",
    image: "/menu-images/luon-ech-dong-que.jpg",
    groups: [
      {
        id: "luon",
        title: "Lươn",
        items: [
          { id: "luon-om-chuoi", name: "Lươn om chuối", price: 110000 },
          { id: "luon-om-nghe-xao-sa-ot", name: "Lươn om nghệ / Xào sả ớt", price: 90000 },
        ],
      },
      {
        id: "ech",
        title: "Ếch",
        items: [
          {
            id: "ech-xao-sa-ot-chien-mam",
            name: "Xào sả ớt / Chiên nước mắm",
            price: null,
          },
          { id: "ech-chien-bo", name: "Chiên bơ", price: null },
        ],
      },
      {
        id: "duoi-bo",
        title: "Đuôi bò",
        items: [
          { id: "duoi-bo-ham-cu", name: "Hầm củ", price: 190000 },
          { id: "duoi-bo-nau-bap-chuoi", name: "Nấu bắp chuối", price: 190000 },
        ],
      },
      {
        id: "canh-rau",
        title: "Canh rau",
        items: [
          {
            id: "canh-hen-tep-dong",
            name: "Hến / tép đồng nấu các loại rau",
            price: 75000,
          },
        ],
      },
      {
        id: "lau",
        title: "Lẩu",
        items: [
          { id: "lau-ca-bop", name: "Lẩu cá bớp", price: 250000 },
          { id: "lau-ca-chach", name: "Lẩu cá chạch", price: 160000 },
          { id: "lau-hai-san", name: "Lẩu hải sản", price: 210000 },
          { id: "lau-ca-loc", name: "Lẩu cá lóc", price: 160000 },
          { id: "lau-ech-luon", name: "Lẩu ếch / lươn", price: 160000 },
        ],
      },
      {
        id: "mon-nuong",
        title: "Món nướng",
        items: [
          { id: "nem-nuong", name: "Nem nướng", price: null },
          { id: "heo-rung-nuong-ong-tre", name: "Heo rừng nướng ống tre", price: 130000 },
          { id: "cha-oc-ong-tre", name: "Chả ốc ống tre", price: null },
          { id: "pa-te-nuong-ong-tre", name: "Pa-tê nướng ống tre", price: 110000 },
          { id: "suon-nuong", name: "Sườn nướng", price: 100000 },
          { id: "ba-chi-nuong", name: "Ba chỉ nướng", price: 90000 },
          { id: "bo-cau-roti-chim-cut-roti", name: "Bồ câu rô ti / Chim cút rô ti", price: null },
        ],
      },
    ],
  },
];

export function findMenuItem(itemId: string) {
  for (const cat of menu) {
    for (const group of cat.groups) {
      const found = group.items.find((i) => i.id === itemId);
      if (found) return found;
    }
  }
  return undefined;
}
