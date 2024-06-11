"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    image_url: string;
    formatted_amount: any;
    formatted_compare_at_amount: any;
}

interface DropdownItem {
    id: number;
    items: string;
}

const fetchProducts = async (): Promise<Product[]> => {
    const token = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjliN2JiZmVlMzQzZDVkNDQ5ZGFkODhmMjg0MGEyZTM3YzhkZWFlZTg5NjM4MGQ1ODA2YTc4NWVkMWQ1OTc5ZjAifQ.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJqWGJHYkZEQnpuIiwic2x1ZyI6InNpbmdsZXRvbmNvbW1lcmNlIiwiZW50ZXJwcmlzZSI6ZmFsc2UsInJlZ2lvbiI6InVzLWVhc3QtMSJ9LCJhcHBsaWNhdGlvbiI6eyJpZCI6IkdZZHFpUHlZak4iLCJraW5kIjoiaW50ZWdyYXRpb24iLCJwdWJsaWMiOmZhbHNlfSwic2NvcGUiOiJtYXJrZXQ6YWxsIiwiZXhwIjoxNzE4MDQ5NDU4LCJ0ZXN0Ijp0cnVlLCJyYW5kIjowLjU4OTU0NjYwNDQ4MDUxODQsImlhdCI6MTcxODA0MjI1OCwiaXNzIjoiaHR0cHM6Ly9jb21tZXJjZWxheWVyLmlvIn0.BvN0Ziodfm7Yc7EXdWo0O-bePci6lg88kE8Ps9Rs8aIKvQpVaD36ZKin147jxAZJM03ZJy-c4xeQHHU2hLamaK5kmsSpUhxYtAIayV4zx4ryZPTxYAgJZ_a_qdvIXH_q5aujNjzRIF5vIoyRLHtfst2rw22QpLdvZ26GxAUtEGRAmB3mbrfiEvg9p-CVT0F3JMwEt8FoVMblZd13B8fbWodU1oXAVom0jdRwTDh6mJlT75Fr086-yaN2Nt8gB5r7m_gV8eyexgI526Kgqj9IHofr7g_x-sm_UzLmKeeA7TpxoU68Bu5LO1tQLrG0kDC2-OtVs9reb_Jnq2St9gRQo59moXnGdsqqo1u4Vn3wW6pT4uyQbmfSbIJ86T36SkpfyaAryYPJ-6fCq58aRv66lGXl_zqGsiK0_XKZPKlv3fLjpJu-_0ZcsNygKy6tytJeibGnGUbpfXIJre7x3dtYG1GEQuLMhhHl2nYm3Iw3eWHIIJEvCMsgBZY7HI4SZuEL7OHnXZrbIXfDYRrtk7AKCQ8Mzl7H3Pze6mVneue8CqFBygwGqAEO-d546ffSm4KHtXU0UtZh7LNl3RzU5x8pMiZeiVwpZeAAM3tbsyD_kvGirEuDyZfyxJzhqISopQPrYwocOvxyOdKUpKZk36n_9nKc9XbfeYiimpdL2IkdbzE";

    try {
        const productsResponse = await fetch(`https://singletoncommerce.commercelayer.io/api/skus?include=prices`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                grant_type: 'client_credentials',
                client_id: 'ls0_29nVfjraaA-S9xNDC2rjW04F4NzErUVUmoPfL4M',
                client_secret: 'X6stYzFf4tOF3IAhlunW58W_JUv5IKdkc4YqKMvh5zk'
            })
        });

        if (!productsResponse.ok) {
            throw new Error('Network response for products was not ok');
        }

        const productsData = await productsResponse.json();
        console.log(productsData);
        const includedPrices = productsData.included;
        const products = productsData.data.map((product: any) => {
            const price = includedPrices.find((price: any) => price.type === 'prices' && price.attributes.sku_code === product.attributes.code);
            return {
                id: product.id,
                name: product.attributes.name,
                image_url: product.attributes.image_url,
                formatted_amount: price ? price.attributes.formatted_amount : 'Price not set',
                formatted_compare_at_amount: price ? price.attributes.formatted_compare_at_amount : 'Price not set'
            
            };
        });
        return products;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
};

const fetchDropdownItems = async (): Promise<DropdownItem[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL as string;

    try {
        const productViewResponse = await fetch(`${baseUrl}/api/productview?populate=*`);
        if (!productViewResponse.ok) {
            throw new Error('Network response for productview was not ok');
        }
        const productViewData = await productViewResponse.json();
        const dropdownItems = productViewData?.data?.attributes?.items || [];

        return dropdownItems;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
};

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>("");

    useEffect(() => {
        const loadData = async () => {
            const products = await fetchProducts();
            setProducts(products);
            const dropdownItems = await fetchDropdownItems();
            setDropdownItems(dropdownItems);
        };

        loadData();
    }, []);

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };

    const getGridCols = () => {
        switch (selectedOption) {
            case "Card View 4 Column":
                return "grid-cols-4";
            case "Card View 3 Column":
                return "grid-cols-3";
            case "Card View 2 Column":
                return "grid-cols-2";
            case "List View":
                return "grid-cols-1";
            default:
                return "grid-cols-4";
        }
    };

    return (
        <div className='w-full grid gap-4'>
            <div className='flex justify-end items-center'>
                <span className='mr-2.5'>View As :</span>
                <select
                    id="view-select"
                    className="p-2 border rounded"
                    onChange={handleSelectChange}
                >
                    {dropdownItems.map(item => (
                        <option key={item.id} value={item.items}>
                            {item.items}
                        </option>
                    ))}
                </select>
            </div>
            <div className={`grid ${getGridCols()} gap-4`}>
                {products.map(product => (
                    <div key={product.id} className="border p-4">
                        <Link href={`/product/${product.id}`}>
                            <Image width={400} height={400} src={product.image_url} alt='' />
                            <h2 className="mt-2 text-lg font-bold">{product.name}</h2>
                            <div className="flex justify-between">
                                <h2>{product.formatted_amount}</h2>
                                <h2 className='line-through'>{product.formatted_compare_at_amount}</h2>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
