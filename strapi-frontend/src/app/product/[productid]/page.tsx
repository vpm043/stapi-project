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
    const token = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjliN2JiZmVlMzQzZDVkNDQ5ZGFkODhmMjg0MGEyZTM3YzhkZWFlZTg5NjM4MGQ1ODA2YTc4NWVkMWQ1OTc5ZjAifQ.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJqWGJHYkZEQnpuIiwic2x1ZyI6InNpbmdsZXRvbmNvbW1lcmNlIiwiZW50ZXJwcmlzZSI6ZmFsc2UsInJlZ2lvbiI6InVzLWVhc3QtMSJ9LCJhcHBsaWNhdGlvbiI6eyJpZCI6IkdZZHFpUHlZak4iLCJraW5kIjoiaW50ZWdyYXRpb24iLCJwdWJsaWMiOmZhbHNlfSwic2NvcGUiOiJtYXJrZXQ6YWxsIiwiZXhwIjoxNzE4MTM0MzMwLCJ0ZXN0Ijp0cnVlLCJyYW5kIjowLjU5ODA2NDUxMTUzMjU3MjksImlhdCI6MTcxODEyNzEzMCwiaXNzIjoiaHR0cHM6Ly9jb21tZXJjZWxheWVyLmlvIn0.ItEz6MoYhhfwPUaGQvrAg1-vtxPcRFN50pvqWUbsKHHb3aXygKggn5I6Cdu1O2-Sgetd6uyG68kSBIg-u3zzR0bcgAnWjZGzqtb4r8m7TGwCAYXlrAUQVDJ91AO1OFxo-njYGecGTqr-BPxJOeuaAENPyM-PAJSO431aWxpPs_b8CO9nNhy90Iy4OLDqjFfzYOcOulkQBKyjoTx_UW0o6s8AtztzG2zHOd2e-sFneborhDVQ0Guq-rYRjkXhwESYRoqm1P-xlVmfkB1YqZ32kBJdpzy-s77Hgeuw2VwriV3Ddhrk9ccSEZUEb5tA2U2gpXZiva2f3CgSkqyTslQ3eZJ38z16L447J0B8Jd96WPgUueVC-YEeAUtstyRMEsogPzjYuLpdqvQMx-8D3Eq9adU-hUo7PQoLJIVhX-nOzglG4xRQ0n8xlHAm1njUhOtF_DUUwDZiHDVB9kcarloGoGvIxioTIwPb1RHGoUQwtaJGGo_gTPWWdKjGMsQ1fkBN-rZ8pKw3A_ihPVYxdHA2oyIPseptopTCxPnpzR6zcZaMgGgUOdGQZBBuMG-QJqX4sGAQbPf809f4B5an3yOLelpHVhToT0hNPeHxRrjbxt6Bum3LrEn_MiZfCHea3z_3Iy0OzxzrXiOnc7-OY416DxUqaNFiMmpF5vyW-HGRcLQ";

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
