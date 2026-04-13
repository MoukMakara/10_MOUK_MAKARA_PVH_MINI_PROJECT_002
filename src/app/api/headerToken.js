export default async function headerToken() {
  const session = await getServerSession(authOption);
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${session?.user?.token}`,
  };
}
