import { Card, Breadcrumb, Form, Button, Radio, Input, Upload, Space, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ReactQuill from 'react-quill-2'
import 'react-quill-2/dist/quill.snow.css'
import './index.scss'
import { useEffect, useRef, useState } from 'react'
import { http } from '@/utils'
const { Option } = Select
const Publish = () => {
	const navigate = useNavigate()
	const [channels, setChannels] = useState([])
	useEffect(() => {
		async function fetchChannels() {
			const res = await http.get('/channels')
			setChannels(res.data.channels)
		}
		fetchChannels()
	}, [])

	const [fileList, setFileList] = useState([])
	const fileListRef = useRef([])
	const onUploadChange = (info) => {
		const fileList = info.fileList.map((file) => {
			if (file.response) {
				return {
					url: file.response.data.url
				}
			}
			return file
		})
		setFileList(fileList)
		fileListRef.current = fileList
	}
	const [imgCount, setImgCount] = useState(1)
	const changeType = (e) => {
		const count = e.target.value
		setImgCount(count)
		if (count === 1) {
			const firstImg = fileListRef.current[0]
			setFileList(!firstImg ? [] : [firstImg])
		} else if (count > 1) {
			setFileList(fileListRef.current)
		}
	}

	const onFinish = async (values) => {
		const { type, ...rest } = values
		const params = {
			...rest,
			cover: { type: type, images: fileList.map((item) => item.url) }
		}
		if (articleId) {
			await http.put(`/mp/articles/${articleId}?draft=false`, params)
		} else {
			await http.post('/mp/articles?draft=false', params)
		}
		navigate('/article')
		message.success(`${articleId ? '更新成功' : '发布成功'}`)
	}

	const [params] = useSearchParams()
	const articleId = params.get('id')
	const form = useRef(null)
	useEffect(() => {
		async function getArticle() {
			const res = await http.get(`/mp/articles/${articleId}`)
			const { cover, ...formValue } = res.data
			console.log(cover.type)
			form.current.setFieldsValue({ ...formValue, type: cover.type })
			const imageList = cover.images.map((item) => ({ url: item }))
			setFileList(imageList)
			setImgCount(cover.type)
			fileListRef.current = imageList
		}
		if (articleId) {
			getArticle()
		}
	}, [articleId, form])
	return (
		<div className='publish'>
			<Card
				title={
					<Breadcrumb separator='>'>
						<Breadcrumb.Item>
							<Link to='/home'>首页</Link>
						</Breadcrumb.Item>
						<Breadcrumb.Item>{articleId ? '更新文章' : '发布文章'}</Breadcrumb.Item>
					</Breadcrumb>
				}>
				<Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} initialValues={{ type: 1, content: '' }} onFinish={onFinish} ref={form}>
					<Form.Item label='标题' name='title' rules={[{ required: true, message: '请输入文章标题' }]}>
						<Input placeholder='请输入文章标题' style={{ width: 400 }}></Input>
					</Form.Item>
					<Form.Item label='分类' name='channel_id' rules={[{ required: true, message: '请选择文章分类' }]}>
						<Select placeholder='请选择文章分类' style={{ width: 200 }}>
							{channels.map((item) => (
								<Option key={item.id} value={item.id}>
									{item.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label='封面'>
						<Form.Item name='type'>
							<Radio.Group onChange={changeType}>
								<Radio value={1}>单图</Radio>
								<Radio value={2}>双图</Radio>
								<Radio value={3}>三图</Radio>
								<Radio value={0}>无图</Radio>
							</Radio.Group>
						</Form.Item>
						{imgCount > 0 && (
							<Upload name='image' listType='picture-card' className='avatar-uploader' showUploadList action='http://geek.itheima.net/v1_0/upload' fileList={fileList} onChange={onUploadChange} maxCount={imgCount} multiple={imgCount > 1}>
								<div style={{ marginTop: 8 }}>
									<PlusOutlined></PlusOutlined>
								</div>
							</Upload>
						)}
					</Form.Item>
					<Form.Item label='内容' name='content' rules={[{ required: true, message: '请输入文章内容' }]}>
						<ReactQuill className='publish-quill' theme='snow' placeholder='请输入文章内容'></ReactQuill>
					</Form.Item>
					<Form.Item wrapperCol={{ offset: 4 }}>
						<Space>
							<Button size='large' type='primary' htmlType='submit'>
								{articleId ? '更新' : '发布'}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Card>
		</div>
	)
}
export default Publish
