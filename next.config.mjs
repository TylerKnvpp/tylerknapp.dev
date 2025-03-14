/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		SUPABASE_URL: process.env.SUPABASE_URL,
		SUPABASE_API_KEY: process.env.SUPABASE_API_KEY,
		NAME: process.env.NAME,
	},
};

export default nextConfig;
