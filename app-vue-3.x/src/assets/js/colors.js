// 降水  色标修改为中央电视台 7.21  start
// 调色板使用

// 降水概率使用
colors['probality'] = new Color('precipitation', 1024, [
  [0, [255, 255, 255, 0]],
  [1, [248, 181, 106, 200]],

  [10, [248, 132, 12, 200]],

  [20, [1, 191, 255, 200]],
  [30, [248, 252, 88, 200]],

  [40, [216, 252, 88, 200]],
  [50, [127, 252, 86, 200]],

  [60, [65, 248, 41, 200]],
  [70, [147, 228, 248, 200]],

  [80, [29, 180, 248, 200]],
  [90, [166, 188, 248, 200]],
  [100, [136, 120, 248, 200]],
])

// 多日累计降水使用
colors['precipitationAccu'] = new Color('precipitation', 1024, [
  [0, [255, 255, 255, 0]],
  [10, [166, 242, 142, 200]],
  [25, [57, 186, 70, 200]],
  [50, [100, 183, 253, 200]],
  [100, [0, 0, 254, 200]],
  [250, [254, 0, 254, 200]],
  [500, [255, 165, 0, 200]],
  [1000, [165, 42, 42, 200]],
  [1200, [160, 82, 45, 200]],
])
// 24 小时降雨
colors['precipitation24'] = new Color('precipitation', 1024, [
  [0, [255, 255, 255, 0]],
  [1, [162, 204, 91, 200]],
  [10, [32, 140, 34, 200]],
  [25, [1, 191, 255, 200]],
  [50, [0, 1, 252, 200]],
  [100, [252, 1, 250, 200]],
  [200, [137, 10, 82, 200]]
])
// 12 小时降雨
colors['precipitation12'] = new Color('precipitation', 1024, [
  [0, [255, 255, 255, 0]],
  [1, [162, 204, 91, 200]],
  [10, [32, 140, 34, 200]],
  [25, [1, 191, 255, 200]],
  [50, [0, 1, 252, 200]],
  [100, [252, 1, 250, 200]],
  [200, [137, 10, 82, 200]]
])
// 6 小时降雨
colors['precipitation06'] = new Color('precipitation', 1024, [
  [0, [255, 255, 255, 0]],
  [0.5, [60, 116, 160, 200]],
  [6, [59, 161, 161, 200]],
  [8, [59, 161, 61, 200]],
  [10, [130, 161, 59, 200]],
  [15, [161, 161, 59, 200]],
  [20, [161, 59, 59, 200]],
  [30, [161, 59, 161, 200]],
  [50, [168, 168, 168, 200]],
])
// 3 小时降雨
colors['precipitation03'] = new Color('precipitation', 1024, [
  [0, [255, 255, 255, 0]],
  [0.5, [60, 116, 160, 200]],
  [6, [59, 161, 161, 200]],
  [8, [59, 161, 61, 200]],
  [10, [130, 161, 59, 200]],
  [15, [161, 161, 59, 200]],
  [20, [161, 59, 59, 200]],
  [30, [161, 59, 161, 200]],
  [50, [168, 168, 168, 200]],
])


colors['precipitation01'] = new Color('precipitation', 1024, [
  [0, [255, 255, 255, 0]],
  [0.5, [60, 116, 160, 200]],
  [6, [59, 161, 161, 200]],
  [8, [59, 161, 61, 200]],
  [10, [130, 161, 59, 200]],
  [15, [161, 161, 59, 200]],
  [20, [161, 59, 59, 200]],
  [30, [161, 59, 161, 200]],
  [50, [168, 168, 168, 200]],
])

// end

colors['wind1'] = new Color('wind1', 1024, [
  [6, [255, 255, 255, 0]],
  [9, [0, 219, 144, 200]],
  [12, [0, 219, 0, 200]],
  [15, [158, 229, 48, 200]],
  [18, [237, 182, 45, 200]],
  [21, [236, 131, 39, 200]],
  [24, [249, 61, 56, 200]],
  [48, [237, 2, 125, 200]]
])

colors['500hPaSlp'] = new Color('500hPaSlp', 1024, [
  [980, [19, 99, 209, 0]],
  [985, [30, 110, 235, 200]],
  [990, [40, 131, 241, 200]],
  [995, [60, 151, 245, 200]],
  [1000, [80, 165, 245, 200]],
  [1005, [120, 185, 251, 200]],
  [1010, [151, 211, 251, 200]],
  [1015, [181, 241, 251, 200]],
  [1020, [225, 255, 255, 200]],
  [1025, [255, 255, 255, 200]],
  [1030, [255, 251, 171, 200]],
  [1035, [255, 233, 120, 200]],
  [1040, [255, 193, 60, 200]],
  [1045, [255, 161, 0, 200]],
  [1050, [255, 96, 0, 200]],
  [1055, [255, 50, 0, 200]],
  [1060, [225, 20, 0, 200]],
  [1065, [193, 6, 0, 200]],
  [1070, [167, 14, 0, 200]]

  // [468, [149, 255, 199, 200]],
  // [474, [184, 255, 218, 200]],
  // [480, [220, 255, 236, 200]],
  // [486, [249, 223, 255, 200]],
  // [492, [245, 192, 255, 200]],
  // [498, [240, 159, 255, 200]],
  // [504, [180, 132, 238, 200]],
  // [510, [121, 104, 221, 200]],
  // [516, [59, 77, 207, 200]],
  // [522, [0, 100, 207, 200]],
  // [528, [0, 152, 223, 200]],
  // [534, [0, 204, 238, 200]],
  // [540, [0, 255, 255, 200]],
  // [546, [0, 204, 122, 200]],
  // [552, [0, 166, 51, 200]],
  // [558, [0, 128, 0, 200]],
  // [564, [71, 162, 0, 200]],
  // [570, [172, 213, 0, 200]],
  // [576, [255, 255, 0, 200]],
  // [582, [255, 204, 0, 200]],
  // [588, [255, 102, 0, 200]],
  // [594, [230, 19, 9, 200]],
  // [600, [160, 5, 2, 200]],
  // [606, [119, 0, 79, 200]]
])
colors['slp'] = new Color('slp', 1024, [
  [990, [142, 179, 184, 192]],
  [995, [104, 180, 179, 192]],
  [1000, [69, 167, 166, 192]],
  [1003, [57, 131, 147, 192]],
  [1006, [57, 118, 147, 192]],
  [1010, [57, 91, 147, 192]],
  [1015, [58, 117, 53, 192]],
  [1020, [159, 161, 65, 192]],
  [1022, [173, 136, 57, 192]],
  [1025, [170, 84, 67, 192]],
  [1030, [94, 60, 81, 192]]
])

colors['slChange24h'] = new Color('slChange24h', 1024, [
  [-20, [242, 1, 5, 200]],
  [-18, [247, 25, 4, 200], [247, 55, 18, 200]],
  [-16, [249, 72, 3, 200], [248, 93, 9, 200]],
  [-14, [247, 122, 9, 200], [249, 141, 5, 200]],
  [-12, [248, 168, 4, 200], [246, 187, 2, 200]],
  [-10, [245, 218, 11, 200], [254, 237, 10, 200]],
  [-8, [243, 254, 14, 200], [174, 250, 13, 200]],
  [-6, [199, 255, 0, 200], [175, 255, 0, 200]],
  [-4, [151, 255, 0, 200], [127, 255, 0, 200]],
  [-2, [103, 255, 0, 200], [79, 255, 0, 200]],
  [0, [255, 255, 255, 200], [0, 255, 255, 200]],
  [2, [0, 231, 255, 200], [0, 207, 255, 200]],
  [4, [0, 183, 255, 200], [0, 159, 255, 200]],
  [6, [0, 135, 255, 200], [0, 111, 255, 200]],
  [8, [0, 87, 255, 200], [0, 63, 255, 200]],
  [10, [0, 39, 255, 200], [0, 15, 255, 200]],
  [12, [7, 0, 255, 200], [31, 0, 255, 200]],
  [14, [55, 0, 255, 200], [79, 0, 255, 200]],
  [16, [103, 0, 255, 200], [127, 0, 255, 200]],
  [18, [151, 0, 255, 200]]
])

// 垂直速度
colors['vvel1'] = new Color('vvel1', 1024, [
  // [-2.5, [171, 234, 253, 200]],
  // [-2.2, [85, 212, 255, 200]],
  // [-1.9, [1, 179, 252, 200]],
  // [-1.6, [2, 141, 200, 200]],
  // [-1.3, [0, 96, 199, 200]],
  // [-0.9, [0, 50, 201, 200]],
  // [-0.6, [1, 0, 199, 200]],
  // [-0.3, [0, 0, 247, 200]],
  // [0, [180, 179, 99, 200]],
  // [0.3, [254, 249, 168, 200]],
  // [0.6, [255, 233, 85, 200]],
  // [0.9, [255, 211, 4, 200]],
  // [1.3, [253, 178, 0, 200]],
  // [1.6, [253, 140, 0, 200]],
  // [1.9, [254, 97, 0, 200]],
  // [2.2, [254, 49, 3, 200]],
  // [2.5, [230, 19, 9, 200]],
  // [2.8, [160, 5, 2, 200]],
  // [3.1, [119, 0, 79, 200]]

  [-3.3, [19, 99, 209, 200]],
  [-3, [30, 110, 235, 200]],
  [-2.7, [40, 131, 241, 200]],
  [-2.4, [60, 151, 245, 200]],
  [-1.1, [80, 165, 245, 200]],
  [-1.8, [120, 185, 251, 200]],
  [-1.5, [151, 211, 251, 200]],
  [-1.2, [181, 241, 251, 200]],
  [-0.9, [225, 255, 255, 200]],
  [-0.6, [255, 255, 255, 200]],
  [-0.3, [255, 233, 120, 200]],
  [0, [255, 193, 60, 200]],
  [0.3, [255, 161, 0, 200]],
  // [0.6, [255, 96, 0, 200]],
  // [0.9, [255, 50, 0, 200]],
  // [1.2, [225, 20, 0, 200]],
  // [1.5, [193, 6, 0, 200]],
  // [1.8, [167, 14, 0, 200]],
  // [2.1, [183, 8, 5, 200]],
  // [2.4, [149, 5, 3, 200]],
  // [2.7, [188, 3, 191, 200]],
  // [3, [160, 3, 162, 200]],
  // [3.3, [160, 3, 162, 200]]
  [0.6, [242, 173, 162, 200]],
  [0.9, [242, 165, 152, 200]],
  [1.2, [242, 157, 144, 200]],
  [1.5, [242, 149, 137, 200]],
  [1.8, [242, 142, 126, 200]],
  [2.1, [242, 134, 116, 200]],
  [2.4, [242, 126, 108, 200]],
  [2.7, [242, 121, 100, 200]],
  [3, [242, 113, 95, 200]],
  [3.3, [242, 108, 88, 200]]
])
colors['10wind'] = new Color('10wind', 1024, [
  [0, [255, 255, 255, 200]],
  [1, [142, 179, 184, 200]],
  [2, [104, 180, 179, 200]],
  [3, [69, 167, 166, 200]],
  [5, [57, 131, 147, 200]],
  [7, [57, 118, 147, 200]],
  [10, [56, 160, 173, 200]],
  [15, [157, 221, 68, 200]],
  [20, [220, 234, 55, 200]],
  // [25, [241, 0, 131, 200]]
])
// 温度
colors['temperature'] = new Color('temperature', 1024, [
  [-40, [162, 70, 145, 200]],
  [-25, [143, 89, 169, 200]],
  [-15, [157, 219, 217, 200]],
  [-8, [106, 191, 181, 200]],
  [-4, [100, 166, 189, 200]],
  [0, [93, 133, 198, 200]],
  [10, [128, 147, 24, 200]],
  [20, [243, 183, 4, 200]],
  [30, [232, 83, 25, 200]],
  [45, [71, 14, 0, 200]],
])

// 比湿
colors['spfh'] = new Color('spfh', 1024, [
  [6, [255, 255, 255, 200]],
  [8, [155, 249, 174, 200]],
  [10, [8, 247, 121, 200]],
  [12, [0, 211, 72, 200]],
  [14, [0, 183, 48, 200]],
  [16, [0, 159, 38, 200]]
  // {val:16,rgb:'#009F26'},
  // {val:14,rgb:'#00B730'},
  // {val:12,rgb:'#00D348'},
  // {val:10,rgb:'#08F779'},
  // {val:8,rgb:'#9BF9AE'},
  // {val:6,rgb:'#FFFFFF'}

])

// 相对湿度
colors['rh'] = new Color('rh', 1024, [
  [50, [253, 253, 253, 200]],
  [60, [179, 255, 189, 200]],
  [70, [107, 246, 146, 200]],
  [80, [0, 242, 91, 200]],
  [90, [0, 182, 50, 200]],
  [95, [0, 161, 40, 200]]
  //     {val:100,rgb:'#00A128'},
  // {val:95,rgb:'#00B632'},
  // {val:90,rgb:'#00F25B'},
  // {val:80,rgb:'#6BF692'},
  // {val:70,rgb:'#B3FFBD'},
  // {val:60,rgb:'#FDFDFD'}
])

// 整层水汽含量
colors['pwat'] = new Color('pwat', 1024, [
  [0, [255, 255, 255, 200]],
  [20, [196, 242, 172, 200]],
  [30, [123, 222, 103, 200]],
  [40, [49, 200, 32, 200]],
  [50, [20, 165, 15, 200]],
  [60, [12, 121, 24, 200]],
  [70, [5, 80, 35, 200]],
])

// 水汽通量
colors['qflux'] = new Color('qflux', 1024, [
  [3, [251, 253, 250, 200]],
  [6, [152, 252, 170, 200]],
  [9, [7, 248, 121, 200]],
  [12, [0, 243, 95, 200]],
  [15, [0, 212, 77, 200]],
  [18, [0, 183, 50, 200]],
  [21, [0, 164, 41, 200]]
])

// 云量
colors['cloud'] = new Color('cloud', 1024, [
  [-10, [113, 100, 52, 200]],
  [0, [146, 130, 70, 200]],
  [10, [132, 119, 70, 200]],
  [20, [101, 101, 101, 200]],
  [30, [119, 119, 119, 200]],
  [40, [132, 132, 132, 200]],
  [50, [148, 148, 148, 200]],
  [60, [161, 161, 161, 200]],
  [70, [190, 190, 190, 200]],
  [80, [207, 207, 207, 200]],
  [90, [221, 221, 220, 200]],
  [100, [239, 239, 239, 200]],
  [110, [251, 251, 251, 200]]
  // {val:1.1,rgb:'#FBFBFB'},
  // {val:1,rgb:'#EFEFEF'},
  // {val:0.9,rgb:'#DDDDDC'},
  // {val:0.8,rgb:'#CFCFCF'},
  // {val:0.7,rgb:'#BEBEBE'},
  // {val:0.6,rgb:'#A1A1A1'},
  // {val:0.5,rgb:'#949494'},
  // {val:0.4,rgb:'#848484'},
  // {val:0.3,rgb:'#777777'},
  // {val:0.2,rgb:'#656565'}
])

// K指数
colors['kindex'] = new Color('kindex', 1024, [
  [20, [253, 253, 253, 200]],
  [25, [2, 253, 223, 200]],
  [30, [172, 253, 79, 200]],
  [35, [255, 236, 19, 200]],
  [40, [254, 151, 6, 200]],
  [45, [250, 60, 0, 200]],
  [50, [251, 0, 3, 200]],
  [55, [194, 3, 0, 200]]
  // {val:55,rgb:'#C20300'},
  // {val:50,rgb:'#FB0003'},
  // {val:45,rgb:'#FA3C00'},
  // {val:40,rgb:'#FE9706'},
  // {val:35,rgb:'#FFEC13'},
  // {val:30,rgb:'#ACFD4F'},
  // {val:25,rgb:'#02FDDF'},
  // {val:20,rgb:'#FDFDFD'}
])

// 对流有效位能
colors['cape'] = new Color('cape', 1024, [
  [0, [242, 245, 255, 200]],
  [250, [2, 15, 232, 200]],
  [500, [1, 71, 84, 200]],
  [750, [5, 171, 53, 200]],
  [1000, [11, 201, 41, 200]],
  [1500, [190, 238, 43, 200]],
  [2000, [255, 204, 3, 200]],
  [2500, [250, 87, 0, 200]],
  [3000, [254, 0, 0, 200]]
  // {val:3000,rgb:'#FE0000'},
  // {val:2500,rgb:'#FA5700'},
  // {val:2000,rgb:'#FFCC03'},
  // {val:1500,rgb:'#BEEE2B'},
  // {val:1000,rgb:'#0BC929'},
  // {val:750,rgb:'#05AB35'},
  // {val:500,rgb:'#014754'},
  // {val:250,rgb:'#020FE8'},
  // {val:0,rgb:'#F2F5FF'}
])

// 假相当位温
colors['thse'] = new Color('thse', 1024, [
  [308, [253, 254, 251, 200]],
  [312, [0, 255, 148, 200]],
  [316, [116, 255, 103, 200]],
  [320, [193, 254, 62, 200]],
  [324, [251, 255, 27, 200]],
  [328, [254, 205, 0, 200]],
  [332, [252, 154, 1, 200]],
  [336, [251, 99, 0, 200]],
  [340, [255, 29, 6, 200]],
  [344, [252, 0, 0, 200]],
  [348, [245, 0, 0, 200]],
  [352, [192, 1, 0, 200]],
  [356, [140, 0, 0, 200]]
  // {val:356,rgb:'#8C0000'},
  // {val:352,rgb:'#C00100'},
  // {val:348,rgb:'#F50000'},
  // {val:344,rgb:'#FC0000'},
  // {val:340,rgb:'#FF1D06'},
  // {val:336,rgb:'#FB6300'},
  // {val:332,rgb:'#FC9A01'},
  // {val:328,rgb:'#FECD00'},
  // {val:324,rgb:'#FBFF1B'},
  // {val:320,rgb:'#C1FE3E'},
  // {val:316,rgb:'#74FF67'},
  // {val:312,rgb:'#00FF94'},
  // {val:308,rgb:'#FDFEFB'}
])

// 垂直速度
colors['vvel'] = new Color('vvel', 1024, [
  [-2.8, [67, 157, 34, 150]],
  [-2.6, [81, 166, 37, 150]],
  [-2.4, [97, 177, 44, 150]],
  [-2.2, [114, 185, 53, 150]],
  [-2, [132, 194, 67, 150]],
  [-1.8, [140, 200, 78, 150]],
  [-1.6, [150, 202, 91, 150]],
  [-1.4, [161, 209, 107, 150]],
  [-1.2, [172, 213, 117, 150]],
  [-1, [183, 218, 128, 150]],
  [-0.8, [193, 225, 150, 150]],
  [-0.6, [202, 229, 161, 150]],
  [-0.4, [217, 235, 177, 150]],
  [-0.2, [227, 241, 192, 150]],
  [0, [235, 246, 204, 150]],
  [0.2, [247, 236, 206, 150]],
  [0.4, [241, 227, 192, 150]],
  [0.6, [238, 214, 178, 150]],
  [0.8, [231, 203, 156, 150]],
  [1, [226, 192, 144, 150]],
  [1.2, [220, 179, 125, 150]],
  [1.4, [215, 168, 112, 150]],
  [1.6, [211, 157, 97, 150]],
  [1.8, [204, 145, 79, 150]],
  [2, [201, 134, 64, 150]],
  [2.2, [194, 124, 52, 150]],
  [2.4, [190, 110, 37, 150]],
  [2.6, [179, 93, 32, 150]],
  [2.8, [170, 74, 26, 150]],
  [3, [161, 61, 26, 150]]
  // [-2.6, [255, 255, 255, 200]],
  // [-2.8, [128, 255, 255, 200]],
  // [-2.6, [111, 237, 241, 200]],
  // [-2.4, [95, 222, 228, 200]],
  // [-2.2, [80, 205, 213, 200]],
  // [-2, [64, 187, 199, 200]],
  // [-1.8, [47, 172, 186, 200]],
  // [-1.6, [31, 155, 172, 200]],
  // [-1.4, [16, 139, 159, 200]],
  // [-1.2, [0, 121, 146, 200]],
  // [-1, [0, 180, 50, 200]],
  // [-0.8, [51, 195, 66, 200]],
  // [-0.6, [102, 210, 81, 200]],
  // [-0.4, [153, 224, 96, 200]],
  // [-0.2, [204, 240, 111, 200]],
  // [0, [255, 255, 128, 200]],
  // [0.2, [255, 221, 82, 200]],
  // [0.4, [255, 166, 62, 200]],
  // [0.6, [255, 109, 41, 200]],
  // [0.8, [255, 55, 19, 200]],
  // [1, [255, 0, 0, 200]],
  // [1.2, [215, 0, 0, 200]],
  // [1.4, [176, 0, 0, 200]],
  // [1.6, [135, 1, 1, 200]],
  // [1.8, [94, 5, 7, 200]],
  // [2, [170, 0, 255, 200]],
  // [2.2, [184, 34, 255, 200]],
  // [2.4, [197, 70, 255, 200]],
  // [2.6, [212, 106, 255, 200]],
  // [2.8, [227, 141, 255, 200]],
  // [3, [241, 177, 255, 200]],
  // [3.2, [255, 166, 193, 200]]
])

colors['wind'] = new Color('wind', 1024, [
  [6, [255, 254, 255, 200]],
  [9, [123, 255, 255, 200], [115, 234, 242, 200]],
  [12, [106, 216, 230, 200], [83, 202, 222, 200]],
  [15, [67, 182, 201, 200], [50, 167, 186, 200]],
  [18, [35, 152, 175, 200], [22, 135, 163, 200]],
  [21, [0, 122, 149, 200], [10, 175, 42, 200]],
  [24, [52, 199, 63, 200], [100, 212, 74, 200]],
  [27, [147, 227, 90, 200], [199, 243, 115, 200]],
  [30, [253, 251, 144, 200], [255, 221, 79, 200]],
  [33, [251, 168, 63, 200], [252, 109, 46, 200]],
  [36, [255, 56, 10, 200], [254, 2, 0, 200]],
  [39, [213, 3, 0, 200], [179, 0, 1, 200]],
  [42, [137, 0, 0, 200], [94, 1, 0, 200]],
  [45, [164, 4, 249, 200], [185, 33, 253, 200]],
  [48, [194, 74, 238, 200], [215, 105, 252, 200]],
  [51, [230, 139, 255, 200], [245, 180, 255, 200]],
  [54, [255, 211, 255, 200], [255, 197, 238, 200]],
  [57, [255, 180, 212, 200], [255, 164, 190, 200]],
  [60, [253, 153, 173, 200], [242, 142, 152, 200]],
  [63, [255, 119, 132, 200], [246, 98, 110, 200]],
  [66, [253, 100, 98, 200], [233, 71, 84, 200]],
  [69, [202, 58, 77, 200], [176, 41, 73, 200]],
  [72, [150, 27, 63, 200]]
])

colors['cape1'] = new Color('cape1', 1024, [
  [200, [255, 255, 255, 200]],
  [300, [242, 250, 254, 200]],
  [400, [224, 243, 252, 200]],
  [500, [206, 237, 251, 200]],
  [600, [187, 230, 249, 200]],
  [700, [169, 223, 248, 200]],
  [800, [149, 211, 242, 200]],
  [900, [133, 196, 235, 200]],
  [1000, [117, 182, 226, 200]],
  [1100, [100, 169, 218, 200]],
  [1200, [82, 153, 209, 200]],
  [1300, [70, 146, 192, 200]],
  [1400, [70, 154, 168, 200]],
  [1500, [70, 161, 142, 200]],
  [1600, [71, 169, 117, 200]],
  [1700, [71, 177, 91, 200]],
  [1800, [82, 185, 69, 200]],
  [1900, [117, 194, 74, 200]],
  [2000, [151, 204, 79, 200]],
  [2100, [184, 214, 83, 200]],
  [2200, [218, 223, 87, 200]],
  [2300, [250, 233, 92, 200]],
  [2400, [249, 209, 81, 200]],
  [2500, [248, 185, 71, 200]],
  [2600, [247, 161, 61, 200]],
  [2700, [246, 138, 50, 200]],
  [2800, [245, 114, 40, 200]],
  [2900, [239, 94, 36, 200]],
  [3000, [234, 79, 36, 200]],
  [3100, [228, 63, 35, 200]]
])

colors['above10wind111'] = new Color('above10wind111', 1024, [
  [970, [255, 0, 0, 200]],
  [975, [255, 46, 0, 200]],
  [980, [255, 105, 0, 200]],
  [985, [255, 191, 0, 200]],
  [990, [255, 218, 0, 200]],
  [995, [255, 247, 0, 200]],
  [1000, [255, 255, 51, 200]],
  [1005, [255, 255, 132, 200]],
  [1010, [255, 255, 217, 200]],
  [1015, [219, 243, 220, 200]],
  [1020, [136, 219, 140, 200]],
  [1025, [57, 196, 64, 200]],
  [1030, [1, 164, 32, 200]],
  [1035, [0, 103, 118, 200]],
  [1040, [0, 45, 191, 200]],
  [1045, [1, 0, 248, 200]],
  [1050, [26, 0, 213, 200]],
  [1055, [58, 0, 174, 200]],
  [1060, [86, 0, 137, 200]]
])
colors['above10wind'] = new Color('above10wind', 2048, [
  [0, [82, 71, 141, 192]],
  [1, [85, 78, 177, 192]],
  [2, [80, 87, 184, 192]],
  [4, [67, 105, 196, 192]],
  [6, [64, 160, 180, 192]],
  [8, [78, 193, 103, 192]],
  [10, [104, 209, 79, 192]],
  [12, [157, 221, 68, 192]],
  [18, [220, 234, 55, 192]],
  [24, [234, 164, 62, 192]],
  [30, [217, 66, 114, 192]],
  [36, [147, 23, 78, 192]],
  [42, [43, 0, 1, 192]]
])

colors['2mTemp&10w'] = new Color('2mTemp&10w', 1024, [
  [-32, [177, 226, 249, 200]],
  [-30, [163, 221, 247, 200]],
  [-28, [147, 209, 241, 200]],
  [-26, [135, 198, 236, 200]],
  [-24, [124, 188, 230, 200]],
  [-22, [109, 177, 222, 200]],
  [-20, [97, 167, 216, 200]],
  [-18, [85, 155, 210, 200]],
  [-16, [70, 144, 199, 200]],
  [-14, [70, 149, 182, 200]],
  [-12, [70, 155, 165, 200]],
  [-10, [70, 161, 142, 200]],
  [-8, [71, 167, 125, 200]],
  [-6, [71, 172, 106, 200]],
  [-4, [71, 179, 83, 200]],
  [-2, [82, 185, 69, 200]],
  [0, [106, 192, 73, 200]],
  [2, [131, 199, 76, 200]],
  [4, [160, 207, 80, 200]],
  [6, [184, 214, 83, 200]],
  [8, [208, 221, 86, 200]],
  [10, [237, 229, 90, 200]],
  [12, [250, 226, 89, 200]],
  [14, [249, 209, 81, 200]],
  [16, [248, 189, 73, 200]],
  [18, [248, 173, 65, 200]],
  [20, [247, 155, 57, 200]],
  [22, [246, 134, 49, 200]],
  [24, [245, 117, 41, 200]],
  [26, [242, 100, 36, 200]],
  [28, [238, 87, 36, 200]],
  [30, [233, 77, 36, 200]]
])

// colors['relativeHumidity'] = new Color('relativeHumidity', 1024, [
//   [0, [173, 85, 56, 192]],
//   [30, [173, 110, 56, 192]],
//   [40, [173, 146, 56, 192]],
//   [50, [105, 173, 56, 192]],
//   [60, [56, 173, 121, 192]],
//   [70, [56, 174, 173, 192]],
//   [75, [56, 160, 173, 192]],
//   [80, [56, 157, 173, 192]],
//   [83, [56, 148, 173, 192]],
//   [87, [56, 135, 173, 192]],
//   [90, [56, 132, 173, 192]],
//   [93, [56, 123, 173, 192]],
//   [97, [56, 98, 157, 192]],
//   [100, [56, 70, 114, 192]]
// ])

// colors['rvor'] = new Color('rvor', 1024, [
//   [0, [255, 255, 255, 200]],
//   [0.25, [215, 227, 255, 200]],
//   [0.5, [182, 202, 255, 200]],
//   [0.75, [182, 202, 255, 200]],
//   [1, [143, 179, 255, 200]],
//   [1.25, [128, 151, 255, 200]],
//   [1.5, [99, 113, 247, 200]],
//   [1.75, [0, 99, 255, 200]],
//   [2, [0, 99, 255, 200]],
//   [2.25, [0, 151, 151, 200]],
//   [2.5, [0, 199, 48, 200]],
//   [2.75, [99, 255, 0, 200]],
//   [3, [151, 255, 0, 200]],
//   [3.25, [151, 255, 0, 200]],
//   [3.5, [199, 255, 48, 200]],
//   [3.75, [255, 255, 0, 200]],
//   [4, [255, 199, 0, 200]],
//   [4.25, [255, 161, 0, 200]],
//   [4.5, [255, 161, 0, 200]],
//   [4.75, [255, 125, 0, 200]],
//   [5, [255, 18, 0, 200]]
// ])

// colors['div'] = new Color('div', 1024, [
//   [-40, [145, 0, 82, 200]],
//   [-35, [175, 7, 107, 200]],
//   [-30, [202, 39, 134, 200]],
//   [-25, [216, 93, 161, 200]],
//   [-20, [227, 141, 189, 200]],
//   [-15, [239, 176, 214, 200]],
//   [-10, [247, 205, 230, 200]],
//   [-5, [252, 227, 239, 200]],
//   [0, [255, 255, 255, 200]],
//   [5, [233, 245, 213, 200]],
//   [10, [209, 236, 175, 200]],
//   [15, [179, 222, 128, 200]],
//   [20, [148, 202, 88, 200]],
//   [25, [113, 177, 53, 200]],
//   [30, [113, 177, 53, 200]],
//   [35, [56, 126, 23, 200]],
//   [40, [33, 100, 17, 200]]
// ])
// colors['preType'] = new Color('preType', 1024, [
//   [1, [0, 152, 181, 200]],
//   [2, [149, 161, 9, 200]],
//   [3, [177, 177, 177, 200]]
// ])