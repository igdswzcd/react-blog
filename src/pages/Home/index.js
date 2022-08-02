import Bar from '@/components/Bar'
import './index.scss'

const Home = () => {
	return (
		<div className='home'>
			<Bar style={{ width: '500px', height: '400px' }} xData={['March', 'April', 'May']} sData={[5, 6, 7]} title='月文章数量' />
			<Bar style={{ width: '500px', height: '400px' }} xData={['Java', 'Python', 'C++']} sData={[3, 9, 8]} title='分类数量' />
		</div>
	)
}
export default Home
