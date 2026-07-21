(function () {
const GRANDFATHER_ITEM_BASE = "assets/grandfather/items/";

const grandfatherScenesData = [
  {
    "caption": "",
    "id": "G-01",
    "interactionType": "reveal",
    "items": [
      {
        "blur": 0,
        "file": "014_p006_img003.png",
        "id": "item-1",
        "opacity": 0.65,
        "rotate": 2.6,
        "src": "assets/grandfather/items/014_p006_img003.png",
        "width": 27.4,
        "x": 52.3,
        "y": 47.63,
        "z": 5
      },
      {
        "blur": 0,
        "file": "p005_img003.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": 0,
        "src": "assets/grandfather/items/p005_img003.png",
        "width": 13.2,
        "x": 19.86,
        "y": 44.22,
        "z": 6
      },
      {
        "blur": 0,
        "file": "074_p040_img001.png",
        "id": "item-3",
        "opacity": 1,
        "rotate": 0,
        "src": "assets/grandfather/items/074_p040_img001.png",
        "width": 10.8,
        "x": 66.9,
        "y": 50.87,
        "z": 7
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mraae6gl-f17p6x",
        "opacity": 0.82,
        "rotate": 0,
        "text": "1937–2004\n他的旧物还在，时间也还在。\n",
        "width": 24,
        "x": 26.47,
        "y": 70.56,
        "z": 6
      }
    ]
  },
  {
    "caption": "",
    "id": "G-02",
    "interactionType": "document-open",
    "items": [
      {
        "blur": 0,
        "file": "016_p007_img001.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": 0.8,
        "src": "assets/grandfather/items/016_p007_img001.png",
        "width": 31,
        "x": 34.05,
        "y": 44.41,
        "z": 3
      },
      {
        "blur": 0,
        "file": "020_p010_img003.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": -12,
        "src": "assets/grandfather/items/020_p010_img003.png",
        "width": 10.8,
        "x": 69.9,
        "y": 48,
        "z": 5
      },
      {
        "blur": 0,
        "file": "组 1.png",
        "id": "item-3",
        "opacity": 1,
        "rotate": 0,
        "src": "assets/grandfather/items/组 1.png",
        "width": 18,
        "x": 41.4,
        "y": 44.07,
        "z": 6
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mraaihgn-8fde9l",
        "opacity": 0.82,
        "rotate": 0,
        "text": "身份被折进纸页里，\n留下一个时代的痕迹。",
        "width": 24,
        "x": 63.76,
        "y": 74.51,
        "z": 5
      }
    ]
  },
  {
    "caption": "",
    "id": "G-03",
    "interactionType": "document-open",
    "items": [
      {
        "blur": 0,
        "file": "033_p019_img003.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": 0,
        "src": "assets/grandfather/items/033_p019_img003.png",
        "width": 13.2,
        "x": 67.14,
        "y": 32.77,
        "z": 3
      },
      {
        "blur": 4,
        "file": "034_p019_img004.png",
        "id": "item-2",
        "opacity": 0.35,
        "rotate": 0,
        "src": "assets/grandfather/items/034_p019_img004.png",
        "width": 9.6,
        "x": 86.76,
        "y": 5.85,
        "z": 9
      },
      {
        "blur": 0,
        "file": "024_p012_img002.png",
        "id": "item-3",
        "opacity": 1,
        "rotate": 0.4,
        "src": "assets/grandfather/items/024_p012_img002.png",
        "width": 30.4,
        "x": 70.71,
        "y": 59.79,
        "z": 4
      },
      {
        "blur": 0,
        "file": "023_p012_img001.png",
        "id": "item-4",
        "opacity": 1,
        "rotate": 2.6,
        "src": "assets/grandfather/items/023_p012_img001.png",
        "width": 28.6,
        "x": 70.71,
        "y": 59.35,
        "z": 5
      },
      {
        "blur": 0,
        "file": "029_p017_img003.png",
        "id": "item-5",
        "opacity": 1,
        "rotate": 0,
        "src": "assets/grandfather/items/029_p017_img003.png",
        "width": 21.6,
        "x": 29.67,
        "y": 46.7,
        "z": 10
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mrabkj77-buxsbp",
        "opacity": 0.82,
        "rotate": 0,
        "text": "证件合上以后，\n一个人的身份仍然留在里面。",
        "width": 24,
        "x": 49.1,
        "y": 83.33,
        "z": 11
      }
    ]
  },
  {
    "caption": "",
    "id": "G-04",
    "interactionType": "none",
    "items": [
      {
        "blur": 0,
        "file": "035_p020_img001.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": 4,
        "src": "assets/grandfather/items/035_p020_img001.png",
        "width": 36,
        "x": 69.38,
        "y": 49.58,
        "z": 4
      },
      {
        "blur": 0,
        "file": "062_p033_img001.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": 0,
        "src": "assets/grandfather/items/062_p033_img001.png",
        "width": 10.8,
        "x": 27.71,
        "y": 45.59,
        "z": 5
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mrabmhff-8kt3ap",
        "opacity": 0.82,
        "rotate": 0,
        "text": "小时候，爷爷给我讲过参军的故事。",
        "width": 24,
        "x": 32.38,
        "y": 73.02,
        "z": 6
      }
    ]
  },
  {
    "caption": "",
    "id": "G-05",
    "interactionType": "none",
    "items": [
      {
        "blur": 0,
        "file": "026_p014_img003.png",
        "id": "item-1",
        "opacity": 0.5,
        "rotate": 2.2,
        "src": "assets/grandfather/items/026_p014_img003.png",
        "width": 10,
        "x": 84.71,
        "y": 74.47,
        "z": 4
      },
      {
        "blur": 0,
        "file": "022_p011_img001.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": -1.4,
        "src": "assets/grandfather/items/022_p011_img001.png",
        "width": 31.2,
        "x": 28.1,
        "y": 47.01,
        "z": 3
      },
      {
        "blur": 0,
        "file": "038_p023_img001.png",
        "id": "item-3",
        "opacity": 1,
        "rotate": 0,
        "src": "assets/grandfather/items/038_p023_img001.png",
        "width": 10.8,
        "x": 63.05,
        "y": 30.36,
        "z": 6
      },
      {
        "blur": 0,
        "file": "039_p023_img002.png",
        "id": "item-4",
        "opacity": 1,
        "rotate": 0,
        "src": "assets/grandfather/items/039_p023_img002.png",
        "width": 9.6,
        "x": 74.1,
        "y": 29.9,
        "z": 2
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mrabqrnm-8hp214",
        "opacity": 0.82,
        "rotate": 0,
        "text": "工作、组织和生活，\n被放在同一页里。",
        "width": 24,
        "x": 59.81,
        "y": 70.61,
        "z": 7
      }
    ]
  },
  {
    "caption": "",
    "id": "G-06",
    "interactionType": "wallet-pull",
    "items": [
      {
        "blur": 0,
        "file": "027_p015_img003.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": -1.2,
        "src": "assets/grandfather/items/027_p015_img003.png",
        "width": 16.6,
        "x": 31,
        "y": 37.63,
        "z": 3
      },
      {
        "blur": 0,
        "file": "028_p016_img003.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": 2.2,
        "src": "assets/grandfather/items/028_p016_img003.png",
        "width": 32.8,
        "x": 63.1,
        "y": 60.08,
        "z": 4
      },
      {
        "blur": 2.5,
        "file": "030_p018_img001.png",
        "id": "item-3",
        "opacity": 0.5,
        "rotate": -185.5,
        "src": "assets/grandfather/items/030_p018_img001.png",
        "width": 7.4,
        "x": 11.57,
        "y": 22.68,
        "z": 2
      },
      {
        "blur": 0,
        "file": "031_p018_img002.png",
        "id": "item-4",
        "opacity": 0.65,
        "rotate": -105,
        "src": "assets/grandfather/items/031_p018_img002.png",
        "width": 9.6,
        "x": 72.95,
        "y": 42.86,
        "z": 3
      },
      {
        "blur": 0,
        "file": "032_p018_img003.png",
        "id": "item-5",
        "opacity": 1,
        "rotate": -79.9,
        "src": "assets/grandfather/items/032_p018_img003.png",
        "width": 14.8,
        "x": 76.52,
        "y": 64.33,
        "z": 3
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mrabsqwr-cqhrzu",
        "opacity": 0.82,
        "rotate": 0,
        "text": "钱包里装着的，\n不只是票据。",
        "width": 24,
        "x": 38.9,
        "y": 78.5,
        "z": 7
      }
    ]
  },
  {
    "caption": "",
    "id": "G-07",
    "interactionType": "paper-slide",
    "items": [
      {
        "blur": 0,
        "file": "059_p031_img001.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": 0,
        "src": "assets/grandfather/items/059_p031_img001.png",
        "width": 19.2,
        "x": 29.14,
        "y": 52.27,
        "z": 6
      },
      {
        "blur": 0,
        "file": "045_p026_img003.png",
        "id": "item-2",
        "opacity": 0.7,
        "rotate": 7,
        "src": "assets/grandfather/items/045_p026_img003.png",
        "width": 9.6,
        "x": 35.9,
        "y": 25.16,
        "z": 4
      },
      {
        "blur": 0,
        "file": "015_p006_img004.png",
        "id": "item-3",
        "opacity": 1,
        "rotate": 0,
        "src": "assets/grandfather/items/015_p006_img004.png",
        "width": 24,
        "x": 74.67,
        "y": 70.65,
        "z": 7
      }
    ],
    "pages": "",
    "texts": []
  },
  {
    "caption": "",
    "id": "G-08",
    "interactionType": "reveal",
    "items": [
      {
        "blur": 0,
        "file": "033_p019_img003.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": -1.4,
        "src": "assets/grandfather/items/033_p019_img003.png",
        "width": 34.8,
        "x": 38.81,
        "y": 48.96,
        "z": 3
      },
      {
        "blur": 2,
        "file": "034_p019_img004.png",
        "id": "item-2",
        "opacity": 0.35,
        "rotate": 2.6,
        "src": "assets/grandfather/items/034_p019_img004.png",
        "width": 11.8,
        "x": 79.48,
        "y": 8.57,
        "z": 5
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mraciu03-wk1a0i",
        "opacity": 0.82,
        "rotate": 0,
        "text": "他在照片里站定，\n也被一个年代看见。",
        "width": 24,
        "x": 78.9,
        "y": 51.11,
        "z": 6
      }
    ]
  },
  {
    "caption": "",
    "id": "G-09",
    "interactionType": "reveal",
    "items": [
      {
        "blur": 0,
        "file": "036_p021_img003.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": -1.2,
        "src": "assets/grandfather/items/036_p021_img003.png",
        "width": 16.6,
        "x": 70.38,
        "y": 45.71,
        "z": 3
      },
      {
        "blur": 0,
        "file": "037_p022_img003.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": 2.2,
        "src": "assets/grandfather/items/037_p022_img003.png",
        "width": 26.8,
        "x": 26.57,
        "y": 46.53,
        "z": 4
      },
      {
        "blur": 0,
        "file": "058_p030_img002.png",
        "id": "item-3",
        "opacity": 1,
        "rotate": 0,
        "src": "assets/grandfather/items/058_p030_img002.png",
        "width": 8.4,
        "x": 39.33,
        "y": 43.36,
        "z": 6
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mraclo55-dbvlgu",
        "opacity": 0.82,
        "rotate": 0,
        "text": "人群中的位置，\n也是一种留下来的痕迹。",
        "width": 24,
        "x": 57.62,
        "y": 78.04,
        "z": 7
      }
    ]
  },
  {
    "caption": "",
    "id": "G-10",
    "interactionType": "paper-flip",
    "items": [
      {
        "blur": 0,
        "file": "019_p009_img002.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": 1.5,
        "src": "assets/grandfather/items/019_p009_img002.png",
        "width": 23,
        "x": 48.52,
        "y": 48.49,
        "z": 5
      },
      {
        "blur": 0,
        "file": "018_p009_img001.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": -1.2,
        "src": "assets/grandfather/items/018_p009_img001.png",
        "width": 22,
        "x": 48.33,
        "y": 49.81,
        "z": 4
      }
    ],
    "pages": "",
    "texts": []
  },
  {
    "caption": "",
    "id": "G-11",
    "interactionType": "reveal",
    "items": [
      {
        "blur": 0,
        "file": "044_p025_img006.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": -1.6,
        "src": "assets/grandfather/items/044_p025_img006.png",
        "width": 15,
        "x": 69.24,
        "y": 32.87,
        "z": 4
      },
      {
        "blur": 0,
        "file": "045_p026_img003.png",
        "id": "item-2",
        "opacity": 0.85,
        "rotate": -0.6,
        "src": "assets/grandfather/items/045_p026_img003.png",
        "width": 9.2,
        "x": 49.71,
        "y": 69.32,
        "z": 6
      },
      {
        "blur": 0,
        "file": "046_p026_img004.png",
        "id": "item-3",
        "opacity": 1,
        "rotate": 1.1,
        "src": "assets/grandfather/items/046_p026_img004.png",
        "width": 9.2,
        "x": 71.57,
        "y": 68.98,
        "z": 5
      },
      {
        "blur": 0,
        "file": "073_p039_img004.png",
        "id": "item-4",
        "opacity": 1,
        "rotate": 0,
        "src": "assets/grandfather/items/073_p039_img004.png",
        "width": 9.6,
        "x": 26.95,
        "y": 29.71,
        "z": 7
      },
      {
        "blur": 0,
        "file": "083_p044_img001.png",
        "id": "item-5",
        "opacity": 1,
        "rotate": 0,
        "src": "assets/grandfather/items/083_p044_img001.png",
        "width": 9.6,
        "x": 49.38,
        "y": 27.95,
        "z": 8
      },
      {
        "blur": 0,
        "file": "081_p043_img001.png",
        "id": "item-6",
        "opacity": 1,
        "rotate": 0,
        "src": "assets/grandfather/items/081_p043_img001.png",
        "width": 9.6,
        "x": 27.19,
        "y": 68.52,
        "z": 9
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mracqmc7-flb5pj",
        "opacity": 0.82,
        "rotate": 0,
        "text": "这些头像很轻，却把一个人分成了许多个时刻。",
        "width": 24,
        "x": 51.24,
        "y": 49.91,
        "z": 10
      }
    ]
  },
  {
    "caption": "",
    "id": "G-12",
    "interactionType": "paper-flip",
    "items": [
      {
        "blur": 0,
        "file": "048_p027_img002.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": 2.6,
        "src": "assets/grandfather/items/048_p027_img002.png",
        "width": 16.6,
        "x": 61.24,
        "y": 28.34,
        "z": 5
      },
      {
        "blur": 2.5,
        "file": "049_p028_img001.png",
        "id": "item-2",
        "opacity": 0.85,
        "rotate": 0.4,
        "src": "assets/grandfather/items/049_p028_img001.png",
        "width": 8.8,
        "x": 70.81,
        "y": 46.98,
        "z": 4
      },
      {
        "blur": 0,
        "file": "064_p034_img002.png",
        "id": "item-3",
        "opacity": 1,
        "rotate": 0,
        "src": "assets/grandfather/items/064_p034_img002.png",
        "width": 24,
        "x": 30.24,
        "y": 68.8,
        "z": 6
      }
    ],
    "pages": "",
    "texts": []
  },
  {
    "caption": "",
    "id": "G-13",
    "interactionType": "paper-slide",
    "items": [
      {
        "blur": 0,
        "file": "050_p029_img001.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": -2.2,
        "src": "assets/grandfather/items/050_p029_img001.png",
        "width": 9.4,
        "x": 21,
        "y": 31.39,
        "z": 4
      },
      {
        "blur": 3.5,
        "file": "051_p029_img002.png",
        "id": "item-2",
        "opacity": 0.6,
        "rotate": 1.8,
        "src": "assets/grandfather/items/051_p029_img002.png",
        "width": 12,
        "x": 35,
        "y": 33,
        "z": 5
      },
      {
        "blur": 0,
        "file": "052_p029_img003.png",
        "id": "item-3",
        "opacity": 1,
        "rotate": -1.4,
        "src": "assets/grandfather/items/052_p029_img003.png",
        "width": 12,
        "x": 51.14,
        "y": 34.49,
        "z": 3
      },
      {
        "blur": 3.5,
        "file": "053_p029_img004.png",
        "id": "item-4",
        "opacity": 0.45,
        "rotate": 2.6,
        "src": "assets/grandfather/items/053_p029_img004.png",
        "width": 12,
        "x": 67,
        "y": 34,
        "z": 4
      },
      {
        "blur": 0,
        "file": "054_p029_img005.png",
        "id": "item-5",
        "opacity": 1,
        "rotate": -1.1,
        "src": "assets/grandfather/items/054_p029_img005.png",
        "width": 12,
        "x": 80.57,
        "y": 44.16,
        "z": 5
      },
      {
        "blur": 0,
        "file": "055_p029_img006.png",
        "id": "item-6",
        "opacity": 1,
        "rotate": 1.2,
        "src": "assets/grandfather/items/055_p029_img006.png",
        "width": 11.8,
        "x": 33.9,
        "y": 63.19,
        "z": 6
      },
      {
        "blur": 1,
        "file": "056_p029_img007.png",
        "id": "item-7",
        "opacity": 0.5,
        "rotate": -2,
        "src": "assets/grandfather/items/056_p029_img007.png",
        "width": 12,
        "x": 50.95,
        "y": 69.46,
        "z": 4
      },
      {
        "blur": 0,
        "file": "057_p030_img001.png",
        "id": "item-8",
        "opacity": 1,
        "rotate": 1.6,
        "src": "assets/grandfather/items/057_p030_img001.png",
        "width": 13,
        "x": 66,
        "y": 64,
        "z": 5
      },
      {
        "blur": 0,
        "file": "058_p030_img002.png",
        "id": "item-9",
        "opacity": 1,
        "rotate": -0.5,
        "src": "assets/grandfather/items/058_p030_img002.png",
        "width": 12,
        "x": 79,
        "y": 69,
        "z": 3
      }
    ],
    "pages": "",
    "texts": []
  },
  {
    "caption": "",
    "id": "G-14",
    "interactionType": "reveal",
    "items": [
      {
        "blur": 0,
        "file": "060_p032_img001.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": 2.6,
        "src": "assets/grandfather/items/060_p032_img001.png",
        "width": 5.8,
        "x": 66.71,
        "y": 26.3,
        "z": 5
      },
      {
        "blur": 0,
        "file": "061_p032_img002.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": 0.4,
        "src": "assets/grandfather/items/061_p032_img002.png",
        "width": 22,
        "x": 40.71,
        "y": 47.54,
        "z": 4
      },
      {
        "blur": 0,
        "file": "067_p035_img003.png",
        "id": "item-3",
        "opacity": 1,
        "rotate": -88,
        "src": "assets/grandfather/items/067_p035_img003.png",
        "width": 12,
        "x": 29.71,
        "y": 80.77,
        "z": 6
      },
      {
        "blur": 0,
        "file": "069_p036_img002.png",
        "id": "item-4",
        "opacity": 1,
        "rotate": -0.4,
        "src": "assets/grandfather/items/069_p036_img002.png",
        "width": 14,
        "x": 79.33,
        "y": 48.5,
        "z": 4
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mracusi3-34fa5d",
        "opacity": 0.82,
        "rotate": 0,
        "text": "票据留下来，生活也留下来。",
        "width": 24,
        "x": 67.1,
        "y": 62.16,
        "z": 7
      }
    ]
  },
  {
    "caption": "",
    "id": "G-16",
    "interactionType": "paper-slide",
    "items": [
      {
        "blur": 0,
        "file": "066_p035_img002.png",
        "id": "item-1",
        "opacity": 0.6,
        "rotate": 1.8,
        "src": "assets/grandfather/items/066_p035_img002.png",
        "width": 30.4,
        "x": 66.95,
        "y": 56.61,
        "z": 5
      },
      {
        "blur": 0,
        "file": "072_p039_img003.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": -1.4,
        "src": "assets/grandfather/items/072_p039_img003.png",
        "width": 30,
        "x": 37.14,
        "y": 41.34,
        "z": 3
      },
      {
        "blur": 0,
        "file": "070_p037_img001.png",
        "id": "item-3",
        "opacity": 1,
        "rotate": -1.2,
        "src": "assets/grandfather/items/070_p037_img001.png",
        "width": 5.8,
        "x": 23.86,
        "y": 74.95,
        "z": 3
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mrad2my3-vbi5wt",
        "opacity": 0.82,
        "rotate": 0,
        "text": "那些被收好的纸片，\n仍然带着生活的温度。",
        "width": 24,
        "x": 45.05,
        "y": 84.26,
        "z": 9
      }
    ]
  },
  {
    "caption": "",
    "id": "G-19",
    "interactionType": "none",
    "items": [
      {
        "blur": 0,
        "file": "075_p041_img003.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": -1.7,
        "src": "assets/grandfather/items/075_p041_img003.png",
        "width": 22,
        "x": 22,
        "y": 51,
        "z": 4
      },
      {
        "blur": 0,
        "file": "076_p041_img004.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": 1.6,
        "src": "assets/grandfather/items/076_p041_img004.png",
        "width": 15,
        "x": 47.57,
        "y": 46.01,
        "z": 5
      },
      {
        "blur": 5.5,
        "file": "078_p042_img004.png",
        "id": "item-3",
        "opacity": 0.4,
        "rotate": 2.4,
        "src": "assets/grandfather/items/078_p042_img004.png",
        "width": 37.8,
        "x": 68.33,
        "y": 23.13,
        "z": 4
      },
      {
        "blur": 3,
        "file": "080_p042_img006.png",
        "id": "item-4",
        "opacity": 0.55,
        "rotate": 1.1,
        "src": "assets/grandfather/items/080_p042_img006.png",
        "width": 5.6,
        "x": 71.29,
        "y": 79.38,
        "z": 5
      },
      {
        "blur": 0,
        "file": "082_p043_img002.png",
        "id": "item-5",
        "opacity": 1,
        "rotate": 2.6,
        "src": "assets/grandfather/items/082_p043_img002.png",
        "width": 17.8,
        "x": 74.33,
        "y": 65.67,
        "z": 5
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mrad65xi-5o0692",
        "opacity": 0.82,
        "rotate": 0,
        "text": "边齿、相纸和小头像，把时间切得很细。",
        "width": 24,
        "x": 52.67,
        "y": 84.72,
        "z": 7
      }
    ]
  },
  {
    "caption": "",
    "id": "G-21",
    "interactionType": "paper-slide",
    "items": [
      {
        "blur": 0,
        "file": "084_p045_img001.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": -1.6,
        "src": "assets/grandfather/items/084_p045_img001.png",
        "width": 24,
        "x": 46.48,
        "y": 81.5,
        "z": 4
      },
      {
        "blur": 0,
        "file": "087_p046_img005.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": 1.2,
        "src": "assets/grandfather/items/087_p046_img005.png",
        "width": 15,
        "x": 52.86,
        "y": 53.1,
        "z": 6
      },
      {
        "blur": 0,
        "file": "083_p044_img001.png",
        "id": "item-3",
        "opacity": 0.7,
        "rotate": 0.4,
        "src": "assets/grandfather/items/083_p044_img001.png",
        "width": 23.2,
        "x": 69.76,
        "y": 50.97,
        "z": 4
      },
      {
        "blur": 0,
        "file": "071_p038_img001.png",
        "id": "item-4",
        "opacity": 1,
        "rotate": -1.8,
        "src": "assets/grandfather/items/071_p038_img001.png",
        "width": 22,
        "x": 28.62,
        "y": 47.36,
        "z": 8
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mradbunm-z524ts",
        "opacity": 0.82,
        "rotate": 0,
        "text": "钱、票和照片，\n把日常折成可以保存的形状。",
        "width": 24,
        "x": 54.1,
        "y": 19.18,
        "z": 9
      }
    ]
  },
  {
    "caption": "",
    "id": "G-22",
    "interactionType": "paper-flip",
    "items": [
      {
        "blur": 2,
        "file": "089_p047_img001.png",
        "id": "item-1",
        "opacity": 0.7,
        "rotate": -1.2,
        "src": "assets/grandfather/items/089_p047_img001.png",
        "width": 29.8,
        "x": 34.62,
        "y": 48.59,
        "z": 3
      },
      {
        "blur": 0,
        "file": "090_p048_img001.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": 2.2,
        "src": "assets/grandfather/items/090_p048_img001.png",
        "width": 22,
        "x": 67.86,
        "y": 48.57,
        "z": 4
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mradf6b6-462fg5",
        "opacity": 0.82,
        "rotate": 0,
        "text": "一张小纸条，\n靠近了两个人的旧时光。",
        "width": 24,
        "x": 80.71,
        "y": 78.04,
        "z": 5
      }
    ]
  },
  {
    "caption": "",
    "id": "G-23",
    "interactionType": "reveal",
    "items": [
      {
        "blur": 0,
        "file": "091_p049_img001.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": -1.4,
        "src": "assets/grandfather/items/091_p049_img001.png",
        "width": 30,
        "x": 30.48,
        "y": 43.02,
        "z": 3
      },
      {
        "blur": 0,
        "file": "092_p050_img003.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": 2.6,
        "src": "assets/grandfather/items/092_p050_img003.png",
        "width": 19,
        "x": 65,
        "y": 38,
        "z": 5
      },
      {
        "blur": 0,
        "file": "093_p050_img004.png",
        "id": "item-3",
        "opacity": 1,
        "rotate": 0.4,
        "src": "assets/grandfather/items/093_p050_img004.png",
        "width": 22,
        "x": 69,
        "y": 61,
        "z": 4
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mrad7l8i-ce7g0g",
        "opacity": 0.82,
        "rotate": 0,
        "text": "集体照里，他成为许多人中的一个，\n也成为家人记住的那一个。",
        "width": 24,
        "x": 46,
        "y": 84.63,
        "z": 6
      }
    ]
  },
  {
    "caption": "",
    "id": "G-24",
    "interactionType": "paper-slide",
    "items": [
      {
        "blur": 0,
        "file": "095_p052_img001.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": 2.6,
        "src": "assets/grandfather/items/095_p052_img001.png",
        "width": 20.2,
        "x": 62.62,
        "y": 39.49,
        "z": 5
      },
      {
        "blur": 0,
        "file": "096_p052_img002.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": 0.4,
        "src": "assets/grandfather/items/096_p052_img002.png",
        "width": 24.4,
        "x": 43.19,
        "y": 49.49,
        "z": 5
      }
    ],
    "pages": "",
    "texts": []
  },
  {
    "caption": "",
    "id": "G-25",
    "interactionType": "reveal",
    "items": [
      {
        "blur": 0,
        "file": "097_p053_img001.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": -1.2,
        "src": "assets/grandfather/items/097_p053_img001.png",
        "width": 28,
        "x": 30,
        "y": 50,
        "z": 4
      },
      {
        "blur": 0,
        "file": "098_p053_img002.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": 1.5,
        "src": "assets/grandfather/items/098_p053_img002.png",
        "width": 17,
        "x": 56,
        "y": 38,
        "z": 5
      },
      {
        "blur": 0,
        "file": "099_p054_img001.png",
        "id": "item-3",
        "opacity": 0.65,
        "rotate": -2,
        "src": "assets/grandfather/items/099_p054_img001.png",
        "width": 18,
        "x": 70,
        "y": 54,
        "z": 3
      },
      {
        "blur": 0,
        "file": "100_p054_img002.png",
        "id": "item-4",
        "opacity": 1,
        "rotate": 1.1,
        "src": "assets/grandfather/items/100_p054_img002.png",
        "width": 16,
        "x": 54,
        "y": 66,
        "z": 6
      },
      {
        "blur": 0,
        "file": "094_p051_img001.png",
        "id": "item-5",
        "opacity": 1,
        "rotate": -1.4,
        "src": "assets/grandfather/items/094_p051_img001.png",
        "width": 9.6,
        "x": 28.24,
        "y": 48.86,
        "z": 3
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mradgg06-rawvz5",
        "opacity": 0.82,
        "rotate": 0,
        "text": "更多人的面孔靠近时，\n他的那一段时间也被照亮。",
        "width": 24,
        "x": 81.29,
        "y": 22.8,
        "z": 7
      }
    ]
  },
  {
    "caption": "",
    "id": "G-26",
    "interactionType": "none",
    "items": [
      {
        "blur": 0,
        "file": "101_p055_img001.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": -1.2,
        "src": "assets/grandfather/items/101_p055_img001.png",
        "width": 31,
        "x": 31.38,
        "y": 44.32,
        "z": 3
      },
      {
        "blur": 0,
        "file": "102_p056_img001.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": 2.2,
        "src": "assets/grandfather/items/102_p056_img001.png",
        "width": 22,
        "x": 65.9,
        "y": 46.06,
        "z": 4
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mradhq60-jakpbf",
        "opacity": 0.82,
        "rotate": 0,
        "text": "生活照把严肃的年代轻轻放松了一点。",
        "width": 24,
        "x": 55.29,
        "y": 78.04,
        "z": 5
      }
    ]
  },
  {
    "caption": "",
    "id": "G-27",
    "interactionType": "paper-flip",
    "items": [
      {
        "blur": 0,
        "file": "103_p057_img001.png",
        "id": "item-1",
        "opacity": 1,
        "rotate": -1.2,
        "src": "assets/grandfather/items/103_p057_img001.png",
        "width": 37,
        "x": 35.24,
        "y": 49.42,
        "z": 3
      },
      {
        "blur": 0,
        "file": "104_p058_img001.png",
        "id": "item-2",
        "opacity": 1,
        "rotate": -87.8,
        "src": "assets/grandfather/items/104_p058_img001.png",
        "width": 17.2,
        "x": 62.38,
        "y": 60.18,
        "z": 4
      }
    ],
    "pages": "",
    "texts": [
      {
        "blur": 0,
        "color": "#eee1c6",
        "fontSize": 11,
        "id": "item-mradheza-hkfidf",
        "opacity": 0.82,
        "rotate": 0,
        "text": "最后留下来的，不只是一页通知，\n也是一段被确认过的人生。",
        "width": 24,
        "x": 74.57,
        "y": 32.64,
        "z": 5
      }
    ]
  }
];

function hydrateGrandfatherScene(scene, index) {
  return {
    id: scene.id || `G-${String(index + 1).padStart(2, "0")}`,
    pages: scene.pages || "",
    caption: scene.caption || "",
    interactionType: scene.interactionType || "none",
    interactionEnabled: false,
    items: (scene.items || []).map((item, itemIndex) => ({
      id: item.id || `item-${itemIndex + 1}`,
      file: item.file || "uploaded-image.png",
      src: item.src || `${GRANDFATHER_ITEM_BASE}${item.file || "uploaded-image.png"}`,
      x: Number(item.x ?? 50),
      y: Number(item.y ?? 50),
      width: Number(item.width ?? 22),
      rotate: Number(item.rotate ?? 0),
      z: Number(item.z ?? 3),
      opacity: Number(item.opacity ?? 1),
      blur: Number(item.blur ?? 0),
    })),
    texts: (scene.texts || []).map((textItem, textIndex) => ({
      id: textItem.id || `text-${textIndex + 1}`,
      text: textItem.text || "",
      x: Number(textItem.x ?? 50),
      y: Number(textItem.y ?? 50),
      width: Number(textItem.width ?? 24),
      fontSize: Number(textItem.fontSize ?? 18),
      color: textItem.color || "#eee1c6",
      rotate: Number(textItem.rotate ?? 0),
      z: Number(textItem.z ?? 10),
      opacity: Number(textItem.opacity ?? 0.82),
      blur: Number(textItem.blur ?? 0),
    })),
  };
}

window.grandfatherScenes = grandfatherScenesData.map(hydrateGrandfatherScene);
window.defaultGrandfatherScenes = JSON.parse(JSON.stringify(window.grandfatherScenes));

function normalizeSavedGrandfatherScene(scene, index) {
  return hydrateGrandfatherScene(scene, index);
}

window.normalizeGrandfatherLayout = function normalizeGrandfatherLayout(layout) {
  if (!Array.isArray(layout?.scenes) || layout.scenes.length === 0) {
    return null;
  }

  return layout.scenes.map(normalizeSavedGrandfatherScene);
};

try {
  const savedGrandfatherLayout = window.localStorage?.getItem("familyAlbumGrandfatherLayout");
  if (savedGrandfatherLayout) {
    const parsedGrandfatherLayout = JSON.parse(savedGrandfatherLayout);
    const normalizedGrandfatherLayout = window.normalizeGrandfatherLayout(parsedGrandfatherLayout);
    if (normalizedGrandfatherLayout) {
      window.grandfatherScenes = normalizedGrandfatherLayout;
    }
  }
} catch {
  window.grandfatherScenes = window.defaultGrandfatherScenes;
}
}());
