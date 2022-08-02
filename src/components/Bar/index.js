import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

function echartInit(node, xData, sData, title) {
	const myChart = echarts.init(node)
	myChart.setOption({
		title: {
			text: title
		},
		tooltip: {},
		xAxis: {
			data: xData
		},
		yAxis: {},
		series: [
			{
				name: '数量',
				type: 'bar',
				data: sData
			}
		]
	})
}

function Bar({ style, xData, sData, title }) {
	const nodeRef = useRef(null)
	useEffect(() => {
		echartInit(nodeRef.current, xData, sData, title)
	}, [xData, sData, title])
	return <div ref={nodeRef} style={style}></div>
}

export default Bar
