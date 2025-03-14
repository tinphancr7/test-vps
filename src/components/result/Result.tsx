import { Icon403, Icon404, Icon500 } from '@/components/icon'
interface ResultProps {
  status: string
  title: string
  subTitle: string
  extra?: React.ReactNode
}
const Result = ({ status, title, subTitle, extra }: ResultProps) => {
  const renderIconStatus = (status: string) => {
    switch (status) {
      case '403':
        return <Icon403 />
      case '404':
        return <Icon404 />
      default:
        return <Icon500 />
    }
  }
  return (
    <div className='flex flex-col items-center justify-center h-screen text-center bg-gray-100'>
      <div className='mb-4'>{renderIconStatus(status)}</div>
      <div className='text-6xl font-bold text-red-500 mb-4'>{title}</div>
      <div className='text-xl text-gray-600 mb-6'>{subTitle}</div>

      {extra && <div className='text-gray-600'>{extra}</div>}
    </div>
  )
}

export default Result
