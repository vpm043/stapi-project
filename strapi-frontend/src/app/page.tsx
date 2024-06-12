import Image from 'next/image';
import Link from 'next/link';
import ProductList from '@/app/components/ProductList';

interface Product {
    id: number;
    attributes: {
        name: string;
        description: string;
        price: number;
        thumbnail: string;
        Filtercard: {
            categorytitle: string;
            CategoryItem: {
                id: number;
                title: string;
                api: string;
            }[];
        }[];
    };
}


const fetchProducts = async (): Promise<{ products: Product[]; apiProduct: { products: any[] } }> => {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    try {
        const productResponse = await fetch(`${baseUrl}/api/filter-cards?populate[Filtercard][populate]=*`,{ next: { revalidate: 0 } });
        if (!productResponse.ok) {
            throw new Error('Network response for products was not ok');
        }

        const productsData = await productResponse.json();
        const apiData = productsData?.data[0]?.attributes.Filtercard[0].CategoryItem[0]?.api;
        let apiProduct;
        if (apiData) {
            const api = await fetch(apiData);
            apiProduct = await api.json();
        }

        const products = productsData.data.map((product: any) => ({
            id: product.id,
            attributes: {
                name: product.attributes.name,
                description: product.attributes.description,
                price: product.attributes.price,
                thumbnail: product.attributes.thumbnail,
                Filtercard: product.attributes.Filtercard.map((card: any) => ({
                    categorytitle: card.categorytitle,
                    CategoryItem: card.CategoryItem.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                    })),
                })),
            },
        }));

        return { products, apiProduct };
    } catch (error) {
        console.error('Fetch error:', error);
        return { products: [], apiProduct: { products: [] } };
    }
};

export default async function Product() {
    const { products } = await fetchProducts();

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="flex gap-6">
                    {products.map(product => (
                        <div className="product w-52" key={product.id}>
                            <div className="grid gap-6">
                                {product.attributes.Filtercard.map(card => (
                                    <div key={card.categorytitle} className='grid gap-3'>
                                        <h2>{card.categorytitle}</h2>
                                        {card.CategoryItem.map(item => (
                                            <div key={item.id}>
                                                <div className='border p-4 rounded-lg'>
                                                    <h3>{item.title}</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <ProductList />
                </div>
            </div>
        </div>
    );
}
