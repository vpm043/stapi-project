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
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJvcmdhbml6YXRpb25JZCI6IjQ4MDlmMmY0LTY4ZDgtNDU0MS1hMjQyLTllMDZiYzgyNmY2ZiIsImlzQW5vbnltb3VzIjp0cnVlLCJub25jZSI6IjVlZGNhYzM4LTdhMjAtMTFlZS1iOTYyLTAyNDJhYzEyMDAwMiIsImlhdCI6MTcxODIwOTk5NCwiZXhwIjoxNzE4MjM4Nzk0fQ.gpNvboI6txrCEAz-teokBTK9rC1DjHwOyh7n1-8WNW0";
    const commerceLayerToken = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjliN2JiZmVlMzQzZDVkNDQ5ZGFkODhmMjg0MGEyZTM3YzhkZWFlZTg5NjM4MGQ1ODA2YTc4NWVkMWQ1OTc5ZjAifQ.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJFeXBWT0ZPTkxuIiwic2x1ZyI6InNpbmdsZXRvbiIsImVudGVycHJpc2UiOmZhbHNlLCJyZWdpb24iOiJldS13ZXN0LTEifSwiYXBwbGljYXRpb24iOnsiaWQiOiJwUGtaaWFuWEJNIiwia2luZCI6InNhbGVzX2NoYW5uZWwiLCJwdWJsaWMiOnRydWV9LCJtYXJrZXQiOnsiaWQiOlsiRWxEa1hocERWZyJdLCJzdG9ja19sb2NhdGlvbl9pZHMiOlsiRG5nZXB1Vm1iayJdLCJnZW9jb2Rlcl9pZCI6bnVsbCwiYWxsb3dzX2V4dGVybmFsX3ByaWNlcyI6ZmFsc2V9LCJzY29wZSI6Im1hcmtldDppZDpFbERrWGhwRFZnIiwiZXhwIjoxNzE4MjI0MzU5LCJ0ZXN0Ijp0cnVlLCJyYW5kIjowLjA1OTg2NzA4NTYxNDE3OTE5NCwiaWF0IjoxNzE4MjA5OTU5LCJpc3MiOiJodHRwczovL2NvbW1lcmNlbGF5ZXIuaW8ifQ.NJZMiptI9v5AoK90vSL_F81qF9Wo8dD-L-Woeya5NUGbr5UGxjgWiNkfAYPL2v27JQHqlUpUte5WbkfdTvktmJByNCzXNckLtiQPV_vimJilGu4Fmfgwtv7aEoPwKsUL7ys5fB5u0hBnYFkq47VPpGXd5EMNhQe7S9baIasb3CWKDcwTscpZYKcCVZbbQxdezOGniDkpw-6JdAY-r5bpXftwu9BZ9DxgPDTVraZoZ91lEZDoInZ7u6erdQJq9vKO3Vzn9OJn3fDgr1fzC2KWqfY4OLV59FWeOaKIdjWSSwIS_0_jjdNg0M7Qs2VXEApZGBrSZRnx8fkWeS3BRwHtwjjMVoGAWrDE0sK6D_DwICPBvKYVdPcRCOY325qBZziX2qeoH0LcuNscKtTC2LE1wVikM5U1CQv26rzxs8jaUWoAwYERDTxoDycx3aJGPdECNUakw-aEaAxTqEI6S4Z7s_9-2dbAdu_xvbuYrj7yOr8qi5EP2KeI-WQNDN2I5yd0Huf-FQYNlNtG01u3ZtjX6WHEsmDUz0ztMyGW_9t-XOh0KuCcgPBvv7Qea5FMjSYr3OOu37u3S6j2UwSpGiM8ZqOUF94eZhTFit56BvPZfnmNv8WaVAfCfQ50gQpgupEqJznbZjfEAiIQafMF6bJ2KoX7TRtp4j0yGts4vTfsBpA";
    try {
        const productsResponse = await fetch(`https://intgmg.vertex.digitalworks.live/api/store/v1/search?searchTerm=&page=1&size=10&sortBy=createdAt&sortDir=ASC`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
                'token': commerceLayerToken,
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
