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
    const token = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjliN2JiZmVlMzQzZDVkNDQ5ZGFkODhmMjg0MGEyZTM3YzhkZWFlZTg5NjM4MGQ1ODA2YTc4NWVkMWQ1OTc5ZjAifQ.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJqWGJHYkZEQnpuIiwic2x1ZyI6InNpbmdsZXRvbmNvbW1lcmNlIiwiZW50ZXJwcmlzZSI6ZmFsc2UsInJlZ2lvbiI6InVzLWVhc3QtMSJ9LCJhcHBsaWNhdGlvbiI6eyJpZCI6IkdZZHFpUHlZak4iLCJraW5kIjoiaW50ZWdyYXRpb24iLCJwdWJsaWMiOmZhbHNlfSwic2NvcGUiOiJtYXJrZXQ6YWxsIiwiZXhwIjoxNzE4MDE1MTk3LCJ0ZXN0Ijp0cnVlLCJyYW5kIjowLjcyMDQ0MDM0MDM1OTAxNDIsImlhdCI6MTcxODAwNzk5NywiaXNzIjoiaHR0cHM6Ly9jb21tZXJjZWxheWVyLmlvIn0.UaLy9lZdy-UGUj0g6QSEuKUEl7FiQQz7QQdiixmSuPVwxHbZo4Ri27vuqPm9RtpwQNnmF4yaF1dad04zD9-5y8p3hmqAAe3fJmxh4knzlJHjDiOU17r37WTAv-IhJjKy_fCmQcwQq1Uz_5kygO890PBMiyqHclJcnaEXudhZgjZ7lS0FtnDOgRvzIHCTDo7oN_V6DTvk09Tqqon4f--rHBWeDTQc_b5yJnzkaYvjFt4JCMgWKs486ZnAl2ZvL48REriNhZzA3-Cd0GKo9tmWHqUKgqR5wZwXbozKCFuRQd3JWg2buGDi8f6MMXmwW7BZ40qEKX-mqXGkIP1x4N-nfM273twiNGRyQzEQOwqjf9FO1aV-jFJx8vZQ1B0Tjmx7itVbBys_t4jMpFrROQ3bMU4jlZ8cKxvnlzQ-lXvcxORiz0m1aRzixyzs_srWeTcVmsQJpwG7PBNz0DtA4NRKNH5wp9XCceQhVx7_m9Lf3xfYs9iBXUGz6pBkks0WYCAUY-2tXYUn4uBun7MBQSZYYY5ZtJscJEW1yaihVG24XVypCtOOtimJqrCfAGlh48FpvjBWJussx3EP_jUz0b-KNKIJJu_9zFejFn_69xeZ72UO-6HRC6z6Jjgmx5sH2IEoLGppALyMaPgKupBkkqH_y9uVH6d6jMPCikJyvBYukMo";

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
