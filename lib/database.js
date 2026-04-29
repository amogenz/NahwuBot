// ============================================================
// DATABASE NAHWU
// Ganti/tambah isi array ini dengan database amogenzdb kamu
// Format: { teks_kalimat, analysis: [{ word, steps: { 1:{question,options,correct,explanation} } }] }
// ============================================================

export const DB = [
  {
    teks_kalimat: "ذَهَبَ الطَّالِبُ إِلَى الْمَدْرَسَةِ",
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
            options: ["Dhammah (ضمة)", "Fathah (فتحة)", "Kasrah (كسرة)", "Sukun (سكون)"],
            correct: "Dhammah (ضمة)",
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
            explanation: "إِلَى bermakna 'menuju/ke', dan menjarkan isim setelahnya."
          }
        }
      }
    ]
  },
  {
    teks_kalimat: "الْكِتَابُ عَلَى الْمَكْتَبِ",
    analysis: [
      {
        word: "الْكِتَابُ",
        steps: {
          1: {
            question: "Kedudukan الْكِتَابُ dalam jumlah ismiyyah ini?",
            options: ["Mubtada (مبتدأ)", "Khabar", "Fa'il", "Maf'ul"],
            correct: "Mubtada (مبتدأ)",
            explanation: "الْكِتَابُ adalah Mubtada, dibaca rafa' dengan dhammah karena isim mufrad."
          },
          2: {
            question: "I'rab الْكِتَابُ adalah?",
            options: ["Rafa' - Mubtada", "Nashab - Maf'ul", "Jar - Majrur", "Jazm"],
            correct: "Rafa' - Mubtada",
            explanation: "Mubtada wajib dibaca rafa', tandanya dhammah pada akhirnya."
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
            explanation: "Jar majrur عَلَى الْمَكْتَبِ menjadi Khabar dari mubtada الْكِتَابُ."
          },
          2: {
            question: "Makna huruf jar عَلَى adalah?",
            options: ["Di atas", "Di bawah", "Di dalam", "Di samping"],
            correct: "Di atas",
            explanation: "عَلَى bermakna 'di atas', sehingga kalimat bermakna 'kitab itu di atas meja'."
          },
          3: {
            question: "Tanda jar الْمَكْتَبِ adalah?",
            options: ["Kasrah (كسرة)", "Dhammah", "Fathah", "Tanwin"],
            correct: "Kasrah (كسرة)",
            explanation: "Isim mufrad yang dijarkan tanda jar-nya adalah kasrah di akhir kata."
          }
        }
      }
    ]
  },
  {
    teks_kalimat: "يَكْتُبُ مُحَمَّدٌ الدَّرْسَ",
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
            question: "Tanda i'rab fi'il mudhari يَكْتُبُ dalam kondisi ini?",
            options: ["Rafa' - Dhammah", "Nashab - Fathah", "Jazm - Sukun", "Mabniy"],
            correct: "Rafa' - Dhammah",
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
            explanation: "الدَّرْسَ adalah Maf'ul Bih (objek), yaitu yang dikenai perbuatan 'menulis'."
          },
          2: {
            question: "Tanda nashab الدَّرْسَ adalah?",
            options: ["Fathah (فتحة)", "Kasrah", "Dhammah", "Alif"],
            correct: "Fathah (فتحة)",
            explanation: "Maf'ul bih dibaca nashab, tanda nashab isim mufrad adalah fathah."
          }
        }
      }
    ]
  },
  {
    teks_kalimat: "جَاءَ الْمُعَلِّمُ مِنَ الْمَسْجِدِ",
    analysis: [
      {
        word: "الْمُعَلِّمُ",
        steps: {
          1: {
            question: "Kedudukan الْمُعَلِّمُ dalam kalimat ini?",
            options: ["Fa'il (فاعل)", "Mubtada", "Maf'ul Bih", "Khabar"],
            correct: "Fa'il (فاعل)",
            explanation: "الْمُعَلِّمُ adalah Fa'il dari fi'il جَاءَ, dibaca rafa' dengan dhammah."
          },
          2: {
            question: "الْمُعَلِّمُ berasal dari wazan apa?",
            options: ["مُفَعِّل", "فَاعِل", "مَفْعُول", "فَعِيل"],
            correct: "مُفَعِّل",
            explanation: "الْمُعَلِّمُ berasal dari wazan مُفَعِّل yang bermakna orang yang mengajar (isim fa'il dari fi'il II)."
          }
        }
      },
      {
        word: "الْمَسْجِدِ",
        steps: {
          1: {
            question: "الْمَسْجِدِ dalam kalimat berkedudukan sebagai?",
            options: ["Majrur - مجرور", "Maf'ul Bih", "Mubtada", "Fa'il"],
            correct: "Majrur - مجرور",
            explanation: "الْمَسْجِدِ adalah majrur karena didahului huruf jar مِنَ."
          },
          2: {
            question: "Huruf jar مِنَ bermakna?",
            options: ["Dari", "Ke", "Di", "Dengan"],
            correct: "Dari",
            explanation: "مِنَ bermakna 'dari', menunjukkan asal/awal perjalanan."
          }
        }
      }
    ]
  },
  {
    teks_kalimat: "هَذَا كِتَابٌ جَدِيدٌ",
    analysis: [
      {
        word: "هَذَا",
        steps: {
          1: {
            question: "هَذَا termasuk jenis kata apa?",
            options: ["Isim Isyarah", "Isim Dhamir", "Isim Maushul", "Isim Ma'rifah biasa"],
            correct: "Isim Isyarah",
            explanation: "هَذَا adalah isim isyarah (kata tunjuk) untuk benda tunggal dekat, artinya 'ini'."
          },
          2: {
            question: "هَذَا dalam kalimat ini berkedudukan sebagai?",
            options: ["Mubtada (مبتدأ)", "Khabar", "Fa'il", "Maf'ul"],
            correct: "Mubtada (مبتدأ)",
            explanation: "هَذَا adalah Mubtada dari jumlah ismiyyah ini."
          }
        }
      },
      {
        word: "كِتَابٌ جَدِيدٌ",
        steps: {
          1: {
            question: "كِتَابٌ dalam kalimat هَذَا كِتَابٌ جَدِيدٌ berkedudukan sebagai?",
            options: ["Khabar (خبر)", "Mubtada", "Na'at", "Maf'ul"],
            correct: "Khabar (خبر)",
            explanation: "كِتَابٌ adalah Khabar dari Mubtada هَذَا, memberitahukan bahwa 'ini adalah kitab'."
          },
          2: {
            question: "جَدِيدٌ dalam kalimat ini berkedudukan sebagai?",
            options: ["Na'at (نعت)", "Khabar", "Hal", "Mubtada"],
            correct: "Na'at (نعت)",
            explanation: "جَدِيدٌ adalah Na'at (sifat) yang menerangkan كِتَابٌ. Na'at mengikuti man'ut dalam i'rab, jenis, dan bilangannya."
          }
        }
      }
    ]
  }
];
