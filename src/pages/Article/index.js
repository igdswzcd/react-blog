import { Link, useNavigate } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
import img404 from '@/assets/error.png'
import { useEffect, useState } from 'react'
import { http } from '@/utils'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
	const navigate = useNavigate()
	const goPublish = (data) => {
		navigate(`/publish?id=${data.id}`)
	}
	const columns = [
		{
			title: '封面',
			dataIndex: 'cover',
			width: 120,
			render: (cover) => {
				return <img src={cover || img404} width={80} height={60} alt=''></img>
			}
		},
		{
			title: '标题',
			dataIndex: 'title',
			width: 220
		},
		{
			title: '状态',
			dataIndex: 'status',
			render: (data) => <Tag color='green'>审核通过</Tag>
		},
		{
			title: '发布时间',
			dataIndex: 'pubdate'
		},
		{
			title: '阅读数',
			dataIndex: 'read_count'
		},
		{
			title: '评论数',
			dataIndex: 'comment_count'
		},
		{
			title: '点赞数',
			dataIndex: 'like_count'
		},
		{
			title: '操作',
			render: (data) => {
				return (
					<Space size='middle'>
						<Button type='primary' shape='circle' icon={<EditOutlined></EditOutlined>} onClick={() => goPublish(data)}></Button>
						<Popconfirm title='确认删除？' onConfirm={() => delArticle(data)} okText='确认' cancelText='取消'>
							<Button type='primary' danger shape='circle' icon={<DeleteOutlined></DeleteOutlined>}></Button>
						</Popconfirm>
					</Space>
				)
			}
		}
	]
	// 类型数据
	const [channels, setChannels] = useState([])
	useEffect(() => {
		async function fetchChannels() {
			const res = await http.get('/channels')
			setChannels(res.data.channels)
		}
		fetchChannels()
	}, [])
	// 表格数据
	const [article, setArticle] = useState({ list: [], count: 0 })
	const [params, setParams] = useState({
		page: 1,
		per_page: 10
	})
	useEffect(() => {
		async function fetchArticle() {
			const res = await http.get('/mp/articles', { params })
			const { results, total_count } = res.data
			setArticle({
				list: results,
				count: total_count
			})
		}
		fetchArticle()
	}, [params])

	// 筛选
	const onSearch = (values) => {
		console.log(params)
		const { status, channel_id, date } = values
		const _params = {}
		_params.status = status
		if (channel_id >= 0) {
			_params.channel_id = channel_id
		}
		if (date) {
			_params.begin_pubdate = date[0].format('YYYY-MM-DD')
			_params.end_pubdate = date[1].format('YYYY-MM-DD')
		}
		setParams({
			...params,
			..._params
		})
	}

	const pageChange = (page, per_page) => {
		setParams({
			...params,
			page,
			per_page
		})
	}

	const delArticle = async (data) => {
		await http.delete(`/mp/articles/${data.id}`)
		setParams({
			...params,
			page: 1
		})
	}

	return (
		<div>
			<Card
				title={
					<Breadcrumb separator='>'>
						<Breadcrumb.Item>
							<Link to='/home'>首页</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>文章管理</Breadcrumb.Item>
					</Breadcrumb>
				}
				style={{ marginBottom: 20 }}>
				<Form onFinish={onSearch} initialValues={{ status: -1 }}>
					<Form.Item label='状态' name='status'>
						<Radio.Group>
							<Radio value={-1}>全部</Radio>
							<Radio value={0}>草稿</Radio>
							<Radio value={1}>待审核</Radio>
							<Radio value={2}>审核通过</Radio>
							<Radio value={3}>审核失败</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item label='类型' name='channel_id'>
						<Select placeholder='请选择文章分类' style={{ width: 200 }}>
							{channels.map((item) => (
								<Option key={item.id} value={item.id}>
									{item.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label='日期' name='date'>
						<RangePicker locale={locale}></RangePicker>
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' style={{ marginLeft: 80 }}>
							筛选
						</Button>
					</Form.Item>
				</Form>
			</Card>
			<Card title={`根据筛选条件共查询到 ${article.count} 条结果：`}>
				<Table rowKey='id' columns={columns} dataSource={article.list} pagination={{ position: ['bottomCenter'], current: params.page, pageSize: params.per_page, onChange: pageChange, total: article.count }} />
			</Card>
		</div>
	)
}
export default Article
