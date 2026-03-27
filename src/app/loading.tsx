export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
                    <div className="absolute inset-0 border-4 border-black rounded-full border-t-transparent animate-spin" />
                </div>
                <h2 className="text-2xl font-serif tracking-[0.3em]">PHKA</h2>
                <p className="text-sm text-gray-500 mt-2">Loading...</p>
            </div>
        </div>
    );
}
