// assets/charts.js — 所有数据图表初始化
(function () {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim() || '#0f766e';
  var accent2 = style.getPropertyValue('--accent2').trim() || '#d97706';
  var ink = style.getPropertyValue('--ink').trim() || '#16211f';
  var muted = style.getPropertyValue('--muted').trim() || '#5f6f6b';
  var rule = style.getPropertyValue('--rule').trim() || 'rgba(22,33,31,0.11)';

  var axisCommon = {
    axisLine: { lineStyle: { color: rule } },
    axisTick: { show: false },
    axisLabel: { color: muted, fontSize: 11 },
    splitLine: { lineStyle: { color: rule, type: 'dashed' } }
  };

  function init(id) {
    var el = document.getElementById(id);
    if (!el || typeof echarts === 'undefined') return null;
    return echarts.init(el, null, { renderer: 'svg' });
  }

  var charts = [];

  /* ---- 图 3-2 测试投入结构雷达图 ---- */
  var radar = init('chart-radar');
  if (radar) {
    charts.push(radar);
    radar.setOption({
      animation: false,
      color: [accent, accent2, '#8aa8a2'],
      tooltip: { trigger: 'item', appendToBody: true },
      legend: {
        bottom: 4,
        itemGap: 18,
        textStyle: { color: muted, fontSize: 11 },
        data: ['Web SaaS', '移动 App', '后端服务']
      },
      radar: {
        center: ['50%', '48%'],
        radius: '62%',
        indicator: [
          { name: '功能', max: 100 },
          { name: '接口', max: 100 },
          { name: '性能', max: 100 },
          { name: '安全', max: 100 },
          { name: '兼容', max: 100 },
          { name: '自动化', max: 100 }
        ],
        axisName: { color: ink, fontSize: 11 },
        splitLine: { lineStyle: { color: rule } },
        splitArea: { areaStyle: { color: ['rgba(255,255,255,0.35)', 'rgba(15,118,110,0.03)'] } },
        axisLine: { lineStyle: { color: rule } }
      },
      series: [{
        type: 'radar',
        symbolSize: 4,
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.10 },
        data: [
          { name: 'Web SaaS', value: [85, 80, 60, 55, 50, 70] },
          { name: '移动 App', value: [90, 55, 65, 50, 88, 55] },
          { name: '后端服务', value: [55, 90, 85, 75, 30, 82] }
        ]
      }]
    });
  }

  /* ---- 图 5-2 缺陷严重程度分布 ---- */
  var severity = init('chart-severity');
  if (severity) {
    charts.push(severity);
    severity.setOption({
      animation: false,
      color: [accent2, '#e8a04a', '#7fa79f', '#c9d8d3'],
      tooltip: {
        trigger: 'item',
        appendToBody: true,
        formatter: '{b}：{c} 个（{d}%）'
      },
      legend: {
        bottom: 6,
        textStyle: { color: muted, fontSize: 11 },
        itemWidth: 10,
        itemHeight: 10
      },
      series: [{
        name: '缺陷数量',
        type: 'pie',
        radius: ['42%', '66%'],
        center: ['50%', '46%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: 'rgba(255,255,255,0.9)', borderWidth: 2 },
        label: {
          color: ink,
          fontSize: 11,
          formatter: '{b}\n{c} 个'
        },
        labelLine: { lineStyle: { color: rule } },
        data: [
          { value: 3, name: 'P0 致命' },
          { value: 12, name: 'P1 严重' },
          { value: 28, name: 'P2 一般' },
          { value: 41, name: 'P3 轻微' }
        ]
      }]
    });
  }

  /* ---- 图 6-3 手工回归 vs 自动化累计成本 ---- */
  var roi = init('chart-roi');
  if (roi) {
    charts.push(roi);
    var rounds = [];
    var manual = [];
    var auto = [];
    for (var i = 1; i <= 12; i++) {
      rounds.push('第 ' + i + ' 轮');
      manual.push(i * 10);
      auto.push(40 + i * 4);
    }
    roi.setOption({
      animation: false,
      color: [accent2, accent],
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        valueFormatter: function (v) { return v + ' 人时'; }
      },
      legend: {
        top: 2,
        right: 4,
        textStyle: { color: muted, fontSize: 11 }
      },
      grid: { left: 44, right: 18, top: 38, bottom: 34 },
      xAxis: Object.assign({
        type: 'category',
        boundaryGap: false,
        data: rounds
      }, axisCommon, { splitLine: { show: false } }),
      yAxis: Object.assign({
        type: 'value',
        name: '累计人时',
        nameTextStyle: { color: muted, fontSize: 11 }
      }, axisCommon),
      series: [
        {
          name: '纯手工回归',
          type: 'line',
          smooth: true,
          symbolSize: 5,
          lineStyle: { width: 2.5 },
          areaStyle: { opacity: 0.07 },
          data: manual
        },
        {
          name: '自动化（含建设与维护）',
          type: 'line',
          smooth: true,
          symbolSize: 5,
          lineStyle: { width: 2.5 },
          areaStyle: { opacity: 0.07 },
          data: auto
        }
      ]
    });
  }

  /* ---- 图 7-1 并发 / 吞吐 / 响应时间 ---- */
  var perf = init('chart-perf');
  if (perf) {
    charts.push(perf);
    perf.setOption({
      animation: false,
      color: [accent, accent2],
      tooltip: { trigger: 'axis', appendToBody: true },
      legend: {
        top: 4,
        left: 'center',
        itemGap: 24,
        textStyle: { color: muted, fontSize: 11 },
        data: ['TPS', 'P95 响应时间']
      },
      grid: { left: 52, right: 56, top: 56, bottom: 36 },
      xAxis: Object.assign({
        type: 'category',
        boundaryGap: false,
        data: ['20', '40', '60', '80', '100', '120', '140', '160', '180', '200'],
        name: '并发用户数',
        nameTextStyle: { color: muted, fontSize: 11 },
        nameLocation: 'middle',
        nameGap: 26
      }, axisCommon, { splitLine: { show: false } }),
      yAxis: [
        Object.assign({
          type: 'value',
          name: 'TPS',
          nameTextStyle: { color: accent, fontSize: 11 }
        }, axisCommon),
        Object.assign({
          type: 'value',
          name: '响应时间 (ms)',
          nameTextStyle: { color: accent2, fontSize: 11 }
        }, axisCommon, { splitLine: { show: false } })
      ],
      series: [
        {
          name: 'TPS',
          type: 'line',
          smooth: true,
          symbolSize: 5,
          yAxisIndex: 0,
          lineStyle: { width: 2.5 },
          areaStyle: { opacity: 0.08 },
          data: [1800, 3400, 4900, 6100, 7000, 7400, 7450, 7300, 6900, 6100]
        },
        {
          name: 'P95 响应时间',
          type: 'line',
          smooth: true,
          symbolSize: 5,
          yAxisIndex: 1,
          lineStyle: { width: 2.5, type: 'dashed' },
          data: [60, 75, 95, 120, 150, 220, 420, 900, 1800, 3200]
        }
      ]
    });
  }

  /* ---- 图 9-3 AI 辅助前后耗时对比 ---- */
  var ai = init('chart-ai');
  if (ai) {
    charts.push(ai);
    ai.setOption({
      animation: false,
      color: ['#9fb6b1', accent],
      tooltip: {
        trigger: 'axis',
        appendToBody: true,
        valueFormatter: function (v) { return v + ' 小时'; }
      },
      legend: {
        top: 2,
        right: 4,
        textStyle: { color: muted, fontSize: 11 }
      },
      grid: { left: 44, right: 18, top: 42, bottom: 42 },
      xAxis: Object.assign({
        type: 'category',
        data: ['用例设计', '脚本编写', '数据构造', '缺陷分析', '回归执行'],
        axisLabel: { color: muted, fontSize: 11, interval: 0 }
      }, axisCommon, { splitLine: { show: false } }),
      yAxis: Object.assign({
        type: 'value',
        name: '耗时（小时）',
        nameTextStyle: { color: muted, fontSize: 11 }
      }, axisCommon),
      series: [
        {
          name: '未使用 AI',
          type: 'bar',
          barWidth: 16,
          itemStyle: { borderRadius: [3, 3, 0, 0] },
          data: [16, 12, 8, 6, 4]
        },
        {
          name: 'AI 辅助后（含人工校验）',
          type: 'bar',
          barWidth: 16,
          itemStyle: { borderRadius: [3, 3, 0, 0] },
          data: [6, 5, 3, 4, 3.5]
        }
      ]
    });
  }

  window.addEventListener('resize', function () {
    charts.forEach(function (c) { c.resize(); });
  });
})();
