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
    const token = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjliN2JiZmVlMzQzZDVkNDQ5ZGFkODhmMjg0MGEyZTM3YzhkZWFlZTg5NjM4MGQ1ODA2YTc4NWVkMWQ1OTc5ZjAifQ.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJqWGJHYkZEQnpuIiwic2x1ZyI6InNpbmdsZXRvbmNvbW1lcmNlIiwiZW50ZXJwcmlzZSI6ZmFsc2UsInJlZ2lvbiI6InVzLWVhc3QtMSJ9LCJhcHBsaWNhdGlvbiI6eyJpZCI6IkdZZHFpUHlZak4iLCJraW5kIjoiaW50ZWdyYXRpb24iLCJwdWJsaWMiOmZhbHNlfSwic2NvcGUiOiJtYXJrZXQ6YWxsIiwiZXhwIjoxNzE4MDE1MTk3LCJ0ZXN0Ijp0cnVlLCJyYW5kIjowLjcyMDQ0MDM0MDM1OTAxNDIsImlhdCI6MTcxODAwNzk5NywiaXNzIjoiaHR0cHM6Ly9jb21tZXJjZWxheWVyLmlvIn0.UaLy9lZdy-UGUj0g6QSEuKUEl7FiQQz7QQdiixmSuPVwxHbZo4Ri27vuqPm9RtpwQNnmF4yaF1dad04zD9-5y8p3hmqAAe3fJmxh4knzlJHjDiOU17r37WTAv-IhJjKy_fCmQcwQq1Uz_5kygO890PBMiyqHclJcnaEXudhZgjZ7lS0FtnDOgRvzIHCTDo7oN_V6DTvk09Tqqon4f--rHBWeDTQc_b5yJnzkaYvjFt4JCMgWKs486ZnAl2ZvL48REriNhZzA3-Cd0GKo9tmWHqUKgqR5wZwXbozKCFuRQd3JWg2buGDi8f6MMXmwW7BZ40qEKX-mqXGkIP1x4N-nfM273twiNGRyQzEQOwqjf9FO1aV-jFJx8vZQ1B0Tjmx7itVbBys_t4jMpFrROQ3bMU4jlZ8cKxvnlzQ-lXvcxORiz0m1aRzixyzs_srWeTcVmsQJpwG7PBNz0DtA4NRKNH5wp9XCceQhVx7_m9Lf3xfYs9iBXUGz6pBkks0WYCAUY-2tXYUn4uBun7MBQSZYYY5ZtJscJEW1yaihVG24XVypCtOOtimJqrCfAGlh48FpvjBWJussx3EP_jUz0b-KNKIJJu_9zFejFn_69xeZ72UO-6HRC6z6Jjgmx5sH2IEoLGppALyMaPgKupBkkqH_y9uVH6d6jMPCikJyvBYukMo";

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
