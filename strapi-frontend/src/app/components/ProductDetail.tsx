
interface Product {
    id: string;
    name: string;
    image_url: string;
    description: string;
    formatted_amount: any;
    formatted_compare_at_amount: string;
  }
  
  import Image from 'next/image'
  export default function ProductDetails({ data }: { data: Product }) {
    return (
      <div className="container px-5 py-24 mx-auto">
        <div className='flex'>
          <div className="w-3/6 border flex justify-center items-center">
            <div>
              <div className="product-item" key={data.id}>
              <Image width={400} height={400} src={data.image_url} alt='' />
              </div>
            </div>
          </div>
          <div className="w-3/6 mx-auto">
            <div className="lg:pl-10 lg:py-6 mt-6 lg:mt-0 grid grid-flow-row gap-6">
              <h5 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {data.name}
              </h5>
              <p>{data.description}</p>
              <div className="grid grid-flow-col gap-4">
                <h2>{data.formatted_amount}</h2>
              </div>
              <button className="w-36 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }