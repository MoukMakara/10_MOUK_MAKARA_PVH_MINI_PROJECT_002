import { getServerSession } from "next-auth";
// import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { authOption } from "../../../api/auth/[...nextauth]/route";
import { getProductByIdService } from "../../../../service/auth/product.service";
import ProductDetailComponent from "../../../../components/ProductDetailComponent";

const ProductDetailPage = async (props) => {
  // Get ID from dynamic route - params is a Promise in Next.js 13+
  const params = await props.params;
  const productId = params?.productId;

  console.log("Product ID:", productId); // Debug log

  // Get session for authentication token
  const session = await getServerSession(authOption);
  const token = session?.accessToken;

  console.log("Token:", token ? "Present" : "Missing"); // Debug log

  // Calling API Service to fetch product by ID with authentication
  const productData = await getProductByIdService(productId, token);

  return (
    <>
      <ProductDetailComponent productData={productData} />
    </>
  );
};

export default ProductDetailPage;
