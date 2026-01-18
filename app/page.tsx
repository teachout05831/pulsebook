export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          ServicePro
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Service business management platform
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Get Started
          </button>
          <button className="border border-gray-300 hover:border-primary text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </main>
  );
}
