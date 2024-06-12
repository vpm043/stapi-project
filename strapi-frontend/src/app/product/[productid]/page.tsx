import ProductDetails from "@/app/components/ProductDetail";

interface Product {
    id: string;
    name: string;
    image_url: string;
    description: string;
    formatted_amount: string;
    formatted_compare_at_amount: string;
}

const fetchProduct = async (id: string): Promise<Product> => {
    const token = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjliN2JiZmVlMzQzZDVkNDQ5ZGFkODhmMjg0MGEyZTM3YzhkZWFlZTg5NjM4MGQ1ODA2YTc4NWVkMWQ1OTc5ZjAifQ.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJqWGJHYkZEQnpuIiwic2x1ZyI6InNpbmdsZXRvbmNvbW1lcmNlIiwiZW50ZXJwcmlzZSI6ZmFsc2UsInJlZ2lvbiI6InVzLWVhc3QtMSJ9LCJhcHBsaWNhdGlvbiI6eyJpZCI6IkdZZHFpUHlZak4iLCJraW5kIjoiaW50ZWdyYXRpb24iLCJwdWJsaWMiOmZhbHNlfSwic2NvcGUiOiJtYXJrZXQ6YWxsIiwiZXhwIjoxNzE4MTc2ODc3LCJ0ZXN0Ijp0cnVlLCJyYW5kIjowLjUyNDQ5OTA1MjQzNDEwMDcsImlhdCI6MTcxODE2OTY3NywiaXNzIjoiaHR0cHM6Ly9jb21tZXJjZWxheWVyLmlvIn0.YowYLGEPVwcCvV9_oGEroz4UzrLM4d4sa-VmhBwB7xfjm6UkzLErKJhedREktp0P0kYqtusHdW9sPU2VmE3RiwSB6h9VCRrQ5_QGim2MG7B15yQotiIKLlGsSlS4U0YVxAEZ80bi3qcBmWaTMctnGQFhFObZDM2t1qTYic0gMfXeT8irdaQQE8FvqoasT2nz12dA28bGFU-JGyEzJVN_Vk79vMNR1KJUkyj0s4fbK328vclQVpEreUJ_gphgbWZoC2ujbk9wwlQruY_v4xfh8U4xKH2QBoQWH2z7pLgtZ0yFMtpmw5_F9b_aI3XTaAwAXTBqXuW7UH6dkwW0TYhk3cT9gO4H4aiGWArQuHHTq-QnYdx7bMNoPZv_ojx-RHvcN2f9EIdk2bFvaFBqwOOBLQyM7w4ykVsfOXx3guzetsBhjai6HP_x97K93iCphddcpiVgU-O8NqtuRyuAkUR10d2GzIVxby3Jno5IHKzsQzl71rZwMeSjmsHVGbJAEPba8HgrdyfBZBke1mIREb39DLkc2aF7a_opx1wuqjS38ZE8CUfV0qzS1sB1Pck1zzj8lrBCXU6orrh7R7Y2tZmzNnEzKpme1WRN2aVX0NUOoghmxjqFaj29rQu25FJeheAKpy9kcOB4opntR8dJzuDqq4tH6ZFlnJyQFeQ45G4gsXc";

    try {
        const productsResponse = await fetch(`https://singletoncommerce.commercelayer.io/api/skus?include=prices`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        });

        if (!productsResponse.ok) {
            throw new Error('Network response for filter-cards was not ok');
        }

        const productsData = await productsResponse.json();
        const includedPrices = productsData.included;

        const productData = productsData.data.find((product: any) => product.id === id);

        if (!productData) {
            throw new Error('Product not found');
        }

        const price = includedPrices.find((price: any) => price.type === 'prices' && price.attributes.sku_code === productData.attributes.code);

        const product: Product = {
            id: productData.id,
            name: productData.attributes.name,
            description: productData.attributes.description,
            image_url: productData.attributes.image_url,
            formatted_amount: price ? price.attributes.formatted_amount : 'Price not set',
            formatted_compare_at_amount: price ? price.attributes.formatted_compare_at_amount : 'Price not set'
        };

        // Log the image URL to verify it
        console.log('Image URL:', product.image_url);

        return product;

    } catch (error) {
        console.log('Fetch error:', error);
        throw new Error("failed to fetch data");
    }
};

export default async function Product({ params }: { params: any }) {
    const { productid } = params;

    const data = await fetchProduct(productid);
    console.log(productid, data);
    return (
        <div>
            <ProductDetails data={data} />
        </div>
    );
}
