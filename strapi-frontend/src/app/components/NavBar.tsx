import Image from 'next/image'
export default function NavBar() {
    return (
            <div className="flex justify-between shadow-md py-4 px-8 relative">
                <div>
                    <Image
                        src="https://strapi.io/assets/strapi-logo-dark.svg"
                        width={100}
                        height={100}
                        alt="logo"
                    />
                </div>
                {/* <form>
                        <fieldset className='flex items-center'>
                            <label>Choose your admin :</label>
                            <div className="ml-3 relative border border-gray-300 text-gray-800 bg-white shadow-lg">
                                <select className="w-28 appearance-none py-1 px-2 bg-white" name="whatever" id="frm-whatever">
                                    <option value="1">Strapi</option>
                                    <option value="2">Sanity</option>
                                </select>
                                <div className="pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 border-l">
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </fieldset>
                    </form> */}
                <h1>Cart(0)</h1>
            </div>
    );
}