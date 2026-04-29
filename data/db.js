// ═══════════════════════════════════════════════════
// DATABASE NAHWU — amogenzdb-lv1
// Ganti/tambah isi array ini dengan database aslimu
// ═══════════════════════════════════════════════════

const DB = [
  {
    teks_kalimat: "ذَهَبَ الطَّالِبُ إِلَى الْمَدْرَسَةِ",
    judul: "Dzahaba ath-Thaalib",
    analysis: [
      {
        word: "الطَّالِبُ",
        steps: {
          1: {
            question: "Apa kedudukan الطَّالِبُ dalam kalimat?",
            options: ["Fa'il (فاعل)", "Maf'ul Bih", "Mubtada", "Khabar"],
            correct: "Fa'il (فاعل)",
            explanation: "الطَّالِبُ adalah Fa'il karena ia pelaku dari fi'il ذَهَبَ, dibaca rafa' dengan tanda dhammah."
          },
          2: {
            question: "Tanda i'rab الطَّالِبُ adalah?",
            options: ["Dhammah ضمة", "Fathah فتحة", "Kasrah كسرة", "Sukun سكون"],
            correct: "Dhammah ضمة",
            explanation: "Fa'il dibaca rafa' dengan tanda dhammah karena isim mufrad."
          },
          3: {
            question: "الطَّالِبُ termasuk isim jenis apa?",
            options: ["Isim Ma'rifah", "Isim Nakirah", "Isim Dhamir", "Isim Isyarah"],
            correct: "Isim Ma'rifah",
            explanation: "الطَّالِبُ adalah isim ma'rifah karena ada ال (alif lam) di awalnya."
          }
        }
      },
      {
        word: "الْمَدْرَسَةِ",
        steps: {
          1: {
            question: "Kedudukan الْمَدْرَسَةِ dalam kalimat?",
            options: ["Majrur (مجرور)", "Marfu'", "Manshub", "Mudhaf Ilaih"],
            correct: "Majrur (مجرور)",
            explanation: "الْمَدْرَسَةِ adalah majrur karena didahului huruf jar إِلَى."
          },
          2: {
            question: "Huruf jar yang masuk pada الْمَدْرَسَةِ adalah?",
            options: ["إِلَى", "مِنْ", "عَلَى", "فِي"],
            correct: "إِلَى",
            explanation: "إِلَى bermakna 'menuju/ke', ia menjarkan isim yang ada setelahnya."
          }
        }
      }
    ]
  },
  {
    teks_kalimat: "الْكِتَابُ عَلَى الْمَكْتَبِ",
    judul: "Al-Kitaabu 'alal Maktab",
    analysis: [
      {
        word: "الْكِتَابُ",
        steps: {
          1: {
            question: "Kedudukan الْكِتَابُ dalam jumlah ismiyyah ini?",
            options: ["Mubtada (مبتدأ)", "Khabar", "Fa'il", "Maf'ul Bih"],
            correct: "Mubtada (مبتدأ)",
            explanation: "الْكِتَابُ adalah Mubtada, isim yang menjadi pokok pembicaraan, dibaca rafa' dengan dhammah."
          },
          2: {
            question: "I'rab الْكِتَابُ adalah?",
            options: ["Rafa' - Mubtada", "Nashab - Maf'ul", "Jar - Majrur", "Jazm"],
            correct: "Rafa' - Mubtada",
            explanation: "Mubtada wajib dibaca rafa', tandanya dhammah pada akhir kata."
          }
        }
      },
      {
        word: "الْمَكْتَبِ",
        steps: {
          1: {
            question: "Jar majrur عَلَى الْمَكْتَبِ berkedudukan sebagai?",
            options: ["Khabar (خبر)", "Mubtada", "Fa'il", "Na'at"],
            correct: "Khabar (خبر)",
            explanation: "Jar majrur عَلَى الْمَكْتَبِ menjadi Khabar dari mubtada الْكِتَابُ. Artinya: 'Kitab itu di atas meja'."
          },
          2: {
            question: "Makna huruf jar عَلَى adalah?",
            options: ["Di atas", "Di bawah", "Di dalam", "Di samping"],
            correct: "Di atas",
            explanation: "عَلَى bermakna 'di atas'. Kalimat ini berarti: Kitab itu (berada) di atas meja."
          },
          3: {
            question: "Tanda jar الْمَكْتَبِ adalah?",
            options: ["Kasrah كسرة", "Dhammah", "Fathah", "Tanwin"],
            correct: "Kasrah كسرة",
            explanation: "Isim mufrad yang dijarkan tanda jar-nya adalah kasrah di akhir kata."
          }
        }
      }
    ]
  },
  {
    teks_kalimat: "يَكْتُبُ مُحَمَّدٌ الدَّرْسَ",
    judul: "Yaktubu Muhammad",
    analysis: [
      {
        word: "يَكْتُبُ",
        steps: {
          1: {
            question: "يَكْتُبُ termasuk fi'il jenis apa?",
            options: ["Fi'il Mudhari'", "Fi'il Madhi", "Fi'il Amr", "Isim Fi'il"],
            correct: "Fi'il Mudhari'",
            explanation: "يَكْتُبُ adalah fi'il mudhari' karena diawali huruf mudhara'ah ي, menunjukkan sedang/akan menulis."
          },
          2: {
            question: "Tanda rafa' fi'il mudhari يَكْتُبُ adalah?",
            options: ["Dhammah ضمة", "Fathah فتحة", "Nun Tauqid", "Sukun"],
            correct: "Dhammah ضمة",
            explanation: "Fi'il mudhari asalnya dirafa' dengan dhammah jika tidak dimasuki nawashib atau jawazim."
          }
        }
      },
      {
        word: "الدَّرْسَ",
        steps: {
          1: {
            question: "Kedudukan الدَّرْسَ dalam kalimat?",
            options: ["Maf'ul Bih (مفعول به)", "Fa'il", "Mubtada", "Khabar"],
            correct: "Maf'ul Bih (مفعول به)",
            explanation: "الدَّرْسَ adalah Maf'ul Bih (objek penderita), yaitu yang dikenai perbuatan menulis."
          },
          2: {
            question: "Tanda nashab الدَّرْسَ adalah?",
            options: ["Fathah فتحة", "Kasrah", "Dhammah", "Alif"],
            correct: "Fathah فتحة",
            explanation: "Maf'ul bih dibaca nashab. Tanda nashab isim mufrad adalah fathah di akhir kata."
          }
        }
      }
    ]
  },
  {
    teks_kalimat: "هَذَا كِتَابٌ جَدِيدٌ",
    judul: "Hadzaa Kitaabun Jadiid",
    analysis: [
      {
        word: "هَذَا",
        steps: {
          1: {
            question: "هَذَا termasuk isim jenis apa?",
            options: ["Isim Isyarah", "Isim Dhamir", "Isim Mausul", "Isim Nakirah"],
            correct: "Isim Isyarah",
            explanation: "هَذَا adalah isim isyarah (kata tunjuk) untuk benda dekat tunggal mudzakkar, artinya 'ini'."
          },
          2: {
            question: "هَذَا berkedudukan sebagai?",
            options: ["Mubtada (مبتدأ)", "Khabar", "Fa'il", "Maf'ul"],
            correct: "Mubtada (مبتدأ)",
            explanation: "هَذَا adalah mubtada dari jumlah ismiyyah ini."
          }
        }
      },
      {
        word: "كِتَابٌ",
        steps: {
          1: {
            question: "كِتَابٌ berkedudukan sebagai?",
            options: ["Khabar (خبر)", "Mubtada", "Fa'il", "Na'at"],
            correct: "Khabar (خبر)",
            explanation: "كِتَابٌ adalah khabar dari mubtada هَذَا. Khabar memberitakan keadaan mubtada."
          },
          2: {
            question: "كِتَابٌ termasuk isim jenis apa?",
            options: ["Isim Nakirah", "Isim Ma'rifah", "Isim Dhamir", "Isim Isyarah"],
            correct: "Isim Nakirah",
            explanation: "كِتَابٌ adalah isim nakirah (tidak tentu) karena tidak ada alif lam dan berakhiran tanwin."
          }
        }
      }
    ]
  },
  {
    teks_kalimat: "خَرَجَ الْمُعَلِّمُ مِنَ الْفَصْلِ",
    judul: "Kharaja al-Mu'allimu",
    analysis: [
      {
        word: "خَرَجَ",
        steps: {
          1: {
            question: "خَرَجَ termasuk fi'il jenis apa?",
            options: ["Fi'il Madhi", "Fi'il Mudhari'", "Fi'il Amr", "Isim Masdar"],
            correct: "Fi'il Madhi",
            explanation: "خَرَجَ adalah fi'il madhi (lampau) karena menunjukkan kejadian yang sudah terjadi."
          },
          2: {
            question: "Dhamir yang tersimpan dalam خَرَجَ adalah?",
            options: ["هُوَ (dia lk)", "هِيَ (dia pr)", "أَنْتَ (kamu)", "نَحْنُ (kami)"],
            correct: "هُوَ (dia lk)",
            explanation: "خَرَجَ menyimpan dhamir هُوَ karena fa'ilnya الْمُعَلِّمُ adalah mudzakkar mufrad."
          }
        }
      },
      {
        word: "الْمُعَلِّمُ",
        steps: {
          1: {
            question: "Kedudukan الْمُعَلِّمُ dalam kalimat?",
            options: ["Fa'il (فاعل)", "Mubtada", "Maf'ul Bih", "Khabar"],
            correct: "Fa'il (فاعل)",
            explanation: "الْمُعَلِّمُ adalah fa'il (pelaku) dari fi'il خَرَجَ, dibaca rafa' dengan dhammah."
          }
        }
      },
      {
        word: "الْفَصْلِ",
        steps: {
          1: {
            question: "الْفَصْلِ dibaca jar karena?",
            options: ["Didahului huruf jar مِنْ", "Ia mubtada", "Ia fa'il", "Ia maf'ul"],
            correct: "Didahului huruf jar مِنْ",
            explanation: "الْفَصْلِ dibaca jar (kasrah) karena didahului huruf jar مِنَ yang bermakna 'dari'."
          }
        }
      }
    ]
  }
];

module.exports = DB;
