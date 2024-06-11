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
    const token = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjliN2JiZmVlMzQzZDVkNDQ5ZGFkODhmMjg0MGEyZTM3YzhkZWFlZTg5NjM4MGQ1ODA2YTc4NWVkMWQ1OTc5ZjAifQ.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJqWGJHYkZEQnpuIiwic2x1ZyI6InNpbmdsZXRvbmNvbW1lcmNlIiwiZW50ZXJwcmlzZSI6ZmFsc2UsInJlZ2lvbiI6InVzLWVhc3QtMSJ9LCJhcHBsaWNhdGlvbiI6eyJpZCI6IkdZZHFpUHlZak4iLCJraW5kIjoiaW50ZWdyYXRpb24iLCJwdWJsaWMiOmZhbHNlfSwic2NvcGUiOiJtYXJrZXQ6YWxsIiwiZXhwIjoxNzE4MTM0MzMwLCJ0ZXN0Ijp0cnVlLCJyYW5kIjowLjU5ODA2NDUxMTUzMjU3MjksImlhdCI6MTcxODEyNzEzMCwiaXNzIjoiaHR0cHM6Ly9jb21tZXJjZWxheWVyLmlvIn0.ItEz6MoYhhfwPUaGQvrAg1-vtxPcRFN50pvqWUbsKHHb3aXygKggn5I6Cdu1O2-Sgetd6uyG68kSBIg-u3zzR0bcgAnWjZGzqtb4r8m7TGwCAYXlrAUQVDJ91AO1OFxo-njYGecGTqr-BPxJOeuaAENPyM-PAJSO431aWxpPs_b8CO9nNhy90Iy4OLDqjFfzYOcOulkQBKyjoTx_UW0o6s8AtztzG2zHOd2e-sFneborhDVQ0Guq-rYRjkXhwESYRoqm1P-xlVmfkB1YqZ32kBJdpzy-s77Hgeuw2VwriV3Ddhrk9ccSEZUEb5tA2U2gpXZiva2f3CgSkqyTslQ3eZJ38z16L447J0B8Jd96WPgUueVC-YEeAUtstyRMEsogPzjYuLpdqvQMx-8D3Eq9adU-hUo7PQoLJIVhX-nOzglG4xRQ0n8xlHAm1njUhOtF_DUUwDZiHDVB9kcarloGoGvIxioTIwPb1RHGoUQwtaJGGo_gTPWWdKjGMsQ1fkBN-rZ8pKw3A_ihPVYxdHA2oyIPseptopTCxPnpzR6zcZaMgGgUOdGQZBBuMG-QJqX4sGAQbPf809f4B5an3yOLelpHVhToT0hNPeHxRrjbxt6Bum3LrEn_MiZfCHea3z_3Iy0OzxzrXiOnc7-OY416DxUqaNFiMmpF5vyW-HGRcLQ";

    try {
        const productsResponse = await fetch(`https://singletoncommerce.commercelayer.io/api/skus?include=prices`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }
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
