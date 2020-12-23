var year = '2019', month = '7', shiqu = '杭州市';
var options = {
  useEasing: true,
  useGrouping: true,
  separator: '',
  decimal: '.',
  prefix: '',
  suffix: ''
};

var html = document.getElementsByTagName("html")[0];
var width = html.clientWidth;
var fontSize = 10 / 3840 * width;


function checkInfo() {
  let qiye=$('#qiyeName').val()
  getData(qiye)
}

$('.qiye_close').click(function() {
  $('.qiye_box').fadeOut()
})
// getData()
// getChartData()

function getData () {
  $.ajax({
    url: ctxPath + "/cockpit/getInfo",
    type: "GET", dataType: 'json', data: {},
    success: function (data) {
      if (data.code === 0) {
        let aqyhData = data.info.hiddenDanger.data,
          znyjData = data.info.intelligenttips.data,
          zbjcData = data.info.targetmonitor.data,
          syqyData = data.info.cloudpriseData.data,
          aqmData = data.info.safeCode.data

        // 安全隐患
        let str1 = '';
        for (let i = 0; i < aqyhData.length; i++) {
          str1 += `<div class="cb_tr">
              <div class="cb_td">${aqyhData[i].ename}</div>
              <div class="cb_td">${aqyhData[i].content}</div>
            </div>`
        }
        $('#aqyh').html(str1)
        // 智能预警
        let str2 = '';
        znyjData.forEach(element => {
          str2 += `<div class="cb_tr">
                <div class="cb_td">${element.ename}</div>
                <div class="cb_td">${element.sdanger}</div>
              </div>`
        });
        $('#znyj').html(str2)
        // 上云企业
        let str3 = '', syqyMax = 0;
        for (let i = 0; i < syqyData.length; i++) {
          if (syqyData[i].num > syqyMax) {
            syqyMax = syqyData[i].num
          }
        }
        console.log(syqyMax);
        syqyData.forEach(element => {
          str3 += `<li>
                <div class="s_name">${element.town}</div>
                <div class="s_line"><span style="width:${element.num / syqyMax * 100}%"></span></div>
                <div class="s_num">${element.num}</div>
              </li>`
        });
        $('#syqy').html(str3)
        // 安全码
        new CountUp("hongma", 0, Number(aqmData[0].red), 0, 1, options).start();
        new CountUp("chengma", 0, Number(aqmData[0].orange), 0, 1, options).start();
        new CountUp("huangma", 0, Number(aqmData[0].yellow), 0, 1, options).start();
        new CountUp("lvma", 0, Number(aqmData[0].green), 0, 1, options).start();
        // 指标检测
        new CountUp("qyzs", 0, Number(zbjcData[0].ecount), 0, 1, options).start();
        new CountUp("yxj", 0, Number(zbjcData[0].hascheck), 0, 1, options).start();
        new CountUp("wxj", 0, Number(zbjcData[0].notcheck), 0, 1, options).start();
      }
    }
  });
}


//项目占比划分
let ec1Data = [{ name: '危化品仓库', value: 120 }, { name: '年事事故总数', value: 60 }, { name: '其他', value: 18 }];
getChart(ec1Data, '隐患整改分析', 'charts1')

function getChart (obj1, obj2, id) {
  var charts1Data = obj1;
  var text = obj2;

  var data1 = new Array();

  for (var i = 0; i < charts1Data.length; i++) {
    data1.push(charts1Data[i].name);

  }

  let legendData = getLegendData(charts1Data, "name");
  let allData = getAllData(charts1Data, "value");


  var gcharts1 = echarts.init(document.getElementById(id));
  gcharts1option = {
    color: ['#0C81FE', '#44F0E9', '#9A05F5', '#ff4e00', '#ef4864'],
    backgroundColor: 'transparent',
    title: {
      show:false,
      text: text,
      left: fontSize * 3,
      y: '0%',
      textStyle: {
        fontSize: fontSize * 3.2,
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'item',
      textStyle: {
        fontSize: fontSize * 2
      }
    },
    // grid: {
    //     left: '8%',
    //     right: '5%',
    //     bottom: '4%',
    //     top: '50%',
    //     containLabel: true
    // },
    legend: {
      show: true,
      top: 'center',
      left: '50%',
      itemGap: 20,
      itemWidth: 20,
      itemHeight: 8,
      orient:'vertical',
      icon: 'roundRect',
      data: data1,
      formatter: function (params) {
        return "{title|" + params + "(}{value|" + legendData[params].value + "}{title|)}"
      },
      textStyle: {
        rich: {
          title: {
            // width: fontSize * 20,
            color: '#fff',
            fontSize: fontSize * 2.4,
          },
          title2: {
            // width: fontSize * 5,
            color: 'rgba(255,255,255,.9)',
            fontSize: fontSize * 2.4,
          },
          value: {
            color: '#FFD200',
            fontSize: fontSize * 3,
            fontWeight: 'bold'
          }
        }
      }
    },

    series: [{
      name: '项目数',
      type: 'pie',
      radius: ['0%', '65%'],
      // avoidLabelOverlap: false,
      roseType: 'radius',
      center: ['23%', '50%'],
      minAngle:30,
      itemStyle: { //图形样式
        normal: {
          borderColor: 'rgba(6, 28, 91, .5)',
          borderWidth: 1,
        },
      },
      label: {
        normal: {
          show: false,
          position: 'center',
          textStyle: {
            fontSize: fontSize * 2,
            fontWeight: 'bold'
          }
        },
        emphasis: {
          show: false,
          textStyle: {
            fontSize: fontSize * 3,
            color: '#00f4fb',
            fontWeight: 'bold'
          },
          formatter: function (params) {
            return params.value;
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: charts1Data
    },]
  };
  gcharts1.setOption(gcharts1option);


}


$('.center_btns li').click(function () {
  let n = $(this).index()
  $(this).addClass('active').siblings().removeClass('active')
  $('.center_check>div').eq(n).addClass('active').siblings().removeClass('active')
})